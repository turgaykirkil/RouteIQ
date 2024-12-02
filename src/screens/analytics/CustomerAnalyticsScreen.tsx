import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  Text,
  Card,
  useTheme,
  SegmentedButtons,
  ActivityIndicator,
} from 'react-native-paper';
import {
  LineChart,
  BarChart,
  PieChart,
  ContributionGraph,
} from 'react-native-chart-kit';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCustomers, fetchCustomers } from '../../store/slices/customerSlice';

const { width } = Dimensions.get('window');

const CustomerAnalyticsScreen = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await dispatch(fetchCustomers());
    setLoading(false);
  };

  const calculateRevenueData = () => {
    const revenueByDate = customers.reduce((acc, customer) => {
      const date = new Date(customer.statistics.lastOrderDate);
      const key = date.toISOString().split('T')[0];
      acc[key] = (acc[key] || 0) + customer.statistics.totalRevenue;
      return acc;
    }, {});

    const sortedDates = Object.keys(revenueByDate).sort();
    return {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          data: sortedDates.map(date => revenueByDate[date]),
        },
      ],
    };
  };

  const calculateCustomerStatusData = () => {
    const statusCount = customers.reduce((acc, customer) => {
      acc[customer.status] = (acc[customer.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      population: count,
      color: status === 'active' ? '#4CAF50' : status === 'inactive' ? '#F44336' : '#FFC107',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  const calculateOrderDistribution = () => {
    const orderCounts = customers.map(customer => customer.statistics.totalOrders);
    return {
      labels: ['0-5', '6-10', '11-20', '20+'],
      datasets: [
        {
          data: [
            orderCounts.filter(count => count <= 5).length,
            orderCounts.filter(count => count > 5 && count <= 10).length,
            orderCounts.filter(count => count > 10 && count <= 20).length,
            orderCounts.filter(count => count > 20).length,
          ],
        },
      ],
    };
  };

  const calculateActivityData = () => {
    return customers.reduce((acc, customer) => {
      const date = customer.lastVisit.split('T')[0];
      acc[date] = customer.statistics.totalOrders;
      return acc;
    }, {});
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(${theme.colors.primary}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={timeRange}
        onValueChange={setTimeRange}
        buttons={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
        style={styles.segmentedButtons}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Revenue Trend</Text>
          <LineChart
            data={calculateRevenueData()}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Customer Status Distribution</Text>
          <PieChart
            data={calculateCustomerStatusData()}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Order Distribution</Text>
          <BarChart
            data={calculateOrderDistribution()}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Customer Activity</Text>
          <ContributionGraph
            values={Object.entries(calculateActivityData()).map(([date, count]) => ({
              date,
              count,
            }))}
            endDate={new Date()}
            numDays={105}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Customers</Text>
            <Text variant="displaySmall">{customers.length}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Revenue</Text>
            <Text variant="displaySmall">
              ${customers
                .reduce((sum, customer) => sum + customer.statistics.totalRevenue, 0)
                .toLocaleString()}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Average Order Value</Text>
            <Text variant="displaySmall">
              ${Math.round(
                customers.reduce(
                  (sum, customer) => sum + customer.statistics.averageOrderValue,
                  0
                ) / customers.length
              ).toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedButtons: {
    margin: 16,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48%',
    marginBottom: 16,
  },
});

export default CustomerAnalyticsScreen;

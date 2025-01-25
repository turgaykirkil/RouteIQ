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
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { Customer } from '../../types/customer';
import { fetchCustomers } from '../../store/slices/customerSlice';

const { width } = Dimensions.get('window');

const CustomerAnalyticsScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customers = useSelector((state: RootState) => state.customer?.customers ?? []);
  const loading = useSelector((state: RootState) => state.customer?.loading ?? false);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const calculateRevenueData = () => {
    if (!customers?.length) return null;
    
    const revenueByDate = customers.reduce((acc, customer) => {
      const date = new Date(customer.createdAt);
      const key = date.toISOString().split('T')[0];
      // Örnek gelir hesabı - gerçek verilerinize göre düzenleyin
      acc[key] = (acc[key] || 0) + 1000; // Örnek sabit gelir
      return acc;
    }, {} as Record<string, number>);

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
    if (!customers?.length) return [];
    
    // Örnek statü verisi - gerçek verilerinize göre düzenleyin
    const statusCount = customers.reduce((acc, customer) => {
      const status = 'active'; // Örnek sabit statü
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      population: count,
      color: status === 'active' ? '#4CAF50' : status === 'inactive' ? '#F44336' : '#FFC107',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  const calculateOrderDistribution = () => {
    if (!customers?.length) return null;
    
    // Örnek sipariş verisi - gerçek verilerinize göre düzenleyin
    const orderCounts = customers.map(() => Math.floor(Math.random() * 30));
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
    if (!customers?.length) return {};
    
    return customers.reduce((acc, customer) => {
      const date = customer.createdAt.split('T')[0];
      acc[date] = 1; // Örnek aktivite sayısı
      return acc;
    }, {} as Record<string, number>);
  };

  const calculateCostData = () => {
    if (!customers?.length) return null;
    
    // Örnek maliyet verisi - gerçek verilerinize göre düzenleyin
    const costData = customers.map(customer => {
      return Math.floor(Math.random() * 1000); // Örnek sabit maliyet
    });
    
    return {
      labels: customers.map(customer => customer.name),
      datasets: [
        {
          data: costData,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const revenueData = calculateRevenueData();
  const statusData = calculateCustomerStatusData();
  const orderData = calculateOrderDistribution();
  const activityData = calculateActivityData();
  const costData = calculateCostData();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Müşteri Analizi
          </Text>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'week', label: 'Hafta' },
              { value: 'month', label: 'Ay' },
              { value: 'year', label: 'Yıl' },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      {revenueData && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              Gelir Grafiği
            </Text>
            <LineChart
              data={revenueData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {statusData.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              Müşteri Durumu
            </Text>
            <PieChart
              data={statusData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {orderData && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              Sipariş Dağılımı
            </Text>
            <BarChart
              data={orderData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {costData && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              Maliyet Analizi
            </Text>
            <BarChart
              data={costData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={[styles.card, styles.lastCard]}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            Aktivite Haritası
          </Text>
          <ContributionGraph
            values={Object.entries(activityData).map(([date, count]) => ({
              date,
              count: count as number,
            }))}
            endDate={new Date()}
            numDays={105}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedButtons: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default CustomerAnalyticsScreen;

import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../store';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: Implement refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing.lg,
        },
        welcomeText: {
          ...theme.typography.body,
          color: theme.colors.text,
        },
        nameText: {
          ...theme.typography.h2,
          color: theme.colors.primary,
        },
        statsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: theme.spacing.md,
        },
        statsCard: {
          flex: 1,
          margin: theme.spacing.xs,
          ...theme.shadows.small,
        },
        statsNumber: {
          ...theme.typography.h2,
          marginVertical: theme.spacing.xs,
        },
        statsLabel: {
          ...theme.typography.caption,
          color: theme.colors.text,
        },
        chartCard: {
          margin: theme.spacing.md,
          ...theme.shadows.small,
        },
        chart: {
          marginVertical: theme.spacing.md,
          borderRadius: 16,
        },
        tasksCard: {
          margin: theme.spacing.md,
          ...theme.shadows.small,
        },
        cardHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
        },
        cardTitle: {
          ...theme.typography.h2,
          color: theme.colors.text,
        },
        seeAllText: {
          color: theme.colors.primary,
          ...theme.typography.body,
        },
        taskItem: {
          marginBottom: theme.spacing.md,
        },
        taskInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.xs,
        },
        taskTitle: {
          ...theme.typography.body,
          color: theme.colors.text,
        },
        taskTime: {
          ...theme.typography.caption,
          color: theme.colors.placeholder,
        },
        progressBar: {
          height: 6,
          borderRadius: 3,
        },
        recentActivitiesCard: {
          margin: theme.spacing.md,
          marginBottom: theme.spacing.xl,
          ...theme.shadows.small,
        },
        activityItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: theme.spacing.md,
        },
        activityInfo: {
          marginLeft: theme.spacing.md,
          flex: 1,
        },
        activityTitle: {
          ...theme.typography.body,
          color: theme.colors.text,
        },
        activityTime: {
          ...theme.typography.caption,
          color: theme.colors.placeholder,
        },
      }),
    [theme]
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.name}</Text>
        </View>
        <TouchableOpacity>
          <Avatar.Image
            size={50}
            source={{ uri: 'https://i.pravatar.cc/150' }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Icon name="account-group" size={24} color={theme.colors.primary} />
            <Text style={styles.statsNumber}>150</Text>
            <Text style={styles.statsLabel}>Total Customers</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Icon name="calendar-check" size={24} color={theme.colors.success} />
            <Text style={styles.statsNumber}>28</Text>
            <Text style={styles.statsLabel}>Tasks Done</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Icon name="currency-usd" size={24} color={theme.colors.accent} />
            <Text style={styles.statsNumber}>$12.5K</Text>
            <Text style={styles.statsLabel}>Revenue</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Sales Overview</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.tasksCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.taskItem}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Meet with John Doe</Text>
              <Text style={styles.taskTime}>10:00 AM</Text>
            </View>
            <ProgressBar
              progress={0.7}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.taskItem}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Product Presentation</Text>
              <Text style={styles.taskTime}>2:30 PM</Text>
            </View>
            <ProgressBar
              progress={0.3}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.recentActivitiesCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Recent Activities</Text>
          <View style={styles.activityItem}>
            <Icon name="account-plus" size={24} color={theme.colors.primary} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>New Customer Added</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Icon name="sale" size={24} color={theme.colors.success} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Sale Completed</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;

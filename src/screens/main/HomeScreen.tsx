import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  ProgressBar,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../store';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { spacing, typography, shadows } from '../../theme';
import theme from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList } from '../../navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const themeWithCustom = theme;
  const user = useSelector((state: RootState) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const handleProfilePress = () => {
    navigation.navigate('Profile', { screen: 'ProfileMain' });
  };

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
        safeArea: {
          flex: 1,
          backgroundColor: themeWithCustom.colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: themeWithCustom.colors.background,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: themeWithCustom.spacing.lg,
        },
        welcomeText: {
          ...themeWithCustom.typography.body,
          color: themeWithCustom.colors.onSurface,
        },
        nameText: {
          ...themeWithCustom.typography.h2,
          color: themeWithCustom.colors.primary,
          fontWeight: "bold",
        },
        statsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: themeWithCustom.spacing.md,
          paddingVertical: themeWithCustom.spacing.sm,
        },
        statsCard: {
          flex: 1,
          marginHorizontal: themeWithCustom.spacing.xs,
          minHeight: 140,
          height: '100%',
          ...themeWithCustom.shadows.small,
        },
        statsCardContent: {
          alignItems: 'center',
          justifyContent: 'center',
          padding: themeWithCustom.spacing.md,
          height: '100%',
        },
        statsIconContainer: {
          marginBottom: themeWithCustom.spacing.sm,
          alignItems: 'center',
          paddingTop: themeWithCustom.spacing.xs,
        },
        statsNumber: {
          ...themeWithCustom.typography.h2,
          fontWeight: "bold",
          textAlign: 'center',
          marginVertical: themeWithCustom.spacing.sm,
        },
        statsLabel: {
          ...themeWithCustom.typography.caption,
          color: themeWithCustom.colors.onSurface,
          textAlign: 'center',
          marginBottom: themeWithCustom.spacing.xs,
        },
        chartCard: {
          margin: themeWithCustom.spacing.md,
          ...themeWithCustom.shadows.small,
        },
        chart: {
          marginVertical: themeWithCustom.spacing.md,
          borderRadius: 16,
        },
        tasksCard: {
          margin: themeWithCustom.spacing.md,
          ...themeWithCustom.shadows.small,
        },
        cardHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: themeWithCustom.spacing.md,
        },
        cardTitle: {
          ...themeWithCustom.typography.h2,
          color: themeWithCustom.colors.onSurface,
          fontWeight: "bold",
        },
        seeAllText: {
          color: themeWithCustom.colors.primary,
          ...themeWithCustom.typography.body,
        },
        taskItem: {
          marginBottom: themeWithCustom.spacing.md,
        },
        taskInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: themeWithCustom.spacing.xs,
        },
        taskTitle: {
          ...themeWithCustom.typography.body,
          color: themeWithCustom.colors.onSurface,
        },
        taskTime: {
          ...themeWithCustom.typography.caption,
          color: themeWithCustom.colors.onSurfaceVariant,
        },
        progressBar: {
          height: 6,
          borderRadius: 3,
        },
        recentActivitiesCard: {
          margin: themeWithCustom.spacing.md,
          marginBottom: themeWithCustom.spacing.xl,
          ...themeWithCustom.shadows.small,
        },
        activityItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: themeWithCustom.spacing.md,
        },
        activityInfo: {
          marginLeft: themeWithCustom.spacing.md,
          flex: 1,
        },
        activityTitle: {
          ...themeWithCustom.typography.body,
          color: themeWithCustom.colors.onSurface,
        },
        activityTime: {
          ...themeWithCustom.typography.caption,
          color: themeWithCustom.colors.onSurfaceVariant,
        },
      }),
    [themeWithCustom]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <TouchableOpacity onPress={handleProfilePress}>
            <Avatar.Image
              size={50}
              source={{ uri: 'https://i.pravatar.cc/150' }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Icon name="account-group" size={24} color={themeWithCustom.colors.primary} />
              </View>
              <Text style={styles.statsNumber}>150</Text>
              <Text style={styles.statsLabel}>Total Customers</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Icon name="calendar-check" size={24} color={themeWithCustom.colors.primary} />
              </View>
              <Text style={styles.statsNumber}>28</Text>
              <Text style={styles.statsLabel}>Tasks Done</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Icon name="currency-usd" size={24} color={themeWithCustom.colors.primary} />
              </View>
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
                backgroundColor: themeWithCustom.colors.background,
                backgroundGradientFrom: themeWithCustom.colors.background,
                backgroundGradientTo: themeWithCustom.colors.background,
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
                color={themeWithCustom.colors.primary}
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
                color={themeWithCustom.colors.primary}
                style={styles.progressBar}
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.recentActivitiesCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Recent Activities</Text>
            <View style={styles.activityItem}>
              <Icon name="account-plus" size={24} color={themeWithCustom.colors.primary} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>New Customer Added</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <Icon name="sale" size={24} color={themeWithCustom.colors.primary} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Sale Completed</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

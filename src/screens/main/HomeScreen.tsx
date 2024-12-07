import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {Text, Card, Avatar, ProgressBar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootState} from '../../store';
import {Dimensions} from 'react-native';
import {spacing, typography, shadows} from '../../theme';
import theme from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {MainTabParamList} from '../../navigation/types';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {customerAPI, taskAPI, salesAPI} from '../../services/api';
import {LineChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface Customer {
  id: string;
  name: string;
  company: string;
  salesRepId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priority: string;
}

interface Sale {
  id: string;
  amount: number;
  date: string;
}

const HomeScreen = () => {
  const themeWithCustom = theme;
  const user = useSelector((state: RootState) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const fetchData = async () => {
    try {
      // Müşterileri getir
      const data = await customerAPI.getAll();
      setCustomers(data);

      // Görevleri getir
      const tasksResponse = await taskAPI.getAll();
      let allTasks = [];
      if (tasksResponse?.data?.data) {
        allTasks = tasksResponse.data.data;
      } else if (Array.isArray(tasksResponse.data)) {
        allTasks = tasksResponse.data;
      }

      const todayTasks = allTasks.filter((task: Task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toDateString();
        const today = new Date().toDateString();
        return taskDate === today;
      });

      setTasks(todayTasks.slice(0, 3));

      // Satış verilerini getir
      const salesResponse = await salesAPI.getAll();
      const defaultSalesData = [20, 45, 28, 80, 99, 43];
      let newSalesData = defaultSalesData;

      if (salesResponse?.data) {
        newSalesData = Array.isArray(salesResponse.data)
          ? salesResponse.data.map(sale => sale.amount)
          : defaultSalesData;
      }

      newSalesData = newSalesData.map((value, index) => {
        const numValue = Number(value);
        return !numValue || numValue <= 0
          ? defaultSalesData[index]
          : numValue;
      });

      setSales(salesResponse?.data);

    } catch (error) {
      console.error(' Data fetching error:', error);
      console.error(' Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      setCustomers([]);
      setTasks([]);
      setSales([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  const handleProfilePress = () => {
    navigation.navigate('Profile', {screen: 'ProfileMain'});
  };

  // Satış verilerini çeyrek bazında gruplandıran fonksiyon
  const groupSalesByQuarter = (sales: Sale[]) => {
    const quarterMap: { [key: string]: number } = {};

    sales.forEach(sale => {
      const date = new Date(sale.date);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const quarterKey = `${year} Q${quarter}`;

      quarterMap[quarterKey] = (quarterMap[quarterKey] || 0) + sale.amount;
    });

    // Sıralı çeyrek anahtarları oluştur
    const sortedQuarters = Object.keys(quarterMap).sort((a, b) => {
      const [yearA, quarterA] = a.split(' ');
      const [yearB, quarterB] = b.split(' ');
      
      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }
      
      return parseInt(quarterA.replace('Q', '')) - parseInt(quarterB.replace('Q', ''));
    });

    return {
      labels: sortedQuarters,
      datasets: [
        {
          data: sortedQuarters.map(quarter => quarterMap[quarter] / 1000), // Binlik formatta göster
          color: () => themeWithCustom.colors.primary,
          strokeWidth: 3
        }
      ]
    };
  };

  // Veri hazırlama fonksiyonunu çeyrek bazında güncelledim
  const prepareChartData = () => {
    // Tüm satışları tarihe göre sırala
    const sortedSales = sales.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Son 12 ayın verilerini al (yaklaşık 4 çeyrek)
    const last12MonthsSales = sortedSales.slice(-12);

    return groupSalesByQuarter(last12MonthsSales);
  };

  // Ekran genişliğine göre etiket gösterimi
  const getChartLabels = () => {
    const screenWidth = Dimensions.get('window').width;
    const sales = prepareChartData().labels;

    // Ekran genişliği arttıkça daha fazla etiket göster
    if (screenWidth > 600) {
      // Tablet veya geniş ekran: tüm etiketleri göster
      return sales;
    } else if (screenWidth > 400) {
      // Orta boy ekran: her 2. etiketi göster
      return sales.filter((_, index) => index % 2 === 0);
    } else {
      // Dar ekran: her 3. etiketi göster
      return sales.filter((_, index) => index % 3 === 0);
    }
  };

  // Sayı formatlamak için yardımcı fonksiyon
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  // Dummy recent activities data
  const recentActivities = [
    {
      icon: 'account-plus',
      title: 'Yeni Müşteri Eklendi',
      time: '2 saat önce',
    },
    {
      icon: 'sale',
      title: 'Satış Tamamlandı',
      time: '5 saat önce',
    },
  ];

  const styles = StyleSheet.create({
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
      ...themeWithCustom.typography.h2,
      color: themeWithCustom.colors.onSurface,
    },
    nameText: {
      ...themeWithCustom.typography.h1,
      color: themeWithCustom.colors.primary,
      fontWeight: 'bold',
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
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: themeWithCustom.spacing.sm,
    },
    statsLabel: {
      ...themeWithCustom.typography.caption,
      color: themeWithCustom.colors.onSurface,
      textAlign: 'center',
      marginBottom: themeWithCustom.spacing.xs,
    },
    chartContainer: {
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: themeWithCustom.spacing.md,
      width: '100%',
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
      fontWeight: 'bold',
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
    card: {
      margin: themeWithCustom.spacing.md,
      ...themeWithCustom.shadows.small,
    },
    cardValue: {
      ...themeWithCustom.typography.h2,
      color: themeWithCustom.colors.onSurface,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  // Müşteri sayısını hesapla
  const customerCount = useMemo(() => {
    if (!Array.isArray(customers) || customers.length === 0) {
      return 0;
    }

    // Artık customers array'i zaten kullanıcının rolüne göre filtrelenmiş durumda
    const count = customers.length;
    return count;
  }, [customers, user]);

  // Toplam satışları hesapla
  const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hoş geldiniz,</Text>
            <Text style={styles.nameText}>{user?.name}</Text>
          </View>
          <TouchableOpacity onPress={handleProfilePress}>
            <Avatar.Image
              size={70}
              source={{uri: 'https://i.pravatar.cc/150'}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Icon
                  name="account-group"
                  size={24}
                  color={themeWithCustom.colors.primary}
                />
              </View>
              <Text style={styles.statsNumber}>{customerCount}</Text>
              <Text style={styles.statsLabel}>Toplam Müşteri</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Icon
                  name="calendar-check"
                  size={24}
                  color={themeWithCustom.colors.primary}
                />
              </View>
              <Text style={styles.statsNumber}>{tasks.length}</Text>
              <Text style={styles.statsLabel}>Bugünkü Görevler</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Icon
                  name="currency-try"
                  size={24}
                  color={themeWithCustom.colors.primary}
                />
              </View>
              <Text style={styles.statsNumber}>
                {formatNumber(totalSales)}
              </Text>
              <Text style={styles.statsLabel}>Toplam Satış</Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.tasksCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Satış İstatistikleri</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={prepareChartData()}
                width={Dimensions.get('window').width - 4 * themeWithCustom.spacing.md}
                height={220}
                chartConfig={{
                  backgroundColor: themeWithCustom.colors.background,
                  backgroundGradientFrom: themeWithCustom.colors.background,
                  backgroundGradientTo: themeWithCustom.colors.background,
                  decimalPlaces: 1,
                  color: () => themeWithCustom.colors.primary,
                  labelColor: () => themeWithCustom.colors.text,
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: themeWithCustom.colors.primary
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '0',
                    stroke: themeWithCustom.colors.disabled,
                    strokeWidth: 0.5
                  }
                }}
                formatYLabel={(value) => `₺${value}K`}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  backgroundColor: themeWithCustom.colors.background,
                  alignSelf: 'center'
                }}
                withShadow={false}
                withInnerLines={true}
                withOuterLines={false}
                segments={4}
                horizontalLabelRotation={0}
                xLabelsOffset={0}
                fromZero={true}
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.tasksCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Bugünkü Görevler</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
                <Text style={styles.seeAllText}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>

            {tasks.map((task, index) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskTime}>
                    {new Date(task.dueDate).toLocaleTimeString()}
                  </Text>
                </View>
                <ProgressBar
                  progress={task.status === 'completed' ? 1 : 0.5}
                  color={themeWithCustom.colors.primary}
                  style={styles.progressBar}
                />
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.recentActivitiesCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Son Aktiviteler</Text>
            {recentActivities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Icon
                  name={activity.icon}
                  size={24}
                  color={themeWithCustom.colors.primary}
                />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

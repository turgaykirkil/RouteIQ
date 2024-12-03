import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type MainTabParamList = {
  Home: undefined;
  Tasks: NavigatorScreenParams<TaskStackParamList>;
  Customers: NavigatorScreenParams<CustomerStackParamList>;
  Map: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type TaskStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
  NewTask: undefined;
  EditTask: { taskId: string };
};

export type CustomerStackParamList = {
  CustomerList: undefined;
  CustomerDetail: { customerId: string };
  NewCustomer: undefined;
  EditCustomer: { customerId: string };
  CustomerMap: undefined;
  CustomerAnalytics: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProfileEdit: undefined;
  ProfileSettings: undefined;
};

export type SettingsStackParamList = {
  SettingsList: undefined;
  // Daha sonra eklenecek diğer ayar ekranları buraya eklenebilir
  // ProfileSettings: undefined;
  // AppSettings: undefined;
  // NotificationSettings: undefined;
};

export type TaskStackNavigationProp = NativeStackNavigationProp<TaskStackParamList>;
export type CustomerStackNavigationProp = NativeStackNavigationProp<CustomerStackParamList>;
export type ProfileStackNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type SettingsStackNavigationProp = NativeStackNavigationProp<SettingsStackParamList>;
export type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Nested navigation için composite types
export type TaskScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList & TaskStackParamList & CustomerStackParamList
>;

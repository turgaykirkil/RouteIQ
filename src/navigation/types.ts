import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
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
};

export type TaskStackNavigationProp = NativeStackNavigationProp<TaskStackParamList>;
export type CustomerStackNavigationProp = NativeStackNavigationProp<CustomerStackParamList>;
export type ProfileStackNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type SettingsStackNavigationProp = NativeStackNavigationProp<SettingsStackParamList>;
export type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type TaskScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList & TaskStackParamList & CustomerStackParamList
>;

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main: undefined;
};

export type MainTabParamList = {
  Tasks: NavigatorScreenParams<TaskStackParamList>;
  Customers: NavigatorScreenParams<CustomerStackParamList>;
  Settings: undefined;
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
};

export type TaskStackNavigationProp = NativeStackNavigationProp<TaskStackParamList>;
export type CustomerStackNavigationProp = NativeStackNavigationProp<CustomerStackParamList>;

// Nested navigation için composite types
export type TaskScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList & TaskStackParamList & CustomerStackParamList
>;

export type CustomerScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList & CustomerStackParamList & TaskStackParamList
>;

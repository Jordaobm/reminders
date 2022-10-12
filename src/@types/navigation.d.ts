export type RootStackParamList = {
  Home: undefined;
  Reminder: any;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

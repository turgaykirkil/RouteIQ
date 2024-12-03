import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Text, 
  useTheme, 
  TouchableRipple 
} from 'react-native-paper';
import { 
  GestureHandlerRootView, 
  PanGestureHandler, 
  PanGestureHandlerGestureEvent 
} from 'react-native-gesture-handler';
// import Animated, { 
//   useAnimatedStyle, 
//   useSharedValue, 
//   withSpring,
//   useAnimatedGestureHandler,
//   runOnJS 
// } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { ProfileStackNavigationProp } from '../../navigation/types';

const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProfileStackNavigationProp>();
  // const translateY = useSharedValue(0);

  // const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
  //   onStart: (_, ctx: any) => {
  //     ctx.startY = translateY.value;
  //   },
  //   onActive: (event, ctx: any) => {
  //     if (event.translationY > 0) {
  //       translateY.value = ctx.startY + event.translationY;
  //     }
  //   },
  //   onEnd: (event) => {
  //     if (event.translationY > 200) {
  //       runOnJS(navigation.goBack)();
  //     } else {
  //       translateY.value = withSpring(0);
  //     }
  //   },
  // });

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: translateY.value }],
  //   };
  // });

  return (
    <View style={styles.container}>
      <TouchableRipple
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text>Go Back</Text>
      </TouchableRipple>
      <View style={styles.content}>
        <Text>Profile Screen</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ProfileScreen;

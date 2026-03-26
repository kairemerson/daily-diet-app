import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import PatientCard from "./PatientCard";

type Props = {
  index: number;
} & React.ComponentProps<typeof PatientCard>;

export function AnimatedPatientCard({ index, ...props }: Props) {
  const translateX = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      index * 80, // 👈 controla o "um atrás do outro"
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      })
    );

    opacity.value = withDelay(
      index * 100,
      withTiming(1, { duration: 400 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}> 
      <PatientCard {...props} />
    </Animated.View>
  );
}
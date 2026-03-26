import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  width?: number | string;
  height?: number | string;
  rounded?: number;
  className?: string;
};

export function Skeleton({
  width = "100%",
  height = 20,
  rounded = 8,
  className = "",
}: Props) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1400 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [-300, 300]);

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={{ width, height, borderRadius: rounded }}
      className={`bg-gray-5 overflow-hidden ${className}`}
    >
      <AnimatedGradient
        colors={[
            "transparent",
            "#FFFFFF10",
            "#FFFFFF40",
            "#FFFFFFaa",
            "#FFFFFF40",
            "#FFFFFF10",
            "transparent",
        ]}
        locations={[0, 0.2, 0.35, 0.5, 0.65, 0.8, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
            {
            width: "80%", // 👈 um pouco maior ajuda suavizar
            height: "100%",
            },
            animatedStyle,
        ]}
        />
    </View>
  );
}
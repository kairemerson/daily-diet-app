import { View, Image, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS
} from "react-native-reanimated";
import { useEffect } from "react";

const { width } = Dimensions.get("window");

type Props = {
  onFinish: () => void;
};

export function AnimatedSplash({ onFinish }: Props) {
  const logoX = useSharedValue(width);      // vem da direita
  const nameX = useSharedValue(-width);     // vem da esquerda
  const opacity = useSharedValue(0);

  useEffect(() => {
    logoX.value = withTiming(0, {
      duration: 800,
    //   easing: Easing.out(Easing.exp)
      easing: Easing.out(Easing.back(1.5))
    });

    nameX.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp)
    });

    opacity.value = withDelay(
      200,
      withTiming(1, { duration: 600 })
    );

    // finaliza splash depois da animação
    setTimeout(() => {
      runOnJS(onFinish)();
    }, 1600);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: logoX.value }],
    opacity: opacity.value
  }));

  const nameStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: nameX.value }],
    opacity: opacity.value
  }));

  return (
    <View className="flex-1 items-center justify-center bg-white flex-row gap-3">
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[{ width: 60, height: 60 }, logoStyle]}
        resizeMode="contain"
      />

      <Animated.Image
        source={require("../assets/name.png")}
        style={[{ width: 140, height: 30 }, nameStyle]}
        resizeMode="contain"
      />
    </View>
  );
}
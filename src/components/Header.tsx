import { Text } from "react-native";

type Props = {
  title: string;
};

export function Header({ title }: Props) {
  return (
    <Text className="text-lg font-bold mt-6 mb-3">
      {title}
    </Text>
  );
}

import { View, Text, TouchableOpacity } from "react-native";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  value?: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};

export function RadioGroup<T extends string>({
  value,
  onChange,
  options,
}: Props<T>) {
  return (
    <View className="gap-3">
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
            className={`flex-row items-center justify-between px-4 py-2 rounded-md border
              ${
                isSelected
                  ? "border-green-mid bg-green-50"
                  : "border-gray-5 bg-white"
              }
            `}
          >
            <Text className="text-base font-nunito_regular">
              {option.label}
            </Text>

            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center
                ${
                  isSelected
                    ? "border-green-500"
                    : "border-gray-4"
                }
              `}
            >
              {isSelected && (
                <View className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
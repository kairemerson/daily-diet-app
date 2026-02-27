import { ReactNode } from "react"
import { View, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

type AppCardProps = {
  title: string
  icon?: keyof typeof MaterialIcons.glyphMap
  children: ReactNode
  className?: string
}

export function AppCard({
  title,
  icon,
  children,
  className = "",
}: AppCardProps) {
  return (
    <View
      className={`
        bg-white
        rounded-2xl
        p-5
        mb-4
        shadow-sm
        ${className}
      `}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-4">
        {icon && (
          <View className="w-10 h-10 rounded-xl bg-gray-6 items-center justify-center mr-3">
            <MaterialIcons
              name={icon}
              size={20}
              color="#1B1D1E"
            />
          </View>
        )}

        <Text className="text-lg font-nunito_bold text-gray-1">
          {title}
        </Text>
      </View>

      {/* Content */}
      <View>
        {children}
      </View>
    </View>
  )
}
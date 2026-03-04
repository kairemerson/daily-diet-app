import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { colors } from "../theme/colors";

type Variant = "primary" | "secondary"

type ButtonProps = TouchableOpacityProps & {
    title: string
    onPress?: () => void
    iconName?: keyof typeof MaterialIcons.glyphMap
    variant?: Variant
    className?: string
}

export function Button({title, iconName, onPress, variant="primary", className=  "", ...rest}: ButtonProps) {

    const isPrimary = variant === "primary"

    return (
        <TouchableOpacity 
            onPress={onPress} 
            className={`
                    w-full
                    flex-row
                    items-center
                    justify-center
                    gap-2
                    py-4
                    rounded-2xl
                    
                ${
                    isPrimary
                        ? "bg-green-dark"
                        : "bg-gray-6 border border-gray-5"
                    }
                ${className}
            `}
            {...rest}>

            {iconName && (
                <MaterialIcons
                    name={iconName}
                    size={20}
                    color={isPrimary ? colors.white : colors.gray[1]}
                />
            )}

            <Text
                className={`
                font-nunito_bold
                
                ${
                    isPrimary
                    ? "text-white"
                    : "text-gray-1"
                }
                `}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}
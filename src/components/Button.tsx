import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { colors } from "../theme/colors";

type Variant = "primary" | "secondary"

type ButtonProps = TouchableOpacityProps & {
    title: string
    onPress?: () => void
    iconName?: keyof typeof MaterialIcons.glyphMap
    variant?: Variant
    isLoading?: boolean
    className?: string
}

export function Button({title, iconName, onPress, variant="primary", isLoading=false, className="", ...rest}: ButtonProps) {

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
                    disabled:bg-green-dark/50
                ${
                    isPrimary
                        ? "bg-green-dark"
                        : "bg-gray-6 border-[0.5px] border-gray-5"
                    }
                ${className}
            `}
            {...rest}>

            {isLoading ? (
                <ActivityIndicator className={`${isPrimary ? "text-white" : "text-gray-1"}`}/>
            ) : (
                <>
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
                </>

            )}
        </TouchableOpacity>
    )
}
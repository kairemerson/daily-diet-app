
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../theme/colors'

type AppInputProps = TextInputProps & {
    name: string
    control: Control<any>
    label?: string
    icon?: keyof typeof MaterialIcons.glyphMap
}

export default function AppInput({control, name, label, icon, secureTextEntry, ...rest}: AppInputProps) {

    const [isSecure, setIsSecure] = useState(secureTextEntry);
  return (
    <View className='mb-4'>
      {label && (
        <Text className='font-nunito_bold text-base text-gray-1 mb-1'>
            {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}, fieldState: {error}})=> (
            <>
                <View className={`flex-row items-center bg-white rounded-md px-3 border ${error ? "border-red-dark" : "border-gray-5"}`}>
                    {icon && (
                        <MaterialIcons
                            name={icon}
                            size={20}
                            color={colors.gray[4]}
                            style={{marginRight: 8}}
                        />

                    )}

                    <TextInput
                        className='flex-1 h-12 font-nunito_regular text-base text-gray-1'
                        placeholderTextColor={colors.gray[4]}
                        secureTextEntry={isSecure}
                        value={value}
                        onChangeText={onChange}
                        {...rest}
                    />

                    {secureTextEntry && (
                        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                            <MaterialIcons
                                name={isSecure ? "visibility-off" : "visibility"}
                                size={20}
                                color={colors.gray[3]}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {error && (
                    <Text className='text-red-dark text-xs mt-1'>
                        {error.message}
                    </Text>
                )}
            </>
        )}
      />
    </View>
  )
}


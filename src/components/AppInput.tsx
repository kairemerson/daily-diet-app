
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

export default function AppInput({control, name, label, icon, secureTextEntry, editable=true, className, ...rest}: AppInputProps) {

    const [isSecure, setIsSecure] = useState(secureTextEntry);
  return (
    <View className='mb-2'>
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
                <View className={`flex-row items-center rounded-md px-3 border 
                    ${!editable ? 'bg-gray-6 border-gray-5 opacity-70' : 'bg-white'} 
                    ${error ? 'border-red-dark' : 'border-gray-5'}`}>
                    {icon && (
                        <MaterialIcons
                            name={icon}
                            size={20}
                            color={colors.gray[4]}
                            style={{marginRight: 8}}
                        />

                    )}

                    <TextInput
                        className={`flex-1 font-nunito_regular text-base 
                            ${!editable ? 'text-gray-3' : 'text-gray-1'} 
                            ${rest.multiline ? 'py-3' : 'h-12'} ${className || ''}`}
                        placeholderTextColor={colors.gray[4]}
                        secureTextEntry={isSecure}
                        value={value}
                        onChangeText={onChange}
                        editable={editable}
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


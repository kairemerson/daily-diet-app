import React, { useState } from "react"
import { View, Text } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { Controller } from "react-hook-form"
import { colors } from "../theme/colors"

type Option = {
  label: string
  value: number
}

type Props = {
  control: any
  name: string
  label: string
  items: Option[]
  error?: string
}

export function AppSelect({
  control,
  name,
  label,
  items,
  error
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <View style={{ zIndex: open ? 1000 : 1, flex: 1, marginBottom: 8 }}>
      <Text
        style={{
          fontFamily: "Nunito_700Bold",
          fontSize: 14,
          marginBottom: 6,
          color: colors.gray[1],
        }}
      >
        {label}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const newValue =
                typeof callback === "function"
                  ? callback(value)
                  : callback
              onChange(newValue)
            }}
            maxHeight={250}
            // listMode="SCROLLVIEW"
            listMode="MODAL"
            modalProps={{
            animationType: "slide"
            }}
            style={{
                backgroundColor: "#fff",
                borderColor: error
                    ? colors.red?.dark ?? "red"
                    : colors.gray[5],
                borderRadius: 8,
            
            }}
            dropDownContainerStyle={{
              borderColor: colors.gray[5],
              borderRadius: 8,
            }}
            textStyle={{
              fontSize: 14,
              color: colors.gray[1],
            }}
            placeholder="Selecione"
            placeholderStyle={{
              color: colors.gray[4],
            }}
          />
        )}
      />

      {error && (
        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  )
}
import { colors, spacing } from "app/theme"
import React, { useState } from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle, ImageStyle, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { Text } from "./Text"
import { Icon } from "./Icon"
import { TxKeyPath } from "app/i18n"

const SelectField = React.forwardRef((props: DropdownProps, ref: React.Ref<any>) => {
  const { options, txValue, styles } = props

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const dropdownHeight = useSharedValue(0)
  const paddingVertical = useSharedValue(0)

  const screenHeight = Dimensions.get("window").height

  const handleOptionSelect = (option: Option) => {
    toggleDropdown()
    setSelectedOption(option.value)
    option.onPress?.(option)
  }

  const $animatedDropdownStyle = useAnimatedStyle(() => {
    return {
      maxHeight: dropdownHeight.value,
      paddingVertical: paddingVertical.value,
    }
  })

  const iconRotation = useSharedValue(0)
  const $animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconRotation.value}deg` }],
    }
  })

  const toggleDropdown = () => {
    dropdownHeight.value = withTiming(dropdownHeight.value === 0 ? screenHeight * 0.3 : 0, {
      duration: 300,
    })
    paddingVertical.value = withTiming(dropdownHeight.value === 0 ? spacing.sm : 0, {
      duration: 400,
    })
    iconRotation.value = withTiming(dropdownHeight.value === 0 ? 180 : 0)
  }

  const closeDropdown = () => {
    if (dropdownHeight.value > 0) {
      toggleDropdown()
    }
  }
  React.useImperativeHandle(ref, () => ({
    closeDropdown,
    setSelectedOption,
  }))

  return (
    <View style={[$dropdown, styles]}>
      <TouchableOpacity style={$dropdownToggle} onPress={toggleDropdown}>
        <Text
          tx={
            selectedOption
              ? (options.find((o) => o.value === selectedOption)?.label as TxKeyPath)
              : (txValue as TxKeyPath)
          }
          style={$txValueStyle}
        />
        <Animated.View style={$animatedIconStyle}>
          <Icon icon="up2" style={$iconStyle} color={colors.textBrandSecondary} size={18} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[$dropdownMenu, $dropDownMenueshadow, $animatedDropdownStyle]}>
        {options?.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={$dropdownMenuItem}
            onPress={() => handleOptionSelect(option)}
          >
            {option.withIcon && (
              <Icon
                icon={"books"}
                color={colors.textBrand}
                size={18}
                style={{ marginRight: spacing.xs }}
              />
            )}
            <View style={{ gap: spacing.xxxs, flexDirection: "row" }}>
              <Text
                style={[{ color: option.withIcon ? colors.textBrand : colors.textPrimary }]}
                tx={option.label as TxKeyPath}
              />
              <Text
                style={[{ color: option.withIcon ? colors.textBrand : colors.textPrimary }]}
                tx={option.note ? (option.note as TxKeyPath) : (" " as TxKeyPath)}
              />
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  )
})

export default SelectField

const $dropdown: ViewStyle = {
  position: "relative",
  zIndex: 10,
  borderBottomColor: colors.textBrandSecondary,
  borderBottomWidth: spacing.xxxs,
  paddingBottom: spacing.xxs,
}

const $dropdownToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}
const $dropdownMenu: ViewStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: colors.white,
  borderRadius: 4,
  overflow: "hidden",
  marginTop: spacing.sm,
  paddingHorizontal: spacing.xs,
  gap: spacing.md,
}
const $dropdownMenuItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $dropDownMenueshadow: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 2,
}

const $iconStyle: ImageStyle = {
  transform: [{ rotate: "180deg" }],
}

const $txValueStyle: TextStyle = {
  color: colors.textBrandSecondary,
  fontSize: 16,
  writingDirection: "rtl",
}

interface Option {
  value: string
  label: string
  withIcon?: boolean
  note?: string
  disabled?: boolean
  onPress?: (option: Option) => void
}

interface DropdownProps {
  options: Option[]
  txValue: string
  styles: ViewStyle
}

import React, { ComponentType } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"
import { colors, metrics, spacing, typography } from "../theme"
import { Text, TextProps } from "./Text"
import { isRTL } from "app/i18n"

type Presets = keyof typeof $viewPresets

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    ...rest
  } = props

  const preset: Presets = $viewPresets[props.preset] ? props.preset : "default"
  function $viewStyle({ pressed }) {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
    ]
  }
  function $textStyle({ pressed }) {
    return [
      $textPresets[preset],
      $textStyleOverride,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
      {
        fontFamily: isRTL ? typography.primary.medium : typography.primaryLatin.medium,
      },
    ]
  }
  if (props.preset === "icon") {
    return (
      <Pressable style={$viewStyle} accessibilityRole="button" {...rest}>
        {children}
      </Pressable>
    )
  }

  return (
    <Pressable style={$viewStyle} accessibilityRole="button" {...rest}>
      {(state) => (
        <>
          {!!LeftAccessory && <LeftAccessory style={$leftAccessoryStyle} pressableState={state} />}

          <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}>
            {children}
          </Text>

          {!!RightAccessory && (
            <RightAccessory style={$rightAccessoryStyle} pressableState={state} />
          )}
        </>
      )}
    </Pressable>
  )
}

const $baseViewStyle: ViewStyle = {
  minHeight: spacing.xxl,
  borderRadius: metrics.roundedLarge,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  overflow: "hidden",
  gap: spacing.xs,
}

const $baseTextStyle: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
}

const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.xs, zIndex: 1 }
const $leftAccessoryStyle: ViewStyle = { marginEnd: spacing.xs, zIndex: 1 }

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.borderPrimary,
      backgroundColor: colors.surfaceBrand,
    },
  ] as StyleProp<ViewStyle>,

  filled: [$baseViewStyle, { backgroundColor: colors.surfaceBrand }] as StyleProp<ViewStyle>,

  reversed: [$baseViewStyle, { backgroundColor: colors.surfaceInvert }] as StyleProp<ViewStyle>,

  tabOn: [
    $baseViewStyle,
    {
      borderBottomColor: colors.surfaceBrand,
      borderBottomWidth: 2,
      minHeight: spacing.xxxl,
      borderRadius: 0,
      flex: 1,
    },
  ] as StyleProp<ViewStyle>,

  tabOff: [
    $baseViewStyle,
    {
      borderBottomColor: colors.borderPrimary,
      minHeight: spacing.xxxl,
      borderRadius: 0,
      flex: 1,
    },
  ] as StyleProp<ViewStyle>,

  outline: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.borderBrand,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      minHeight: spacing.lg,
      borderRadius: metrics.roundedMinimal,
      gap: spacing.xxs,
    },
  ] as StyleProp<ViewStyle>,

  destructive: [
    $baseViewStyle,
    {
      borderWidth: 1,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      borderRadius: metrics.roundedMinimal,
      gap: spacing.xxs,
      paddingLeft: spacing.xxs,
      borderColor: colors.error,
      minHeight: spacing.lg,
    },
  ] as StyleProp<ViewStyle>,

  confirm: [
    $baseViewStyle,
    {
      borderWidth: 1,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      borderRadius: metrics.roundedMinimal,
      gap: spacing.xxs,
      paddingLeft: spacing.xxs,
      borderColor: colors.borderBrand,
      minHeight: spacing.lg,
    },
  ] as StyleProp<ViewStyle>,

  cancel: [
    $baseViewStyle,
    {
      borderWidth: 1,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      borderRadius: metrics.roundedMinimal,
      gap: spacing.xxs,
      paddingLeft: spacing.xxs,
      borderColor: colors.textPrimary,
      minHeight: spacing.lg,
    },
  ] as StyleProp<ViewStyle>,

  icon: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.borderBrand,
      paddingHorizontal: spacing.xxs,
      paddingVertical: spacing.xxs,
      minHeight: spacing.lg,
      borderRadius: metrics.roundedMinimal,
      gap: spacing.xxs,
    },
  ] as StyleProp<ViewStyle>,
}

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: $baseTextStyle,
  filled: [$baseTextStyle, { color: colors.textInvert }],
  reversed: [$baseTextStyle, { color: colors.textPrimary }],
  tabOn: [
    $baseTextStyle,
    {
      color: colors.surfaceBrand,
    },
  ],
  tabOff: [
    $baseTextStyle,
    {
      color: colors.textSecondary,
    },
  ],
  outline: [
    $baseTextStyle,
    {
      color: colors.textBrand,
      fontSize: 12,
    },
  ],
  destructive: [
    $baseTextStyle,
    {
      color: colors.error,
      fontSize: 12,
    },
  ],
  confirm: [
    $baseTextStyle,
    {
      color: colors.textBrand,
      fontSize: 12,
    },
  ],
  cancel: [
    $baseTextStyle,
    {
      color: colors.textPrimary,
      fontSize: 12,
    },
  ],
}

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { opacity: 0.9 },
  filled: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
  tabOn: { opacity: 0.9 },
  tabOff: { opacity: 0.9 },
}

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { opacity: 0.9 },
  filled: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
  tabOn: { opacity: 0.9 },
  tabOff: { opacity: 0.9 },
}

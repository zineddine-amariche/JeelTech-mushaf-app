import i18n from "i18n-js"
import React, { useMemo } from "react"
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native"
import { isRTL, translate, TxKeyPath } from "../i18n"
import { colors, spacing, typography } from "../theme"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets = any

export interface TextProps extends RNTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: i18n.TranslateOptions
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
  /**
   * Text weight modifier.
   */
  weight?: Weights
  /**
   * Text size modifier.
   */
  size?: Sizes
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * Fonts Lang Style
   */
  fontLang?: "arabic" | "latin"
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Text.md)
 */
export function Text(props: TextProps) {
  const {
    weight,
    size,
    tx,
    txOptions,
    text,
    children,
    style: $styleOverride,
    fontLang,
    ...rest
  } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const preset = props.preset ?? "default"

  const isRTLLocal = !fontLang ? isRTL : fontLang === "arabic"

  const font = isRTLLocal ? typography.primary : typography.primaryLatin

  const sizes = isRTLLocal ? $sizeStyles : $sizeStylesLatin

  const $styles = useMemo(
    () => [
      $rtlStyle(isRTLLocal),
      $presets(font, sizes)[preset],
      $fontWeightStyles(font)[weight],
      sizes[size],
      $styleOverride,
    ],
    [isRTLLocal, font, preset, weight, size, $styleOverride],
  )

  return (
    <RNText {...rest} style={$styles}>
      {content}
    </RNText>
  )
}

const $sizeStyles = {
  xxxl: { fontSize: 36, lineHeight: 44 } satisfies TextStyle,
  xxl: { fontSize: 28, lineHeight: 36 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
}

const $sizeStylesLatin = {
  xxxl: { fontSize: 32, lineHeight: 40 },
  xxl: { fontSize: 24, lineHeight: 32 },
  xl: { fontSize: 20, lineHeight: 28 },
  lg: { fontSize: 18, lineHeight: 24 },
  md: { fontSize: 16, lineHeight: 22 },
  sm: { fontSize: 14, lineHeight: 20 },
  xs: { fontSize: 12, lineHeight: 18 },
  xxs: { fontSize: 10, lineHeight: 16 },
}

const $fontWeightStyles = (font) =>
  Object.entries(font).reduce((acc, [weight, fontFamily]) => {
    return { ...acc, [weight]: { fontFamily } }
  }, {}) as Record<Weights, TextStyle>

const $baseStyle = (font, sizes) => [
  $fontWeightStyles(font).normal,
  sizes.sm,
  { color: colors.textPrimary, textAlign: "left" },
]

const $presets = (font, sizes) => ({
  default: $baseStyle(font, sizes),
  bold: [$baseStyle(font, sizes), $fontWeightStyles(font).bold] as StyleProp<TextStyle>,
  heading: [
    $baseStyle(font, sizes),
    sizes.xxxl,
    $fontWeightStyles(font).bold,
    { color: colors.textBrand },
  ] as StyleProp<TextStyle>,

  subheading: [
    $baseStyle(font, sizes),
    sizes.lg,
    $fontWeightStyles(font).medium,
  ] as StyleProp<TextStyle>,

  formLabel: [$baseStyle(font, sizes), $fontWeightStyles(font).medium] as StyleProp<TextStyle>,

  formHelper: [
    $baseStyle(font, sizes),
    sizes.sm,
    $fontWeightStyles(font).normal,
  ] as StyleProp<TextStyle>,

  title: [
    $baseStyle(font, sizes),
    sizes.xxl,
    $fontWeightStyles(font).medium,
    { color: colors.textBrand },
  ] as StyleProp<TextStyle>,

  ayah: [
    $baseStyle(font, sizes),
    $sizeStyles.sm,
    {
      color: colors.textPrimary,
      fontFamily: typography.warch.normal,
      lineHeight: spacing.xl,
    },
  ] as StyleProp<TextStyle>,

  books: [
    $baseStyle(font, sizes),
    $sizeStyles.sm,
    {
      color: colors.textPrimary,
      fontFamily: typography.books.normal,
      lineHeight: spacing.xl,
    },
  ] as StyleProp<TextStyle>,
})

const $rtlStyle = (isRTL) => (isRTL ? { writingDirection: "rtl" } : {})

// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  grey50: "#F1F1F1",
  grey200: "#D3D3D3",
  grey400: "#AFAFAF",
  grey600: "#7C7C7C",
  grey800: "#343434",
  grey900: "#202020",

  neutral50: "#FBF8F3",
  neutral100: "#F6EEE4",
  neutral150: "#EFE1CF",
  neutral200: "#E8D4BA",
  neutral300: "#DAB990",
  neutral400: "#CC9F66",
  neutral500: "#BB843E",
  neutral600: "#916630",
  neutral700: "#674922",
  neutral800: "#3D2B14",
  neutral900: "#130D06",
  neutralOverlay: "#AE9F8B",

  primary50: "#D2E3CD",
  primary200: "#96C290",
  primary400: "#679A64",
  primary600: "#476930",
  primary800: "#1B3319",
  primary900: "#0F240F",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * A helper for making something white.
   */
  white: "white",
  whiteTransparent: "rgba(255, 255, 255, 0.3)",
  dimTransparent: "rgba(0, 0, 0, 0.3)",
  /**
   * Text color in many components.
   */
  textPrimary: palette.grey900,
  textSecondary: palette.grey600,
  textBrand: palette.primary600,
  textBrandSecondary: palette.neutral500,
  textBrandSecondaryDark: palette.neutral600,
  textInvert: palette.grey50,
  textDim: palette.grey400,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary600,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,

  /**
   * Surface
   */
  surfaceDark: palette.neutralOverlay,
  surfacePrimary: palette.neutral200,
  surfaceSecondaryPlus: palette.neutral150,
  surfaceSecondary: palette.neutral100,
  surfaceInvert: palette.neutral700,
  surfaceBrand: palette.neutral500,
  /**
   * Icon
   */
  iconPrimary: palette.primary600,
  iconSecondary: palette.primary400,
  iconInvert: palette.primary200,
  /**
   * Border
   */
  borderPrimary: palette.grey900,
  borderBrand: palette.primary600,
  borderSecondary: palette.neutral500,
  /**
   * App
   */
  ayahShadow: "#0000FF",
  cardShadow: "#000000",
}

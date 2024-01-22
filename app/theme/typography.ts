import {
  Amiri_400Regular as amiriRegular,
  Amiri_700Bold as amiriBold,
} from "@expo-google-fonts/amiri"

import {
  Inter_300Light as interLight,
  Inter_400Regular as interRegular,
  Inter_500Medium as interMedium,
  Inter_600SemiBold as interSemiBold,
  Inter_700Bold as interBold,
} from "@expo-google-fonts/inter"

export const customFontsToLoad = {
  HacenTunisiaLight: require("../../assets/fonts/HacenTunisiaLt.ttf"),
  HacenTunisiaRegular: require("../../assets/fonts/HacenTunisia.ttf"),
  HacenTunisiaBold: require("../../assets/fonts/HacenTunisiaBd.ttf"),
  interLight,
  interRegular,
  interMedium,
  interSemiBold,
  interBold,
  uthmanicWarsh: require("../../assets/fonts/uthmanic_warsh_v21.ttf"),
  amiriRegular,
  amiriBold,
}

const fonts = {
  hacenTunisia: {
    light: "HacenTunisiaLight",
    normal: "HacenTunisiaRegular",
    medium: "HacenTunisiaRegular",
    semiBold: "HacenTunisiaBold",
    bold: "HacenTunisiaBold",
  },
  inter: {
    light: "interLight",
    normal: "interRegular",
    medium: "interMedium",
    semiBold: "interSemiBold",
    bold: "interBold",
  },
  uthmanicWarsh: {
    normal: "uthmanicWarsh",
  },
  amiri: {
    normal: "amiriRegular",
    bold: "amiriBold",
  },
}

export const fontSizes = {
  tiny: 12,
  small: 14,
  medium: 16,
  large: 18,
  huge: 20,
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.hacenTunisia,
  primaryLatin: fonts.inter,
  warch: fonts.uthmanicWarsh,
  books: fonts.amiri,
}

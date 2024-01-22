import { isRTL } from "app/i18n"
import { colors, spacing, typography } from "app/theme"
import { TextStyle, ViewStyle } from "react-native"
import Toast, { BaseToast } from "react-native-toast-message"

export function showToast(
  message: string,
  type: "success" | "error" | "info",
  position?: "top" | "bottom",
) {
  Toast.show({
    type: type,
    text1: message,
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 50,
    position: position ? position : "bottom",
  })
}

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[{ borderLeftColor: colors.white }, $shadow]}
      contentContainerStyle={$containerStyle}
      text1Style={[$textStyle]}
    />
  ),
}

const $containerStyle: ViewStyle = { paddingHorizontal: spacing.sm }

const $shadow: ViewStyle = {
  shadowColor: colors.cardShadow,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,
}
const $textStyle: TextStyle = {
  textAlign: "center",
  color: colors.textSecondary,
  fontSize: 16,
  fontWeight: "400",
  fontFamily: isRTL ? typography.primary.medium : typography.primaryLatin.medium,
}

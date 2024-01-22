import { TxKeyPath, translate } from "app/i18n"
import { Alert } from "react-native"

interface AlertOptions {
  titleKey: TxKeyPath
  messageKey: TxKeyPath
  noKey: TxKeyPath
  yesKey: TxKeyPath
  onYesPressed: () => void
}

export function showAlert(options: AlertOptions) {
  Alert.alert(
    translate(options.titleKey) as string,
    translate(options.messageKey) as string,
    [
      {
        text: translate(options.noKey) as string,
        onPress: () => console.log("No Pressed"),
        style: "cancel",
      },
      {
        text: translate(options.yesKey) as string,
        onPress: options.onYesPressed,
      },
    ],
    { cancelable: false },
  )
}

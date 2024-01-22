import { TouchableWithoutFeedback, View } from "react-native"

interface DismisserProps {
  children: React.ReactNode
  onPress: () => void
  disabled?: boolean
}
export const Dismisser: React.FC<DismisserProps> = ({ children, disabled, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
    <View style={{ flex: 1 }}>{children}</View>
  </TouchableWithoutFeedback>
)

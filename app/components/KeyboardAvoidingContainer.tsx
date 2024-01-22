import { KeyboardAvoidingView, View, ViewStyle } from "react-native"

interface KeyboardAvoidingContainerProps {
  children: React.ReactNode
  containerStyle: ViewStyle
  behavior?: "padding" | "height" | "position" | undefined
}

export const KeyboardAvoidingContainer: React.FC<KeyboardAvoidingContainerProps> = ({
  children,
  behavior,
  containerStyle 
}) => {
  return (
    <View style={containerStyle}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={behavior}>
        {children}
      </KeyboardAvoidingView>
    </View>
  )
}


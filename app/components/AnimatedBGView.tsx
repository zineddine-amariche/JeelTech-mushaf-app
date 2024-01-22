import { useStores } from "app/models"
import { colors, timing } from "app/theme"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { StyleSheet, ViewProps } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated"

export interface AnimatedBGViewProps extends ViewProps {
  children?: React.ReactNode
}

export const AnimatedBGView = observer(({ children, style, ...others }: AnimatedBGViewProps) => {
  const {
    uiStore: { appNavigationBarsShown, drawerIsOpen },
  } = useStores()

  const backgroundColor = useSharedValue(
    appNavigationBarsShown ? colors.surfacePrimary : colors.surfaceSecondary,
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    }
  })

  React.useEffect(() => {
    if (drawerIsOpen) {
      backgroundColor.value = withTiming(colors.surfaceDark, {
        duration: timing.visibility,
      })
    } else if (!appNavigationBarsShown) {
      backgroundColor.value = withDelay(timing.visibility, withTiming(colors.surfaceSecondary))
    } else {
      backgroundColor.value = withTiming(colors.surfacePrimary, {
        duration: timing.visibility,
      })
    }
  }, [appNavigationBarsShown, drawerIsOpen])

  return (
    <Animated.View style={[styles.fill, animatedStyle, style]} {...others}>
      {children}
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  fill: { flex: 1 },
})

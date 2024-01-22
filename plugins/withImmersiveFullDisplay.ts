import { ConfigPlugin, AndroidConfig, withAndroidStyles } from "expo/config-plugins"

export const withImmersiveFullDisplay: ConfigPlugin = (config) => {
  config = withWindowLayoutInDisplayCutoutMode(config)
  config = withEnforceNavigationBarContrast(config)
  return config
}

const withWindowLayoutInDisplayCutoutMode: ConfigPlugin = (config) =>
  withAndroidStyles(config, async (modConfig) => {
    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      name: "android:windowLayoutInDisplayCutoutMode",
      value: "shortEdges",
      parent: {
        parent: "Theme.AppCompat.Light.NoActionBar",
        name: "AppTheme",
      },
    })
    return modConfig
  })

const withEnforceNavigationBarContrast: ConfigPlugin = (config) =>
  withAndroidStyles(config, async (modConfig) => {
    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      name: "android:enforceNavigationBarContrast",
      value: "false",
      parent: {
        parent: "Theme.AppCompat.Light.NoActionBar",
        name: "AppTheme",
      },
    })
    return modConfig
  })

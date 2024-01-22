import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import { LogBox } from "react-native"

LogBox.ignoreLogs(["You seem to update"])
LogBox.ignoreLogs(["Warning: Each child in a list should have a unique"])

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp

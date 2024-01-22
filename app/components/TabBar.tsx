import React from "react"
import { TxKeyPath } from "app/i18n"
import { Button } from "./Button"
import { View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"

export const TabBar: React.FC = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={$renderTabBarStyle}>
      {tabs.map((tab) => (
        <Button
          key={tab}
          textStyle={{ fontSize: 20 }}
          tx={`${tab}` as TxKeyPath}
          preset={activeTab === tab ? "tabOn" : "tabOff"}
          onPress={() => {
            setActiveTab(tab)
          }}
        />
      ))}
    </View>
  )
}

const $renderTabBarStyle: ViewStyle = {
  height: spacing.xxxl,
  backgroundColor: colors.surfaceSecondaryPlus,
  flexDirection: "row",
}

import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text, TextProps } from "./Text"

interface BulletedListProps {
  items: string[]
  size?: TextProps["size"]
  weight?: TextProps["weight"]
}

const BulletedList: FC<BulletedListProps> = ({ items, size, weight }) => {
  return (
    <View style={$container}>
      {items.map((item, index) => (
        <View key={index} style={$itemContainer}>
          <Text style={$bullet} size={size} weight={weight}>
            •
          </Text>
          <Text size={size} weight={weight}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  )
}

const $container: ViewStyle = {
  marginTop: 8,
}

const $itemContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 4,
}

const $bullet: ViewStyle = {
  marginRight: 8,
}

export default BulletedList

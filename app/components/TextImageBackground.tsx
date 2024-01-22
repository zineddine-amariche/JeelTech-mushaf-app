import { isRTL } from "app/i18n"
import { colors, spacing } from "app/theme"
import React from "react"
import { View, Image, ImageBackground, ViewStyle } from "react-native"
import { Text } from "./Text"

interface TextImageBackgroundProps {
  children?: React.ReactNode
  texts: Array<string>
}

const HEIGHT = 22

export const TextImageBackground: React.FC<TextImageBackgroundProps> = ({ texts, children }) => {
  return (
    <View style={[$container, { flexDirection: !isRTL ? "row" : "row-reverse" }]}>
      <Image
        source={require("assets/images/frame_left.png")}
        style={{ height: HEIGHT, width: HEIGHT }}
        resizeMode="stretch"
      />
      <ImageBackground
        source={require("assets/images/frame_center.png")}
        style={{
          marginHorizontal: -1,
          paddingHorizontal: 1,
          height: HEIGHT,
          alignItems: "center",
          justifyContent: "center",
        }}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: spacing.xxs,
          }}
        >
          {texts?.length > 0 &&
            texts.map((t, i) => (
              <React.Fragment key={i}>
                <Text
                  weight="light"
                  style={{ color: colors.textBrandSecondaryDark }}
                  maxFontSizeMultiplier={1}
                >
                  {t}
                </Text>
                {i < texts.length - 1 && (
                  <Image
                    source={require("assets/images/frame_center_separator.png")}
                    style={{ height: HEIGHT }}
                    resizeMode="stretch"
                  />
                )}
              </React.Fragment>
            ))}
          {children}
        </View>
      </ImageBackground>
      <Image
        source={require("assets/images/frame_right.png")}
        style={{ height: HEIGHT, width: HEIGHT }}
        resizeMode="stretch"
      />
    </View>
  )
}

const $container: ViewStyle = {
  alignItems: "center",
  height: HEIGHT,
  width: "auto",
}

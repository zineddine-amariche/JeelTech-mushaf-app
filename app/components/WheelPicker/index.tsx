// TODO : this component should not know ayah and surah

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import {
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  LayoutChangeEvent,
  PixelRatio,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { adaptiveColor, setAlphaColor } from "./util"
import type { RenderItemProps } from "./types"
import * as Haptics from "expo-haptics"
import { colors, fontSizes, spacing, typography } from "app/theme"
import { FlashList } from "@shopify/flash-list"
import { isRTL } from "app/i18n"

// eslint-disable-next-line react/display-name
const WheelPicker = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [extra, setExtra] = useState(0)
  const [itemHeight, setItemHeight] = useState(PixelRatio.roundToNearestPixel(50))
  const [listHeight, setListHeight] = useState(200)
  const [data, setData] = useState([])
  const [userTouch, setUserTouch] = useState(false)
  const flatListRef = useRef(null)
  const backgroundColor = setAlphaColor(props.backgroundColor, 1)
  const { compName } = props
  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    const roundedHight = Math.round(height / itemHeight) * itemHeight
    setListHeight(roundedHight)
    setExtra(height - roundedHight)
  }
  useImperativeHandle(ref, () => ({
    // each key is connected to `ref` as a method name
    // they can execute code directly, or call a local method
    setItem: (item) => {
      handleOnPressItem(item - 1)
    },
  }))

  useEffect(() => {
    if (props.items.length !== data.length || props.items !== data) {
      setListData()
    }
  }, [props.items])

  const setListData = () => {
    const { items, height } = props
    if (items?.length) {
      // const additionalItem = { label: "", value: null }
      const data = [...items]

      setData(data)
    }
  }

  const handleOnSelect = (index) => {
    const { items, onChange, haptics } = props
    const newSelectedIndex = Math.abs(index + 1)

    if (
      newSelectedIndex !== selectedIndex &&
      newSelectedIndex >= 0 &&
      newSelectedIndex <= items.length
    ) {
      if (haptics && userTouch) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      setSelectedIndex(newSelectedIndex)
      onChange && onChange({ index: newSelectedIndex - 1, item: items[newSelectedIndex - 1] })
    }
  }

  const handleOnPressItem = (index, animated = true) => {
    if (index >= 0 && index <= props.items.length) {
      flatListRef.current?.scrollToOffset({
        animated,
        offset: index * itemHeight,
      })
    }
  }

  const gradientColor = Platform.select({
    ios: setAlphaColor(backgroundColor, 0.2),
    android: setAlphaColor(backgroundColor, 0.4),
    web: setAlphaColor(backgroundColor, 0.4),
  })

  const gradientContainerStyle = [
    { height: 2 * itemHeight, borderColor: props.selectedStyle?.borderColor },
    styles.gradientContainer,
  ]

  if (!data.length) return null

  return (
    <View
      style={{
        flex: 1,
        width: props.width,
        backgroundColor,
      }}
      onLayout={onLayout}
    >
      <FlashList
        estimatedItemSize={itemHeight}
        contentContainerStyle={{
          paddingVertical: (listHeight - itemHeight) / 2 + extra / 2,
        }}
        keyExtractor={(_, index) => compName + "_" + index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={(options) =>
          PickerItem(
            options,
            selectedIndex,
            {
              ...styles.listItem,
              backgroundColor,
              fontSize: fontSizes.medium,
              height: itemHeight,
            },
            handleOnPressItem,
            props.renderItem,
          )
        }
        onTouchStart={(e) => {
          setUserTouch(true)
          !!props.flatListProps?.onTouchStart && props.flatListProps.onTouchStart(e)
        }}
        ref={flatListRef}
        initialScrollIndex={props?.initialSelectedIndex}
        data={data}
        extraData={data}
        onScroll={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight)
          handleOnSelect(index)
        }}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: index * itemHeight,
          index,
        })}
        snapToInterval={itemHeight}
        maxToRenderPerBatch={props.items.length}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={300}
        initialNumToRender={props.items.length}
        {...props.flatListProps}
      />
      <View
        style={[
          gradientContainerStyle,
          styles.topGradient,
          { borderBottomWidth: props.selectedStyle?.borderWidth },
        ]}
        pointerEvents="none"
      >
        <LinearGradient style={styles.linearGradient} colors={[backgroundColor, gradientColor]} />
      </View>
      <View
        style={[
          gradientContainerStyle,
          styles.bottomGradient,
          { borderTopWidth: props.selectedStyle?.borderWidth },
        ]}
        pointerEvents="none"
      >
        <LinearGradient style={styles.linearGradient} colors={[gradientColor, backgroundColor]} />
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.borderBrand,
          position: "absolute",
          width: "100%",
          height: itemHeight,
          // center the element vertically and horizontally
          top: "50%",
          transform: [{ translateY: -itemHeight / 2 }],
        }}
        pointerEvents="none"
      ></View>
    </View>
  )
})

WheelPicker.defaultProps = {
  items: [],
  backgroundColor: colors.white,
  width: 150,
  haptics: false,
}

const Item = React.memo(
  ({
    fontSize,
    fontFamily,
    label,
    fontColor,
    textAlign,
    adjustsFontSizeToFit,
    lineHeight,
  }: RenderItemProps) => {
    return (
      <Text
        style={{
          fontSize,
          color: fontColor,
          textAlign,
          fontFamily: fontFamily ?? typography.primary.medium,
          lineHeight,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    )
  },
)

const PickerItem = (
  { item, index }: any,
  indexSelected: number,
  style: any,
  onPress: (index: number) => void,
  renderItem: (props: RenderItemProps) => JSX.Element,
) => {
  // const gap = Math.abs(index - indexSelected)
  // const sizeText = [style.fontSize, style.fontSize / 1.5, style.fontSize / 2]

  const fontSize = fontSizes.medium // gap > 1 ? sizeText[2] : sizeText[gap]
  const fontColor = adaptiveColor(style.backgroundColor)
  const textAlign = "center"

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => onPress(index)}>
      <View style={[style, { alignItems: "center", overflow: "hidden" }]}>
        {typeof renderItem === "function" &&
          renderItem({ fontSize, fontColor, label: item.label, textAlign })}
        {!renderItem && (
          <>
            {!item.surah && (
              <Item
                fontFamily={isRTL ? typography.primary.light : typography.primaryLatin.medium}
                fontSize={fontSizes.huge}
                fontColor={colors.textSecondary}
                textAlign={textAlign}
                label={item.label}
                adjustsFontSizeToFit={true}
                lineHeight={28}
              />
            )}
            {item.subLabel && (
              <Item
                fontFamily={isRTL ? typography.primary.light : typography.primaryLatin.light}
                fontSize={fontSizes.small}
                fontColor={colors.textSecondary}
                textAlign={textAlign}
                label={item.subLabel}
                adjustsFontSizeToFit={true}
              />
            )}

            {item.surah && (
              // TODO: fix the line height for arabic text in ios
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Item
                  fontFamily={isRTL ? typography.primary.medium : typography.primaryLatin.medium}
                  fontSize={fontSizes.large}
                  fontColor={colors.textSecondary}
                  // textAlign={textAlign}
                  label={item.label}
                  adjustsFontSizeToFit={true}
                  lineHeight={20}
                />
                <Item
                  fontFamily={isRTL ? typography.primary.light : typography.primaryLatin.light}
                  fontSize={10}
                  fontColor={colors.textSecondary}
                  // textAlign={"left"}
                  label={item.surah}
                  adjustsFontSizeToFit={false}
                  lineHeight={20}
                />
              </View>
            )}
            {item.ayah && (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: item.surah ? "flex-start" : "center",
                }}
              >
                <Item
                  fontFamily={typography.warch.normal}
                  fontSize={spacing.sm}
                  fontColor={colors.textSecondary}
                  textAlign={"left"}
                  label={item.ayah}
                  adjustsFontSizeToFit={false}
                  lineHeight={20}
                />
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default WheelPicker

const styles = StyleSheet.create({
  bottomGradient: { bottom: 0 },
  gradientContainer: {
    position: "absolute",
    width: "100%",
  },
  linearGradient: { flex: 1 },
  listItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  topGradient: { top: 0 },
})

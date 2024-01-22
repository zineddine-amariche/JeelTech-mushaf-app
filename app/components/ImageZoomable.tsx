import React, { useEffect, useState } from "react"
import { LayoutChangeEvent, ImageStyle, View } from "react-native"
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import CroppedImage from "./CroppedImage"
import { AyatShadow } from "./AyatShadow"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { spacing } from "app/theme"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"

const clamp = (value, max) => Math.max(0, Math.min(max, value))

const App = ({
  imageUri,
  page,
  currentPageParams,
  currentPageParamsDefault,
  currentPageAyatShadows,
  numberOfAyatBeforePage,
  appNavigationBarsShown,
}) => {
  const [imageWidth, setImageWidth] = useState(0)
  const [imageHeight, setImageHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [isScaling, setIsScaling] = useState(false)

  useEffect(() => {
    setIsScaling(true)
    const timeoutId = setTimeout(() => {
      setIsScaling(false)
    }, 200)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [appNavigationBarsShown])

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setContainerWidth(width)
    setContainerHeight(height)
    if (!appNavigationBarsShown) {
      setImageWidth(width)
      setImageHeight(height)
    }
  }

  const onLoad = (event: any) => {
    if (!appNavigationBarsShown) {
      return
    }
    const { width, height } = event.nativeEvent.source
    const aspectRatio = width / height
    const containerAspectRatio = containerWidth / containerHeight
    if (aspectRatio > containerAspectRatio) {
      setImageWidth(containerWidth)
      setImageHeight(containerWidth / aspectRatio)
    } else {
      setImageWidth(containerHeight * aspectRatio)
      setImageHeight(containerHeight)
    }
  }
  const scale = useSharedValue(1)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      scale.value = event.scale
      focalX.value = event.focalX
      focalY.value = event.focalY
      runOnJS(setIsScaling)(true)
    },
    onEnd: () => {
      scale.value = withTiming(1, undefined, () => {
        runOnJS(setIsScaling)(false)
      })
    },
  })

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -imageWidth / 2 },
        { translateY: -imageHeight / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: imageWidth / 2 },
        { translateY: imageHeight / 2 },
      ],
    }
  })

  const cropBorderInitial = currentPageParams?.cropBorder ?? currentPageParamsDefault.cropBorder

  const pageExtraOffset = currentPageParams?.offset ?? { x: 0, y: 0 }
  const pageDefaultOffset = (page % 2 === 0
    ? currentPageParamsDefault.offset
    : currentPageParamsDefault.offsetOdd) ?? { x: 0, y: 0 }

  const cropBorder = {
    x1: clamp(cropBorderInitial.x1 - (pageExtraOffset.x + pageDefaultOffset.x), 100),
    y1: clamp(cropBorderInitial.y1 - (pageExtraOffset.y + pageDefaultOffset.y), 100),
    x2: clamp(cropBorderInitial.x2 - (pageExtraOffset.x + pageDefaultOffset.x), 100),
    y2: clamp(cropBorderInitial.y2 - (pageExtraOffset.y + pageDefaultOffset.y), 100),
  }

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={$flex} onLayout={onLayout}>
        <CroppedImage
          cropBorder={cropBorder}
          imageStyle={rStyle}
          imageUri={imageUri}
          onLoad={onLoad}
          resizeMode={appNavigationBarsShown ? "contain" : "stretch"}
        />
        {!isScaling ? (
          <AyatShadow
            page={page}
            currentPageParams={currentPageParams}
            currentPageParamsDefault={currentPageParamsDefault}
            currentPageAyatShadows={currentPageAyatShadows}
            numberOfAyatBeforePage={numberOfAyatBeforePage}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
          />
        ) : null}
      </Animated.View>
    </PinchGestureHandler>
  )
}

export const ImageZoomable = observer(function ImageZoomable(props) {
  const $containerInsets = useSafeAreaInsetsStyle(["bottom", "top", "left", "right"])
  const {
    uiStore: { appNavigationBarsShown },
  } = useStores()

  return (
    <GestureHandlerRootView style={$flex}>
      <View
        style={{
          flex: 1,
          paddingTop:
            $containerInsets.paddingTop + (appNavigationBarsShown ? spacing.xxxl : 0) + spacing.xl,
          paddingBottom:
            $containerInsets.paddingBottom +
            (appNavigationBarsShown ? spacing.xxxl : 0) +
            spacing.xl,
          paddingLeft: $containerInsets.paddingLeft,
          paddingRihgt: $containerInsets.paddingRight,
        }}
      >
        <App {...props} appNavigationBarsShown={appNavigationBarsShown} />
      </View>
    </GestureHandlerRootView>
  )
})

const $flex: ImageStyle = {
  flex: 1,
}

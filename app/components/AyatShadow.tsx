import React, { useEffect, useRef } from "react"
import { Pressable, View } from "react-native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { isRTL } from "../i18n"
import { colors } from "app/theme"

export const AyatShadow = observer(function AyatShadow(props: any) {
  const {
    page,
    currentPageParams,
    currentPageParamsDefault,
    currentPageAyatShadows,
    numberOfAyatBeforePage,
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
  } = props

  const outerBorder = currentPageParams?.cropBorder ??
    currentPageParamsDefault.cropBorder ?? { x1: 0, y1: 0, x2: 100, y2: 100 }
  const innerBorder = currentPageParams?.border ??
    currentPageParamsDefault.border ?? { x1: 0, y1: 0, x2: 100, y2: 100 }
  const pageExtraOffset = currentPageParams?.offset ?? { x: 0, y: 0 }
  const pageDefaultOffset = (page % 2 === 0
    ? currentPageParamsDefault.offset
    : currentPageParamsDefault.offsetOdd) ?? { x: 0, y: 0 }

  const scale = {
    x: 100 / (outerBorder.x2 - outerBorder.x1),
    y: 100 / (outerBorder.y2 - outerBorder.y1),
  }

  const pageRect = {
    x1: (innerBorder.x1 - outerBorder.x1) * scale.x,
    y1: (innerBorder.y1 - outerBorder.y1) * scale.y,
    x2: (innerBorder.x2 - outerBorder.x1) * scale.x,
    y2: (innerBorder.y2 - outerBorder.y1) * scale.y,
  }

  const pageOffset = { x: 0, y: 0 }

  const numberOfLines = currentPageParams?.numberOfLines ?? currentPageParamsDefault.numberOfLines

  const ayahWidth = currentPageParams?.ayahWidth ?? currentPageParamsDefault.ayahWidth

  const {
    mushafStore: { selectedVerses, setSelectedVerse },
    uiStore: { setShadowModalPosition, setShadowModalShow },
  } = useStores()

  const ayahPressed = (index: number) => {
    // TODO : Show shadow modal only if the ayah is in the page and prevent gesture in HomeScreen to trigger
    // if (selectedVerses.includes(index + 1 + numberOfAyatBeforePage)) onMeasure(index)
  }

  const ayahLongPressed = (index: number) => {
    setSelectedVerse(index + 1 + numberOfAyatBeforePage)
    onMeasure(index)
  }

  const renderLines = (index: any) => {
    return (
      Math.floor(currentPageAyatShadows[index].top / (100 / numberOfLines)) -
      Math.floor((currentPageAyatShadows[index - 1]?.top ?? 0) / (100 / numberOfLines)) +
      1
    )
  }
  const renderRect = (rect: any) => {
    return {
      top: rect.top + "%",
      [isRTL ? "right" : "left"]: rect.left + "%",
      width: rect.width + "%",
      height: rect.height + "%",
    }
  }
  const recttop = (index: any) => {
    return {
      left:
        renderLines(index) === 1
          ? currentPageAyatShadows[index].left < ayahWidth * 2
            ? 0
            : currentPageAyatShadows[index].left - ayahWidth / 2
          : 0,
      top:
        Math.floor((currentPageAyatShadows[index - 1]?.top ?? 0) / (100 / numberOfLines)) *
        (100 / numberOfLines),
      width:
        (currentPageAyatShadows[index - 1]?.left ?? 100) < ayahWidth * 2
          ? 0
          : (currentPageAyatShadows[index - 1]?.left ?? 100) -
            (renderLines(index) === 1
              ? currentPageAyatShadows[index].left < ayahWidth * 2
                ? 0
                : currentPageAyatShadows[index].left - ayahWidth / 2
              : 0) -
            (index !== 0 && renderLines(index) !== 1
              ? ayahWidth / 2
              : renderLines(index) === 1
              ? currentPageAyatShadows[index - 1]
                ? ayahWidth / 2
                : 0
              : 0),
      height: 100 / numberOfLines,
    }
  }
  const rectmiddle = (index: any) => {
    return {
      left: 0,
      top: recttop(index).top + recttop(index).height,
      width: 100,
      height:
        renderLines(index) < 3
          ? 0
          : Math.floor(currentPageAyatShadows[index].top / (100 / numberOfLines)) *
              (100 / numberOfLines) -
            (recttop(index).top + recttop(index).height),
    }
  }
  const rectbottom = (index: any) => {
    return {
      left:
        currentPageAyatShadows[index].left < ayahWidth * 2
          ? 0
          : currentPageAyatShadows[index].left - ayahWidth / 2,
      top: rectmiddle(index).top + rectmiddle(index).height,
      width:
        100 -
        (currentPageAyatShadows[index].left < ayahWidth * 2
          ? 0
          : currentPageAyatShadows[index].left - ayahWidth / 2),
      height: renderLines(index) < 2 ? 0 : 100 / numberOfLines,
    }
  }
  const rectayah = (index: any) => {
    return {
      left:
        currentPageAyatShadows[index].left < ayahWidth * 2
          ? 0
          : currentPageAyatShadows[index].left - ayahWidth / 2,
      top:
        renderLines(index) === 1
          ? recttop(index).top
          : rectmiddle(index).top + rectmiddle(index).height,
      width: ayahWidth,
      height: 100 / numberOfLines,
    }
  }

  const itemsRef = useRef([])

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, currentPageAyatShadows.length)
  }, [currentPageAyatShadows])

  const onMeasure = (index) => {
    itemsRef.current[index].measure((x, y, width, height, pageX, pageY) => {
      setShadowModalPosition({
        top: pageY + (width === 0 ? height : 0),
        bottom: pageY + height * renderLines(index),
        left: pageX,
        right: pageX + width,
      })
      setShadowModalShow(true)
    })
  }
  return (
    <View
      style={{
        position: "absolute",
        top: containerHeight / 2 - imageHeight / 2,
        [isRTL ? "left" : "right"]: containerWidth / 2 - imageWidth / 2,
        height: imageHeight,
        width: imageWidth,
        overflow: "hidden",
      }}
    >
      {currentPageAyatShadows.map((ayat: any, index: any) => {
        return (
          <View
            key={index + "_a"}
            style={{
              position: "absolute",
              top: pageRect.y1 + pageOffset.y + "%",
              height: pageRect.y2 - pageRect.y1 + "%",
              [isRTL ? "right" : "left"]: pageRect.x1 + pageOffset.x + "%",
              width: pageRect.x2 - pageRect.x1 + "%",
              pointerEvents: "box-none",
            }}
          >
            <Pressable
              key={index + "_t"}
              ref={(el) => (itemsRef.current[index] = el)}
              onPress={() => ayahPressed(index)}
              onLongPress={() => ayahLongPressed(index)}
              style={{
                zIndex: 99,
                position: "absolute",
                ...renderRect(recttop(index)),
                backgroundColor: colors.ayahShadow,
                opacity: selectedVerses.includes(index + 1 + numberOfAyatBeforePage) ? 0.1 : 0,
                pointerEvents: "auto",
              }}
            />
            <Pressable
              key={index + "_m"}
              onPress={() => ayahPressed(index)}
              onLongPress={() => ayahLongPressed(index)}
              style={{
                zIndex: 99,
                position: "absolute",
                ...renderRect(rectmiddle(index)),
                backgroundColor: colors.ayahShadow,
                opacity: selectedVerses.includes(index + 1 + numberOfAyatBeforePage) ? 0.1 : 0,
                pointerEvents: "auto",
              }}
            />
            <Pressable
              key={index + "_b"}
              onPress={() => ayahPressed(index)}
              onLongPress={() => ayahLongPressed(index)}
              style={{
                zIndex: 99,
                position: "absolute",
                ...renderRect(rectbottom(index)),
                backgroundColor: colors.ayahShadow,
                opacity: selectedVerses.includes(index + 1 + numberOfAyatBeforePage) ? 0.1 : 0,
                pointerEvents: "auto",
              }}
            />
            {/* <Pressable
                  onPress={() => ayahLongPressed(index)}
                  style={{
                    position: "absolute",
                    ...renderRect(rectayah(index)),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>{index + 1}</Text>
                </Pressable> */}
          </View>
        )
      })}
    </View>
  )
})

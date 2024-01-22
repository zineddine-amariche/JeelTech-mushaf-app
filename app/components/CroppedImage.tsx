import React, { useEffect, useState } from "react"
import { Image, ImageStyle } from "react-native"
import Animated from "react-native-reanimated"
import { SaveFormat, manipulateAsync } from "expo-image-manipulator"

const AnimatedImage = Animated.createAnimatedComponent(Image)

export default function CroppedImage({ imageUri, imageStyle, cropBorder, onLoad, resizeMode }) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    Image.getSize(
      imageUri,
      (width, height) => {
        ;(async () => {
          const crop = {
            originX: +((width * cropBorder.x1) / 100).toFixed(2),
            originY: +((height * cropBorder.y1) / 100).toFixed(2),
            width: +((width * (cropBorder.x2 - cropBorder.x1)) / 100).toFixed(2),
            height: +((height * (cropBorder.y2 - cropBorder.y1)) / 100).toFixed(2),
          }

          const manipResult = await manipulateAsync(imageUri, [{ crop }], {
            compress: 0.6,
            format: SaveFormat.PNG,
          })

          setImage(manipResult)
          // setImage({ uri: imageUri })
        })()
      },
      (error) => {
        console.error("Error getting image size:", error)
      },
    )
  }, [])
  return (
    <AnimatedImage
      style={[$flex, { resizeMode: resizeMode ?? "contain" }, imageStyle]}
      source={{ uri: image?.uri }}
      onLoad={onLoad}
    />
  )
}

const $flex: ImageStyle = {
  flex: 1,
}

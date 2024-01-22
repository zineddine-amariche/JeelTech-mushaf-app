import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image
        style={[
          $imageStyle,
          color && { tintColor: color },
          size && { width: size, height: size },
          $imageStyleOverride,
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  back2: require("../../assets/icons/back2.png"),
  close: require("../../assets/icons/close.png"),
  menu: require("../../assets/icons/menu.png"),
  search: require("../../assets/icons/search.png"),
  play: require("../../assets/icons/play.png"),
  readers: require("../../assets/icons/mic.png"),
  next: require("../../assets/icons/next.png"),
  prev: require("../../assets/icons/prev.png"),
  threedots: require("../../assets/icons/threedots.png"),
  up: require("../../assets/icons/up.png"),
  up2: require("../../assets/icons/up2.png"),
  bookmarkOn: require("../../assets/icons/bookmarkOn.png"),
  bookmarkOff: require("../../assets/icons/bookmarkOff.png"),
  repeat: require("../../assets/icons/repeat.png"),
  translation: require("../../assets/icons/translation.png"),
  download: require("../../assets/icons/download.png"),
  message: require("../../assets/icons/message.png"),
  cog: require("../../assets/icons/cog.png"),
  bulb: require("../../assets/icons/bulb.png"),
  books: require("../../assets/icons/books.png"),
  star: require("../../assets/icons/star.png"),
  starFilled: require("../../assets/icons/starFilled.png"),
  starEdit1: require("../../assets/icons/starEdit1.png"),
  starEdit2: require("../../assets/icons/starEdit2.png"),
  index: require("../../assets/icons/index.png"),
  voice: require("../../assets/icons/voice.png"),
  ahkam: require("../../assets/icons/ahkam.png"),
  pause: require("../../assets/icons/pause.png"),
  mushaf: require("../../assets/icons/mushaf.png"),
  share: require("../../assets/icons/share.png"),
  edit: require("../../assets/icons/pen.png"),
  delete: require("../../assets/icons/trash.png"),
  check: require("../../assets/icons/check.png"),
  about: require("../../assets/icons/about2.png"),
}

const $imageStyle: ImageStyle = {
  resizeMode: "contain",
}

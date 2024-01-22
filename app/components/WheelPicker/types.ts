import type { FlatListProps, LayoutChangeEvent } from "react-native"

export type ItemType = { label: string; value: any }
export type RenderItemProps = {
  fontFamily?: string
  fontSize: number
  label: string
  fontColor: string
  textAlign: "center" | "auto" | "left" | "right" | "justify"
  adjustsFontSizeToFit: boolean
  lineHeight: number
}

export interface IViuPickerProps {
  items: ItemType[]
  onChange: (item: { index: number; item: ItemType }) => void
  initialSelectedIndex?: number
  height?: number
  width?: any
  flatListProps?: Partial<FlatListProps<ItemType>>
  backgroundColor?: string
  selectedStyle?: {
    borderColor?: string
    borderWidth?: number
  }
  renderItem?: (props: RenderItemProps) => JSX.Element
  haptics?: boolean
}

export interface IViuPickerState {
  selectedIndex: number
  itemHeight: number
  listHeight: number
  data: ItemType[]
}

// TODO : remove this from here...
export interface CenteredTextProps {
  tx: string
}

// TODO : remove this from here...
export interface TitlesWithBordersProps {
  onLayout: (event: LayoutChangeEvent) => void
  $containerAnimatedStyle: any
  onPress: () => void
  tabActive?: boolean
}

import {
  LayoutChangeEvent,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native"
import React, { useEffect, useState } from "react"
import { Icon, IconTypes } from "./Icon"
import { colors, metrics, spacing } from "app/theme"
import { Text } from "./Text"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { TxKeyPath, getLocale, isRTL, translate } from "app/i18n"
import { useAudioContext } from "app/utils/useAudioPlayer"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { sideNavigate } from "app/navigators/navigationUtilities"
import { shareText } from "app/utils/shareText"
import { equivalentVerses } from "app/quran-helpers/quranCountingData"
import { Quran } from "app/quran-helpers/quranData"

const warchData = require("assets/db/ayat/warsh.json")
const textsMappedMushaf = "imamMalik"

const DetailsSelectedAyahModal = observer(() => {
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const { height } = useWindowDimensions()

  const {
    mushafStore: { selectedVerse, toggleFavoriteVerse, favoriteAyahList, selectedMushaf },
    uiStore: { appNavigationBarsShown, shadowModalShow, shadowModalPosition, setShadowModalShow },
  } = useStores()

  const { play } = useAudioContext()

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setContainerWidth(width)
    setContainerHeight(height)
  }
  const doPlay = async () => {
    setShadowModalShow(false)
    play()
  }

  const $containerInsets = useSafeAreaInsetsStyle(["bottom", "top"])

  const [minTop, setMinTop] = useState(0)
  const [minBottom, setMinBottom] = useState(0)

  useEffect(() => {
    setMinTop(
      $containerInsets.paddingTop +
        (appNavigationBarsShown ? spacing.xxxl : 0) +
        spacing.xl +
        containerHeight,
    )
    setMinBottom(
      height -
        ($containerInsets.paddingBottom +
          (appNavigationBarsShown ? spacing.xxxl : 0) +
          spacing.xl +
          containerHeight +
          spacing.md),
    )
  }, [appNavigationBarsShown])

  const shareVerse = () => {
    const equivalentVersesArray = equivalentVerses(selectedVerse, selectedMushaf, textsMappedMushaf)
    const cleanedAyat = equivalentVersesArray.map((item) => warchData[item - 1].slice(0, -2))

    const surahNubmer = Quran.getDupletByVerseNo(selectedVerse, selectedMushaf).surah
    const surahName = Quran.getSurahDetails(surahNubmer, textsMappedMushaf).name
    const equivalentAyat = equivalentVersesArray.map(
      (v) => Quran.getDupletByVerseNo(v, textsMappedMushaf).ayah,
    )
    shareText(
      `{${cleanedAyat.join(" ")}} ${translate("quran.surahAyah", {
        surah: surahName?.[getLocale()] ?? surahName.ar,
        ayah: equivalentAyat.join(translate("quran.ayahSeparator")),
      })}`,
    )
  }

  return (
    shadowModalShow && (
      <View
        style={[
          $container,
          {
            top:
              shadowModalPosition?.top >= minTop
                ? shadowModalPosition?.top
                : shadowModalPosition?.bottom >= minBottom
                ? (shadowModalPosition?.bottom + shadowModalPosition?.top) / 2
                : shadowModalPosition?.bottom,
            right: "50%",
            transform: [
              { translateX: (containerWidth / 2) * (isRTL ? -1 : 1) },
              {
                translateY:
                  shadowModalPosition?.top >= minTop
                    ? -(containerHeight + spacing.md)
                    : shadowModalPosition?.bottom >= minBottom
                    ? -(containerHeight / 2)
                    : spacing.md,
              },
            ],
          },
        ]}
        onLayout={onLayout}
      >
        <Item icon={"voice"} label={"selectAyahModal.voice"} onPress={doPlay} />
        <Item
          icon={
            favoriteAyahList.findIndex((item) => item.verse === selectedVerse) !== -1
              ? "starEdit2"
              : "star"
          }
          label={"selectAyahModal.favorite"}
          onPress={() => {
            favoriteAyahList.findIndex((item) => item.verse === selectedVerse) === -1
              ? toggleFavoriteVerse(selectedVerse)
              : sideNavigate("Favorites", {
                  editVerse: selectedVerse,
                })
          }}
          onLongPress={() => sideNavigate("Favorites")}
        />
        <Item
          icon={"translation"}
          label={"selectAyahModal.tarajim"}
          onPress={() => {
            setShadowModalShow(false)
            sideNavigate("TarajimDetails")
          }}
        />
        <Item
          icon={"books"}
          label={"selectAyahModal.tafaseer"}
          onPress={() => {
            setShadowModalShow(false)
            sideNavigate("TafaseerDetails")
          }}
        />
        <Item icon={"share"} label={"selectAyahModal.share"} onPress={shareVerse} />
      </View>
    )
  )
})

export default DetailsSelectedAyahModal

interface ItemProps {
  icon: IconTypes
  label: TxKeyPath
  onPress?: () => void
  onLongPress?: () => void
}

const Item = ({ icon, label, onPress, onLongPress }: ItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={$button}>
      <Icon size={24} color={colors.iconPrimary} icon={icon} />
      <Text tx={label} style={$text} numberOfLines={1} size="xxs" />
    </TouchableOpacity>
  )
}

const $container: ViewStyle = {
  position: "absolute",
  flexDirection: "row",
  backgroundColor: colors.surfacePrimary,
  justifyContent: "space-between",
  gap: spacing.md,
  elevation: 2,
  borderRadius: metrics.roundedLarge,
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.xs,
  paddingTop: spacing.md,
}

const $button: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  width: 42,
  gap: spacing.xxs,
}
const $text: TextStyle = { color: colors.iconPrimary }

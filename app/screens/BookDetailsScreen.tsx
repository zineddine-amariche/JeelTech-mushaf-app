import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Platform, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { SideStackScreenProps } from "app/navigators"
import { Icon, Text } from "app/components"
import { colors, metrics, spacing, typography } from "app/theme"
import { useStores } from "app/models"
import { Quran } from "app/quran-helpers/quranData"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { getLocale, isRTL, translate } from "app/i18n"
import * as SQLite from "expo-sqlite"
import * as FileSystem from "expo-file-system"
import { Asset } from "expo-asset"
import RenderHtml, { defaultSystemFonts } from "react-native-render-html"
import { useSideHeader } from "app/utils/useSideHeader"
import { equivalentVerses } from "app/quran-helpers/quranCountingData"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"
import { getWarchAyatCombined } from "app/quran-helpers/ayatTexts"
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler"
import SelectField from "app/components/SelectField"
import { sideNavigate } from "app/navigators/navigationUtilities"
import { Tafaseer } from "assets/db/tafaseer/tafaseer"
import { Tarajim } from "assets/db/tarajim/tarajim"
import { useFocusEffect } from "@react-navigation/native"
import { logAnalyticsEvent } from "app/utils/handleAnalytics"

interface BookDetailsScreenProps
  extends NativeStackScreenProps<SideStackScreenProps<"BookDetails">> {}

async function openDatabase(file: string, fileId: string): Promise<SQLite.Database> {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite")
  }
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite/" + fileId)).exists) {
    await FileSystem.downloadAsync(file, FileSystem.documentDirectory + "SQLite/" + fileId)
  }
  const tmp = SQLite.openDatabase(fileId)
  return tmp
}

export const BookDetailsScreen: FC<BookDetailsScreenProps> = observer(function BookDetailsScreen({
  route,
}) {
  const { type } = route.params

  useSideHeader({ titleTx: `menus.${type}` })

  const [db, setDB] = useState(null)
  const [bookText, setBookText] = useState(null)
  const [loading, setLoading] = useState(true)
  const [listOptions, setListOptions] = useState([])

  const {
    mushafStore: {
      selectedTafseerDetails,
      selectedTarjamaDetails,
      selectedMushaf,
      selectedVerse,
      selectedVerses,
      selectedSurah,
      setSelectedVerse,
      setSelectedVerses,
      setSelectedTafseer,
      setSelectedTarjama,
    },
    uiStore: { drawerIsOpen, menuAyahViewIsOpen, setMenuAyahViewIsOpen },
  } = useStores()

  useEffect(() => {
    if (type === "tafaseer" && !selectedTafseerDetails) {
      sideNavigate("Tafaseer")
    } else if (type === "tarajim" && !selectedTarjamaDetails) {
      sideNavigate("Tarajim")
    }

    const Books = type === "tafaseer" ? Tafaseer : Tarajim
    const options = Object.values(Books)
      .filter((t) => t.enabled)
      .map((t) => ({
        label: `${type}.${t.id}.name`,
        value: t.id,
        onPress: () => {
          if (type === "tafaseer") {
            setSelectedTafseer(t.id)
            logAnalyticsEvent("tafseer_selection", { tafseer: t.id, screen: "tafseer_details" })
          } else {
            setSelectedTarjama(t.id)
            logAnalyticsEvent("tarjama_selection", { tarjama: t.id, screen: "tarjama_details" })
          }
        },
      }))
      .concat([
        {
          label: `${type}.showBooks`,
          value: "showTafasser",
          onPress: () => sideNavigate(type === "tafaseer" ? "Tafaseer" : "Tarajim"),
          withIcon: true,
        },
      ])
    setListOptions(options)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if (type === "tafaseer" && selectedTafseerDetails) {
        dropdownRef.current?.setSelectedOption(selectedTafseerDetails.id)
      }
      if (type === "tarajim" && selectedTarjamaDetails) {
        dropdownRef.current?.setSelectedOption(selectedTarjamaDetails.id)
      }
    }, []),
  )

  const bookMappedMushaf = "shirifi2"
  const [equivalantVersesWarsh, setEquivalantVersesWarsh] = useState<number[]>([])
  const [convertedAyat, setConvertedAyat] = useState<number[]>([])
  const [convertedAyatBack, setConvertedAyatBack] = useState<number[]>([])
  const [book, setBook] = useState()

  interface DropdownRef {
    closeDropdown: () => void
    setSelectedOption: (option: string) => void
  }

  const dropdownRef = React.useRef<DropdownRef | null>(null)

  const closeDropdown = () => {
    dropdownRef.current?.closeDropdown()
  }

  useEffect(() => {
    if (type === "tafaseer" && selectedTafseerDetails) {
      setBook(selectedTafseerDetails)
      dropdownRef.current?.setSelectedOption(selectedTafseerDetails.id)
    } else if (selectedTarjamaDetails) {
      setBook(selectedTarjamaDetails)
      dropdownRef.current?.setSelectedOption(selectedTarjamaDetails.id)
    }
  }, [selectedTafseerDetails, selectedTarjamaDetails])

  useEffect(() => {
    if (!book || !book.file) return
    // "https://rsc.anaatlou.org/tafsir/sa3dy2.sql"
    openDatabase(Asset.fromModule(book.file).uri, book.id).then((db) => {
      setDB(db)
    })
  }, [book])

  useEffect(() => {
    const eqVerses = equivalentVerses(selectedVerse, selectedMushaf, bookMappedMushaf)
    const eqVersesBack = equivalentVerses(eqVerses[0], bookMappedMushaf, selectedMushaf)
    const eqVersesWarsh = equivalentVerses(eqVerses[0], bookMappedMushaf, "imamMalik")
    setEquivalantVersesWarsh(eqVersesWarsh)
    setConvertedAyat(eqVerses.map((v) => Quran.getDupletByVerseNo(v, bookMappedMushaf).ayah))
    setConvertedAyatBack(eqVersesBack.map((v) => Quran.getDupletByVerseNo(v, selectedMushaf).ayah))
    // Highlight all coresponding verses if Book menu is open
    if (drawerIsOpen) setSelectedVerses(eqVersesBack)
  }, [selectedVerse, selectedMushaf, drawerIsOpen])

  useEffect(() => {
    if (db === null) return
    setLoading(true)
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT text FROM "${
          book.id
        }" where sura = ${selectedSurah} and aya in (${convertedAyat.join(",")})`,
        [],
        (_, { rows }) => {
          setLoading(false)
          const texts = rows._array.map(
            (r, i, a) =>
              (a.length > 1
                ? `<br/>${translate(`${type}.partNumber`, { part: i + 1, lng: book.lang })}: `
                : "") + `${r.text}`,
          )
          setBookText(texts.join("<br />"))
        },
      )
    })
  }, [db, convertedAyat])

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const surahName = Quran.getSurahDetails(selectedSurah, selectedMushaf).name

  const MAX_HEIGHT = 400
  const MIN_HEIGHT = 56 + $containerInsets.paddingBottom
  const heightValue = useSharedValue(menuAyahViewIsOpen ? MAX_HEIGHT : MIN_HEIGHT)

  const scrollRef = React.useRef<ScrollView>(null)

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startHeight = heightValue.value
      ctx.startTime = Date.now()
      ctx.startTranslationY = 0
    },
    onActive: (event, ctx) => {
      let newHeight = ctx.startHeight - event.translationY
      if (newHeight > MAX_HEIGHT) {
        // Reduce the effect of the drag gesture if the new height is greater than the max height
        newHeight = MAX_HEIGHT + (newHeight - MAX_HEIGHT) / 10
      } else if (newHeight < MIN_HEIGHT) {
        // Reduce the effect of the drag gesture if the new height is less than the min height
        newHeight = MIN_HEIGHT + (newHeight - MIN_HEIGHT) / 4
      }
      heightValue.value = newHeight
      ctx.startTranslationY = event.translationY
    },
    onEnd: (event, ctx) => {
      let velocityY
      if (Platform.OS === "ios") {
        velocityY = event.velocityY // Use the provided velocity on iOS
      } else {
        velocityY = (ctx.startTranslationY - event.translationY) / (Date.now() - ctx.startTime) // Calculate the velocity manually on Android
      }
      if (velocityY < 0) {
        heightValue.value = withSpring(MAX_HEIGHT, {
          damping: 10, // Increase damping to reduce spring effect
          stiffness: 40, // Decrease stiffness to reduce spring effect
        })
        runOnJS(setMenuAyahViewIsOpen)(true)
      } else {
        heightValue.value = withSpring(MIN_HEIGHT, {
          damping: 20, // Increase damping to reduce spring effect
          stiffness: 70, // Decrease stiffness to reduce spring effect
        })
        runOnJS(setMenuAyahViewIsOpen)(false)
      }
    },
  })

  const animateAyahHeight = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
    }
  })

  const onOpenAyah = () => {
    setMenuAyahViewIsOpen(!menuAyahViewIsOpen)
  }

  useEffect(() => {
    heightValue.value = withTiming(menuAyahViewIsOpen ? MAX_HEIGHT : MIN_HEIGHT, {
      duration: 500,
    })
  }, [menuAyahViewIsOpen])

  const INITIAL_VALUE = 0
  const SCROLL_DISTANCE = 60

  const scrollY = useSharedValue(INITIAL_VALUE)
  const lastScrollY = useSharedValue(INITIAL_VALUE)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (event.contentOffset.y < scrollY.value) {
        lastScrollY.value = scrollY.value
      }
      scrollY.value = event.contentOffset.y
    },
  })

  const animatedStyles = useAnimatedStyle(() => {
    const translateY =
      scrollY.value < lastScrollY.value
        ? withTiming(INITIAL_VALUE)
        : withTiming(
            interpolate(
              scrollY.value,
              [INITIAL_VALUE, SCROLL_DISTANCE],
              [INITIAL_VALUE, -SCROLL_DISTANCE],
              Extrapolate.CLAMP,
            ),
          )

    return {
      transform: [{ translateY }],
      zIndex: 10,
      flex: 1,
    }
  })

  return !book ? null : (
    <View style={[$root]} onTouchStart={() => closeDropdown()} pointerEvents={"box-none"}>
      <Animated.View style={[animatedStyles]}>
        <SelectField
          options={listOptions}
          txValue={`${type}.${book.id}.name`}
          ref={dropdownRef}
          styles={$SelectFieldStyle}
        />

        <Animated.ScrollView
          style={[{ flex: 1 }]}
          contentContainerStyle={{ paddingHorizontal: spacing.md }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {loading ? (
            <Text tx={`${type}.loading`} style={{ textAlign: "left" }} />
          ) : bookText ? (
            <WebDisplay bookText={bookText} writingDirection={book.lang === "ar" ? "rtl" : "ltr"} />
          ) : (
            <Text tx={`${type}.noBookDetails`} style={{ textAlign: "left" }} />
          )}
        </Animated.ScrollView>
      </Animated.View>

      <PanGestureHandler onGestureEvent={gestureHandler} waitFor={scrollRef}>
        <Animated.View
          style={[$containerBottomSheet, $shadow, $containerInsets, animateAyahHeight]}
        >
          <View
            style={[
              {
                paddingTop: spacing.md,
                overflow: "hidden",
                flex: 1,
              },
            ]}
          >
            <Icon
              onPress={onOpenAyah}
              color={colors.surfaceBrand}
              icon="up2"
              size={14}
              style={[
                {
                  top: -4,
                  alignSelf: "center",
                  transform: [{ rotate: "180deg" }],
                },
              ]}
            />
            <ScrollView
              ref={scrollRef}
              bounces={false}
              contentContainerStyle={{ paddingBottom: spacing.sm }}
            >
              <View style={{ overflow: "hidden" }}>
                <Text size="xl" preset="ayah" style={{ paddingHorizontal: spacing.xs }}>
                  {getWarchAyatCombined(equivalantVersesWarsh)}
                </Text>
              </View>
            </ScrollView>
          </View>

          <TouchableOpacity onPress={onOpenAyah} activeOpacity={0.8}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: spacing.md,
              }}
            >
              <Icon
                size={24}
                icon="back2"
                color={colors.textBrandSecondary}
                onPress={() => setSelectedVerse(selectedVerses[0] - 1)}
                style={isRTL ? { transform: [{ rotate: "180deg" }] } : {}}
              />
              <Text
                text={translate("quran.surahAyah", {
                  surah: surahName?.[getLocale()] ?? surahName.ar,
                  ayah: convertedAyatBack.join(" و"),
                })}
                style={{
                  color: colors.textBrandSecondary,
                  flex: 1,
                  textAlign: "center",
                }}
              />
              <Icon
                size={24}
                icon="back2"
                color={colors.textBrandSecondary}
                onPress={() => setSelectedVerse(selectedVerses.at(-1) + 1)}
                style={!isRTL ? { transform: [{ rotate: "180deg" }] } : {}}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.surfaceSecondary,
  paddingTop: spacing.sm,
}

const $containerBottomSheet: ViewStyle = {
  backgroundColor: colors.surfaceSecondaryPlus,
  paddingHorizontal: spacing.md,
  borderTopLeftRadius: metrics.roundedLarge,
  borderTopRightRadius: metrics.roundedLarge,
}
const $shadow: ViewStyle = {
  shadowColor: colors.cardShadow,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,
}
const $SelectFieldStyle: ViewStyle = {
  marginHorizontal: spacing.md,
}

const WebDisplay = React.memo(function WebDisplay({ bookText, writingDirection }) {
  const systemFonts = [typography.books.normal, ...defaultSystemFonts]

  const renderersProps = {
    div: {
      enableExperimentalRtl: true,
    },
    p: {
      enableExperimentalRtl: true,
    },
  }
  return (
    <RenderHtml
      contentWidth={0}
      source={{
        html: bookText,
      }}
      baseStyle={{
        fontSize: 20,
        writingDirection,
        textAlign: "justify",
        fontFamily: typography.books.normal,
        paddingBottom: spacing.md,
      }}
      systemFonts={systemFonts}
      renderersProps={renderersProps}
    />
  )
})

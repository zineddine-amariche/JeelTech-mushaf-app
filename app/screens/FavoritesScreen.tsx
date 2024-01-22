import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Keyboard, Pressable, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { SideStackScreenProps } from "app/navigators"
import { Button, Icon, Text, TextField } from "app/components"
import { useStores } from "app/models"
import { colors, metrics, spacing } from "app/theme"
import { Quran } from "app/quran-helpers/quranData"
import { TxKeyPath, getLocale, translate } from "app/i18n"
import { useSideHeader } from "app/utils/useSideHeader"
import { getPrintPageText } from "app/utils/formatText"
import { equivalentVerses } from "app/quran-helpers/quranCountingData"
import { closeDrawer } from "app/navigators/navigationUtilities"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { DynamicCountText } from "app/components/DynamicCountText"
import { showAlert } from "app/utils/showAlert"
import { KeyboardAvoidingContainer } from "app/components/KeyboardAvoidingContainer"
import {
  FavoritesAyatCardProps,
  HeaderWrapperProps,
  NoteViewProps,
  UpdateNotesSectionProps,
} from "assets/db/FavoriteType"

const searchMappedMushaf = "imamMalik"
const textsMappedMushaf = "imamMalik"

interface FavoritesScreenProps extends NativeStackScreenProps<SideStackScreenProps<"Favorites">> {
  route: any // TODO: fix route params type
}
const warchData = require("assets/db/ayat/warsh.json")

export const FavoritesScreen: FC<FavoritesScreenProps> = observer(function FavoritesScreen(_props) {
  useSideHeader({ titleTx: "menus.favorites" })

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const flatListRef = useRef<FlatList>(null)

  const [itemHeights, setItemHeights] = useState<Record<string, number>>({})
  const [selectedItem, setSelectedItem] = useState(_props.route?.params)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const {
    mushafStore: { favoriteAyahList, selectedMushaf, setSelectedVerse, setSelectedPage },
    uiStore: { drawerIsOpen },
  } = useStores()

  const selectGotoVerse = (verse: number) => {
    setSelectedVerse(verse)
    setSelectedPage(Quran.getPageByVerse(verse, selectedMushaf))
    closeDrawer()
  }

  useEffect(() => {
    if (drawerIsOpen && _props.route.params?.editVerse) {
      setSelectedItem(_props.route.params.editVerse)
    }
  }, [drawerIsOpen])

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardOpen(true)
    })
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return (
    <KeyboardAvoidingContainer behavior={"padding"} containerStyle={$root}>
      <DynamicCountText
        count={favoriteAyahList.length}
        textKeys={{
          zero: "bookmarks.noFavoriteAyah",
          one: "bookmarks.favoriteAyahOne",
          lessThanTen: "bookmarks.favoritesAyahLessThanTen",
          moreThanTen: "bookmarks.favoritesAyahMoreThanTen",
        }}
      />
      <FlatList
        keyboardShouldPersistTaps="handled"
        ref={flatListRef}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingBottom:
            Number($containerInsets?.paddingBottom ?? 0) + spacing.md + (keyboardOpen ? 60 : 0),
          paddingTop: spacing.xxxs,
        }}
        data={favoriteAyahList}
        keyExtractor={(item, index) => `${item.surah}-${item.ayah}-${index}`}
        renderItem={({ item, index }) => {
          return (
            <FavoritesAyatCard
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout
                setItemHeights((prev) => ({ ...prev, [index]: height }))
              }}
              verse={item.verse}
              selectGotoVerse={() => selectGotoVerse(item.verse)}
              showNotes={item.verse === selectedItem}
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              item={item}
              onFocus={() => {
                // Calculate the position of the text field
                const position = Object.keys(itemHeights)
                  .slice(0, index)
                  .reduce((total, key) => total + itemHeights[key] + spacing.sm, 0)
                setTimeout(() => {
                  // Scroll to the position
                  flatListRef?.current?.scrollToOffset({ offset: position, animated: true })
                }, 800)
              }}
            />
          )
        }}
      />
    </KeyboardAvoidingContainer>
  )
})

const FavoritesAyatCard = observer(
  ({
    verse,
    showNotes,
    setSelectedItem,
    selectedItem,
    item,
    onFocus,
    selectGotoVerse,
    onLayout,
  }: FavoritesAyatCardProps) => {
    const {
      mushafStore: { selectedMushaf, deleteFavoriteAyah },
    } = useStores()

    useEffect(() => {
      if (showNotes) {
        onFocus()
      }
    }, [showNotes])

    const surahName = Quran.getSurahDetails(
      Quran.getDupletByVerseNo(verse, searchMappedMushaf).surah,
      searchMappedMushaf,
    ).name

    const equivalentVersesArray = equivalentVerses(verse, selectedMushaf, textsMappedMushaf)
    const cleanedAyahat = equivalentVersesArray.map((item) => warchData[item - 1].slice(0, -2))

    const printPage = getPrintPageText(
      Quran.getPageByVerse(verse ?? 1, selectedMushaf),
      selectedMushaf,
    )

    const onYesPressed = useCallback(() => {
      deleteFavoriteAyah(item.verse)
      setSelectedItem(null)
    }, [item.verse])

    return (
      <Pressable
        style={[$ayatContainer, $shadow, { marginBottom: spacing.sm }]}
        onPress={selectGotoVerse}
        onLayout={verse === selectedItem ? undefined : onLayout}
      >
        <HeaderWrapper
          showEditButton={selectedItem !== item.verse}
          onEditPress={() => {
            if (verse === selectedItem) {
              setSelectedItem(null)
            } else {
              setSelectedItem(verse)
            }
          }}
          txSurahName={
            translate("quran.surahAyah", {
              surah: surahName?.[getLocale() as keyof typeof surahName] ?? surahName.ar,
              ayah: Quran.getDupletByVerseNo(verse, searchMappedMushaf).ayah,
            }) as TxKeyPath
          }
          txPage={
            translate("bookmarks.page", {
              page: `${printPage}`,
            }) as TxKeyPath
          }
          onDeletePressed={() => {
            showAlert({
              titleKey: "bookmarks.alert",
              messageKey: "bookmarks.alerMessageDelete",
              noKey: "bookmarks.alertMessageNo",
              yesKey: "bookmarks.alertMessageYes",
              onYesPressed,
            })
          }}
        />
        <Text
          text={cleanedAyahat.join(" ")}
          preset="ayah"
          numberOfLines={1}
          ellipsizeMode="middle"
        />
        <NoteView note={item.note} isEditNoteVisible={showNotes} />
        <UpadteNotesSection
          isEditNoteVisible={showNotes}
          verse={verse}
          hideEdit={() => setSelectedItem(null)}
          note={item.note}
        />
      </Pressable>
    )
  },
)

const HeaderWrapper = ({
  txSurahName,
  txPage,
  showEditButton,
  onEditPress,
  onDeletePressed,
}: HeaderWrapperProps) => {
  return (
    <View style={$HeaderWrapperStyle}>
      <View style={$pageContainer}>
        <Text
          style={{ textAlign: "left", color: colors.textBrandSecondary }}
          tx={txSurahName}
        ></Text>
        <Text
          style={{ textAlign: "left", color: colors.textSecondary, fontSize: 14 }}
          tx={txPage}
        ></Text>
      </View>
      {showEditButton ? (
        <Button preset="icon" onPress={onEditPress}>
          <Icon size={18} color={colors.textBrand} icon={"edit"} />
        </Button>
      ) : (
        <Button
          preset="icon"
          onPress={onDeletePressed}
          style={{
            borderColor: colors.error,
          }}
        >
          <Icon size={18} color={colors.error} icon={"delete"} />
        </Button>
      )}
    </View>
  )
}
const NoteView = ({ note, isEditNoteVisible }: NoteViewProps) => {
  if (!note || isEditNoteVisible) {
    return null
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: spacing.xxs }}>
      <Text tx="bookmarks.remarks" size="xs" weight="light"></Text>
      <Text style={{ color: colors.textSecondary }} size="xs" weight="light">
        {note}
      </Text>
    </View>
  )
}
const UpadteNotesSection = observer(
  ({ isEditNoteVisible, verse, hideEdit, note }: UpdateNotesSectionProps) => {
    const [notesText, setNotesText] = useState(note)
    const notesInputRef = useRef(null)

    const {
      mushafStore: { updateFavoriteAyahNote },
    } = useStores()

    return isEditNoteVisible ? (
      <View style={{ gap: spacing.sm }}>
        <TextField
          style={$textFeildStyle}
          ref={notesInputRef}
          placeholderTx="bookmarks.placeholder"
          labelTx="bookmarks.remarks"
          LabelTextProps={{
            style: { color: colors.textBrand, marginBottom: 0 },
            weight: "light",
            size: "xs",
          }}
          onChangeText={setNotesText}
          inputWrapperStyle={{ paddingVertical: spacing.xxs }}
          autoFocus={true}
          value={notesText}
        />
        <View style={{ flexDirection: "row", justifyContent: "flex-end", columnGap: spacing.xxs }}>
          <Button
            preset={"cancel"}
            tx={"bookmarks.cancel"}
            onPress={() => {
              setNotesText(note)
              hideEdit()
            }}
            LeftAccessory={() => <Icon size={16} color={colors.textPrimary} icon={"close"} />}
          />
          <Button
            preset={"confirm"}
            tx={"bookmarks.save"}
            onPress={() => {
              updateFavoriteAyahNote(verse, notesText)
              hideEdit()
            }}
            LeftAccessory={() => <Icon size={18} color={colors.textBrand} icon={"check"} />}
          />
        </View>
      </View>
    ) : null
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.surfaceSecondary,
  paddingTop: spacing.md,
}

const $ayatContainer: ViewStyle = {
  backgroundColor: colors.white,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  justifyContent: "space-between",
  borderRadius: metrics.roundedMedium,
  marginHorizontal: spacing.xxxs,
}
const $pageContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxs,
}
const $shadow: ViewStyle = {
  shadowColor: colors.cardShadow,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
  elevation: 2,
}
const $textFeildStyle: ViewStyle = {
  marginHorizontal: 0,
  marginVertical: 0,
  paddingBottom: 0,
}

const $HeaderWrapperStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: spacing.xxs,
}

import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { SideStackScreenProps } from "app/navigators"
import { Text } from "app/components"
import { useStores } from "app/models"
import { colors, metrics, spacing } from "app/theme"
import { Quran } from "app/quran-helpers/quranData"
import { TxKeyPath, getLocale, translate } from "app/i18n"
import { useSideHeader } from "app/utils/useSideHeader"
import { getPrintPageText } from "app/utils/formatText"
import { closeDrawer } from "app/navigators/navigationUtilities"
import { equivalentVerses } from "app/quran-helpers/quranCountingData"
import { FlashList } from "@shopify/flash-list"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"

const searchMappedMushaf = "imamMalik"
const textsMappedMushaf = "imamMalik"

interface BookmarksScreenProps extends NativeStackScreenProps<SideStackScreenProps<"Bookmarks">> {}
const warchData = require("assets/db/ayat/warsh.json")

export const BookmarksScreen: FC<BookmarksScreenProps> = observer(function BookmarksScreen(_props) {
  useSideHeader({ titleTx: "menus.bookmarks" })

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const {
    mushafStore: { bookmark, bookmarksHistory, selectedMushaf, setSelectedVerse, setSelectedPage },
  } = useStores()

  const selectGotoVerse = (verse: number) => {
    setSelectedVerse(verse)
    setSelectedPage(Quran.getPageByVerse(verse, selectedMushaf))
    closeDrawer()
  }

  const printPage = getPrintPageText(
    Quran.getPageByVerse(bookmark?.verse ?? 1, selectedMushaf),
    selectedMushaf,
  )
  return (
    <View style={$root}>
      <View style={{ marginHorizontal: spacing.md, gap: spacing.xs }}>
        <Text style={{ textAlign: "left" }} tx="bookmarks.bookmarkTitle"></Text>
        <RenderBookItem
          verse={bookmark?.verse}
          printPage={printPage}
          press={(verse) => selectGotoVerse(verse)}
        />
      </View>
      {bookmarksHistory.length > 0 && (
        <>
          <Text
            style={{ textAlign: "left", marginHorizontal: spacing.md, marginBottom: spacing.xs }}
            tx="bookmarks.previousBookmarks"
          />
          <FlashList
            estimatedItemSize={bookmarksHistory.length * 10}
            contentContainerStyle={{
              paddingHorizontal: spacing.md,
              paddingBottom: $containerInsets.paddingBottom + spacing.md,
              paddingTop: spacing.xxxs,
            }}
            data={bookmarksHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <RenderBookItem
                verse={item.verse}
                printPage={getPrintPageText(
                  Quran.getPageByVerse(item.verse, selectedMushaf),
                  selectedMushaf,
                )}
                press={(verse) => selectGotoVerse(verse)}
              />
            )}
          />
        </>
      )}
    </View>
  )
})

type RenderBookItemProps = {
  verse: number | undefined
  printPage: string
  press: (verse: number) => void
}
const RenderBookItem: React.FC<RenderBookItemProps> = observer(({ verse, printPage, press }) => {
  const {
    mushafStore: { selectedMushaf },
  } = useStores()

  if (!verse) return null

  const equivalentVersesArray = equivalentVerses(verse, selectedMushaf, textsMappedMushaf)
  const cleanedAyahat = equivalentVersesArray.map((item) => warchData[item - 1].slice(0, -2))

  const surahName = Quran.getSurahDetails(
    Quran.getDupletByVerseNo(verse, searchMappedMushaf).surah,
    searchMappedMushaf,
  ).name

  return (
    <TouchableOpacity style={[$ayatContainer, $shadow]} onPress={() => press(verse)}>
      <View style={$pageContainer}>
        <Text
          style={{ textAlign: "left", color: colors.textBrandSecondary }}
          tx={
            translate("bookmarks.page", {
              page: `${printPage}`,
            }) as TxKeyPath
          }
        ></Text>
        <Text
          style={{ textAlign: "left", color: colors.textSecondary, fontSize: 14 }}
          tx={
            translate("quran.surahAyah", {
              surah: surahName?.[getLocale() as keyof typeof surahName] ?? surahName.ar,
              ayah: `${Quran.getDupletByVerseNo(verse, searchMappedMushaf).ayah}`,
            }) as TxKeyPath
          }
        ></Text>
      </View>
      <Text text={cleanedAyahat.join(" ")} preset="ayah" numberOfLines={1} />
    </TouchableOpacity>
  )
})

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
  marginBottom: spacing.sm,
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

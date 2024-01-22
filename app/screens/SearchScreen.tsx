import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TextInput, TouchableOpacity, View, ViewStyle } from "react-native"
import { SideStackScreenProps } from "app/navigators"
import { Icon, Text, TextField } from "app/components"
import { colors, metrics, spacing } from "app/theme"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { useSideHeader } from "app/utils/useSideHeader"
import { search } from "app/utils/search"
import { Quran } from "app/quran-helpers/quranData"
import { equivalentVerses } from "app/quran-helpers/quranCountingData"
import { closeDrawer } from "app/navigators/navigationUtilities"
import { useStores } from "app/models"
import { getLocale, translate } from "app/i18n"
import { cleanArabicText } from "app/utils/cleanArabicText"

const warchData = require("assets/db/ayat/warsh.json")

interface SearchScreenProps extends SideStackScreenProps<"Search"> {}

export const SearchScreen: FC<SearchScreenProps> = observer(function SearchScreen(_props) {
  useSideHeader({ titleTx: "menus.search" })

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const [result, setResult] = useState([])
  const [searchText, setSearchText] = useState("")

  const {
    mushafStore: { setSelectedPage, selectedMushaf, setSelectedVerses },
    uiStore: { drawerIsOpen },
  } = useStores()

  const resultListRef = useRef<FlatList>(null)
  const searchInputRef = useRef<TextInput>(null)

  const searchMappedMushaf = "imamMalik"
  const textsMappedMushaf = "shirifi2"

  useEffect(() => {
    if (drawerIsOpen && searchInputRef.current && searchText.length === 0) {
      searchInputRef.current.focus()
    }
  }, [drawerIsOpen])

  useEffect(() => {
    setResult(
      searchText.length
        ? [
            ...new Set(
              search(searchText, 1).map((item) =>
                equivalentVerses(
                  Quran.getVerseNoByDuplet(item[0], item[1] + 1, textsMappedMushaf),
                  textsMappedMushaf,
                  searchMappedMushaf,
                ).join("-"),
              ),
            ),
          ]
        : [],
    )
    resultListRef.current?.scrollToOffset({ animated: false, offset: 0 })
  }, [searchText])

  interface ResultProps {
    verses: number
    title: string
    content: string
  }
  const Result: FC<ResultProps> = ({ verses, title, content }) => {
    return (
      <TouchableOpacity
        style={[$resultContainer, $shadow]}
        onPress={() => {
          const equivanlentVerses = equivalentVerses(verses[0], searchMappedMushaf, selectedMushaf)
          setSelectedPage(Quran.getPageByVerse(equivanlentVerses[0], selectedMushaf))
          setSelectedVerses(equivanlentVerses)
          closeDrawer()
        }}
      >
        <Text text={title} style={{ color: colors.textBrandSecondary }} />
        <Text text={content} preset="ayah" />
      </TouchableOpacity>
    )
  }

  return (
    <View style={$root}>
      <View
        style={{
          flex: 1,
          paddingTop: spacing.lg,
        }}
      >
        <TextField
          ref={searchInputRef}
          autoFocus={true}
          placeholderTx="search.placeholder"
          onChangeText={(text) => {
            setSearchText(cleanArabicText(text))
          }}
          inputWrapperStyle={{ height: spacing.xl }}
          RightAccessory={() => (
            <Icon
              style={{ flex: 1, marginLeft: spacing.xs }}
              size={18}
              color={colors.textBrand}
              icon={"search"}
            />
          )}
          status={result.length === 0 && searchText.length !== 0 ? "error" : undefined}
          containerStyle={{
            width: "100%",
            marginBottom: spacing.sm,
            paddingHorizontal: spacing.md,
          }}
          helperTx={searchText.length === 0 ? undefined : "search.resultsCount"}
          helperTxOptions={{ count: result.length }}
          HelperTextProps={{
            style: { paddingTop: spacing.md },
          }}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: spacing.md,
              paddingBottom: $containerInsets.paddingBottom + spacing.md,
              paddingTop: spacing.xxxs,
            }}
            ref={resultListRef}
            data={result}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const itemArr = item.split("-")
              const surahName = Quran.getSurahDetails(
                Quran.getDupletByVerseNo(itemArr[0], searchMappedMushaf).surah,
                searchMappedMushaf,
              ).name
              return (
                <Result
                  verses={itemArr}
                  title={translate("quran.surahAyah", {
                    surah: surahName?.[getLocale()] ?? surahName.ar,
                    ayah: itemArr
                      .map((v) => `${Quran.getDupletByVerseNo(v, searchMappedMushaf).ayah}`)
                      .join(translate("quran.ayahSeparator")),
                  })}
                  content={itemArr.map((v) => warchData[v - 1]).join(" ")}
                />
              )
            }}
          />
        </View>
      </View>
    </View>
  )
})

const $root: ViewStyle = { flex: 1, backgroundColor: colors.surfaceSecondary }

const $resultContainer: ViewStyle = {
  backgroundColor: colors.white,
  marginBottom: spacing.sm,
  padding: spacing.sm,
  borderRadius: metrics.roundedMinimal,
}

const $shadow: ViewStyle = {
  shadowColor: colors.cardShadow,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
  elevation: 2,
}

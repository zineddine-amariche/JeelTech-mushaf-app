import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, ViewStyle, useWindowDimensions } from "react-native"
import { SideStackScreenProps } from "app/navigators"
import { Button, Icon, Text, TextField } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { useStores } from "app/models"
import { Quran, SurahDetails } from "app/quran-helpers/quranData"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import WheelPicker from "app/components/WheelPicker"
import { getLocale, isRTL, translate } from "app/i18n"
import { useSideHeader } from "app/utils/useSideHeader"
import { getPrintPageText } from "app/utils/formatText"
import { closeDrawer } from "app/navigators/navigationUtilities"
import { cleanArabicText } from "app/utils/cleanArabicText"
import { getEquivalantWarchAyatCombined } from "app/quran-helpers/ayatTexts"
import { TabView, TabBar } from "react-native-tab-view"

const SuwarRoute = ({
  ayat,
  page,
  ayah,
  sura,
  juz,
  eighth,
  hizb,
  changing,
  setAyat,
  setPage,
  setAyah,
  setSura,
  setJuz,
  setEighth,
  setHizb,
  setChanging,
  pageRef,
  surahRef,
  ayahRef,
  juzRef,
  hizbRef,
  eighthRef,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false)

  const {
    mushafStore: { setSelectedPage, setSelectedVerse, selectedPage, selectedMushaf, selectedSurah },
  } = useStores()

  const pages = Array.from({ length: Quran.getNumberOfPages(selectedMushaf) }, (_, i) =>
    getPrintPageText(i + 1, selectedMushaf),
  )
  const suwar = Quran.getSuwarDetails(selectedMushaf)

  const [searchText, setSearchText] = useState("")

  const selectPage = (page, updatePage = false) => {
    setChanging("page")
    const { surah, ayah, juz, hizb, eighth } = Quran.getPageDetails(page, selectedMushaf)

    const ayat = Array.from(
      { length: Quran.getSurahDetails(surah, selectedMushaf).ayahs },
      (_, i) => i + 1,
    )

    setPage(page)
    setSura(surah)
    setAyat(ayat)
    setAyah(ayah)
    setJuz(juz)
    setHizb(hizb)
    setEighth(eighth)

    if (updatePage) pageRef?.current?.setItem(page)
    surahRef?.current?.setItem(surah)

    setTimeout(() => ayahRef?.current?.setItem(ayah), 0)
    juzRef?.current?.setItem(juz)
    hizbRef?.current?.setItem(hizb)
    eighthRef?.current?.setItem(eighth)
  }

  const hideSearch = () => {
    if (showSearchInput) {
      setShowSearchInput(!showSearchInput)
    }
  }

  const handleTextChange = (text: string) => {
    setSearchText(cleanArabicText(text))
  }

  useEffect(() => {
    selectPage(selectedPage, true)
  }, [selectedPage])

  const searchSurah = (searchText: string) => {
    const regex = new RegExp(`${searchText}`)
    const surah = suwar.find((surah) => surah.name.ar.match(regex))
    if (surah !== undefined && searchText !== "" && showSearchInput) {
      setChanging("surah")
      surahRef?.current?.setItem(surah.number)
    }
  }

  useEffect(() => {
    if (searchText !== "") {
      searchSurah(searchText)
    }
  }, [searchText])

  return (
    <View
      style={{ flex: 1, padding: spacing.md }}
      onTouchStart={() => hideSearch()}
      pointerEvents={"box-none"}
    >
      {showSearchInput ? (
        <SearchField handleTextChange={handleTextChange} />
      ) : (
        <TouchableOpacity
          onPress={() => setShowSearchInput(!showSearchInput)}
          style={{
            flexDirection: "row",
            height: spacing.xl,
            borderBottomWidth: 1,
            borderColor: colors.surfaceBrand,
          }}
        >
          <View
            style={{
              width: "20%",
              flex: 0.2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              tx={"index.page"}
              style={{
                textAlign: "center",
                color: colors.surfaceBrand,
                borderColor: colors.surfaceBrand,
                height: 25,
              }}
              numberOfLines={1}
            />
          </View>
          <View
            style={{
              width: "60%",
              flex: 0.6,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: spacing.xs,
            }}
          >
            <Text
              tx={"index.surah"}
              style={{
                textAlign: "center",
                color: colors.surfaceBrand,
                borderColor: colors.surfaceBrand,
                height: 25,
              }}
              numberOfLines={1}
            />
            <Icon icon="search" size={16} color={colors.surfaceBrand} />
          </View>
          <View
            style={{
              width: "20%",
              flex: 0.2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              tx={"index.ayah"}
              style={{
                textAlign: "center",
                color: colors.surfaceBrand,
                borderColor: colors.surfaceBrand,
                height: 25,
              }}
              numberOfLines={1}
            />
          </View>
        </TouchableOpacity>
      )}

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            width: "20%",
            flex: 0.2,
            alignItems: "center",
            justifyContent: "center",
          }}
          onTouchStart={() => {
            setChanging("page")
          }}
        >
          <WheelPicker
            compName="page"
            ref={pageRef}
            height="100%"
            width="100%"
            initialSelectedIndex={selectedPage - 1}
            items={pages.map((name, i) => ({ label: name, value: i }))}
            onChange={({ item }) => {
              if (item !== undefined && changing === "page") {
                selectPage(item.value + 1)
                hideSearch()
              }
            }}
            backgroundColor={colors.surfaceSecondary}
          />
        </View>
        <View
          style={{
            width: "60%",
            flex: 0.6,
            alignItems: "center",
            justifyContent: "center",
          }}
          onTouchStart={() => setChanging("surah")}
        >
          <WheelPicker
            compName="surah"
            ref={surahRef}
            height="100%"
            width="100%"
            items={suwar.map((surah: SurahDetails, i) => ({
              label: surah.name?.[getLocale()] ?? surah.name.ar,
              subLabel: translate("quran.surahDetail", {
                number: surah.number,
                type: surah.type,
                count: surah.ayahs,
              }),
              value: i,
            }))}
            onChange={({ item }) => {
              if (item !== undefined && changing === "surah") {
                const surah = item.value + 1
                const ayat = Array.from(
                  { length: Quran.getSurahDetails(surah, selectedMushaf).ayahs },
                  (_, i) => i + 1,
                )
                const page = Quran.getPageByDuplet(surah, 1, selectedMushaf)
                const eighthNo = Quran.getEighthNoByVerseNo(
                  Quran.getVerseNoByDuplet(surah, 1, selectedMushaf),
                  selectedMushaf,
                )
                const { juz, hizb, eighth } = Quran.getEighthDetails(eighthNo, selectedMushaf)

                setSura(surah)
                setAyat(ayat)
                setAyah(1)
                setPage(page)
                setJuz(juz)
                setHizb(hizb)
                setEighth(eighth)

                pageRef?.current?.setItem(page)
                ayahRef?.current?.setItem(1)
                juzRef?.current?.setItem(juz)
                hizbRef?.current?.setItem(hizb)
                eighthRef?.current?.setItem(eighth)
              }
            }}
            backgroundColor={colors.surfaceSecondary}
          />
        </View>
        <View
          style={{
            width: "20%",
            flex: 0.2,
            alignItems: "center",
            justifyContent: "center",
          }}
          onTouchStart={() => setChanging("ayah")}
        >
          <WheelPicker
            compName="ayah"
            ref={ayahRef}
            height="100%"
            width="100%"
            items={ayat.map((name, i) => {
              return {
                label: name,
                value: i,
              }
            })}
            onChange={({ item }) => {
              if (item !== undefined && changing === "ayah") {
                const ayah = item.value + 1
                const page = Quran.getPageByDuplet(sura, ayah, selectedMushaf)
                const eighthNo = Quran.getEighthNoByVerseNo(
                  Quran.getVerseNoByDuplet(sura, ayah, selectedMushaf),
                  selectedMushaf,
                )
                const { juz, hizb, eighth } = Quran.getEighthDetails(eighthNo, selectedMushaf)

                setAyah(ayah)
                setPage(page)
                setJuz(juz)
                setHizb(hizb)
                setEighth(eighth)

                pageRef?.current?.setItem(page)
                juzRef?.current?.setItem(juz)
                hizbRef?.current?.setItem(hizb)
                eighthRef?.current?.setItem(eighth)
                hideSearch()
              }
            }}
            backgroundColor={colors.surfaceSecondary}
          />
        </View>
      </View>

      <Button
        tx="index.gotoAyah"
        preset="filled"
        onPress={() => {
          setSelectedPage(page)
          setSelectedVerse(Quran.getVerseNoByDuplet(sura, ayah, selectedMushaf))
          closeDrawer()
        }}
      />
    </View>
  )
}

const EighthsRoute = ({
  ayat,
  page,
  ayah,
  sura,
  juz,
  eighth,
  hizb,
  changing,
  setAyat,
  setPage,
  setAyah,
  setSura,
  setJuz,
  setEighth,
  setHizb,
  setChanging,
  pageRef,
  surahRef,
  ayahRef,
  juzRef,
  hizbRef,
  eighthRef,
}) => {
  const juzs = Array.from({ length: 30 }, (_, i) => i + 1)
  const hizbs = Array.from({ length: 60 }, (_, i) => i + 1)
  const eighths = Array.from({ length: 8 }, (_, i) => i + 1)

  const {
    mushafStore: { setSelectedPage, setSelectedVerse, selectedMushaf },
  } = useStores()
  return (
    <View style={{ flex: 1, padding: spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          height: spacing.xl,
          borderBottomWidth: 1,
          borderColor: colors.surfaceBrand,
        }}
      >
        <View
          style={{
            width: "20%",
            flex: 0.2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            tx={"index.juz"}
            style={{
              textAlign: "center",
              color: colors.surfaceBrand,
              borderColor: colors.surfaceBrand,
              height: 25,
            }}
            numberOfLines={1}
          />
        </View>
        <View
          style={{
            width: "20%",
            flex: 0.2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            tx={"index.hizb"}
            style={{
              textAlign: "center",
              color: colors.surfaceBrand,
              borderColor: colors.surfaceBrand,
              height: 25,
            }}
            numberOfLines={1}
          />
        </View>
        <View
          style={{
            width: "60%",
            flex: 0.6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            tx={"index.eighth"}
            style={{
              textAlign: "center",
              color: colors.surfaceBrand,
              borderColor: colors.surfaceBrand,
              height: 25,
            }}
            numberOfLines={1}
          />
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            width: "20%",
            flex: 0.2,
            alignItems: "center",
            justifyContent: "center",
          }}
          onTouchStart={() => setChanging("juz")}
        >
          <WheelPicker
            compName="juz"
            ref={juzRef}
            height="100%"
            width="100%"
            items={juzs.map((name, i) => ({ label: name, value: i }))}
            onChange={({ item }) => {
              if (item !== undefined && changing === "juz") {
                const juz = item.value + 1
                const { hizb, eighth, page, surah, ayah } = Quran.getEighthDetails(
                  (juz - 1) * 16,
                  selectedMushaf,
                )
                const ayat = Array.from(
                  { length: Quran.getSurahDetails(surah, selectedMushaf).ayahs },
                  (_, i) => i + 1,
                )

                setJuz(juz)
                setHizb(hizb)
                setEighth(eighth)
                setPage(page)
                setSura(surah)
                setAyat(ayat)
                setAyah(ayah)

                hizbRef?.current?.setItem(hizb)
                eighthRef?.current?.setItem(eighth)
                pageRef?.current?.setItem(page)
                surahRef?.current?.setItem(surah)
                setTimeout(() => ayahRef?.current?.setItem(ayah), 0)
              }
            }}
            backgroundColor={colors.surfaceSecondary}
          />
        </View>
        <View
          style={{
            width: "20%",
            flex: 0.2,
            justifyContent: "center",
            alignItems: "center",
          }}
          onTouchStart={() => setChanging("hizb")}
        >
          <WheelPicker
            compName="hizb"
            ref={hizbRef}
            height="100%"
            width="100%"
            items={hizbs.map((name, i) => ({
              label: name,
              value: i,
            }))}
            onChange={({ item }) => {
              if (item !== undefined && changing === "hizb") {
                const hizb = item.value + 1
                const { juz, eighth, page, surah, ayah } = Quran.getEighthDetails(
                  (hizb - 1) * 8,
                  selectedMushaf,
                )
                const ayat = Array.from(
                  { length: Quran.getSurahDetails(surah, selectedMushaf).ayahs },
                  (_, i) => i + 1,
                )

                setJuz(juz)
                setHizb(hizb)
                setEighth(eighth)
                setPage(page)
                setSura(surah)
                setAyat(ayat)
                setAyah(ayah)

                juzRef?.current?.setItem(juz)
                eighthRef?.current?.setItem(eighth)
                pageRef?.current?.setItem(page)
                surahRef?.current?.setItem(surah)
                setTimeout(() => ayahRef?.current?.setItem(ayah), 0)
              }
            }}
            backgroundColor={colors.surfaceSecondary}
          />
        </View>
        <View
          style={{
            width: "60%",
            flex: 0.6,
            justifyContent: "center",
            alignItems: "center",
          }}
          onTouchStart={() => setChanging("eighth")}
        >
          <WheelPicker
            compName="eighth"
            ref={eighthRef}
            height="100%"
            width="100%"
            items={eighths.map((eighth, i) => {
              // get eighth details
              const eighthDetails = Quran.getEighthDetails(eighth + (hizb - 1) * 8, selectedMushaf)
              // get surah name
              const surahName = Quran.getSurahDetails(eighthDetails.surah, selectedMushaf).name
              // get equivalent warch ayah
              const warchAyah = getEquivalantWarchAyatCombined(
                Quran.getVerseNoByEighthNo(eighth + (hizb - 1) * 8, selectedMushaf),
                selectedMushaf,
              )

              return {
                label: translate(`index.eighth${eighth}`),
                ayah: warchAyah,
                surah: `${surahName[getLocale()] ?? surahName.ar} ${eighthDetails.ayah}`,
                value: i,
                isMultiView: true,
              }
            })}
            onChange={({ item }) => {
              if (item !== undefined && changing === "eighth") {
                const eighth = item.value + 1
                const { page, surah, ayah } = Quran.getEighthDetails(
                  (hizb - 1) * 8 + eighth,
                  selectedMushaf,
                )

                const ayat = Array.from(
                  { length: Quran.getSurahDetails(surah, selectedMushaf).ayahs },
                  (_, i) => i + 1,
                )

                setEighth(eighth)
                setPage(page)
                setSura(surah)
                setAyat(ayat)
                setAyah(ayah)

                pageRef?.current?.setItem(page)
                surahRef?.current?.setItem(surah)
                setTimeout(() => ayahRef?.current?.setItem(ayah), 0)
              }
            }}
            backgroundColor={colors.surfaceSecondary}
          />
        </View>
      </View>

      <Button
        tx="index.gotoAyah"
        preset="filled"
        onPress={() => {
          setSelectedPage(page)
          setSelectedVerse(Quran.getVerseNoByDuplet(sura, ayah, selectedMushaf))
          closeDrawer()
        }}
      />
    </View>
  )
}

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: colors.borderSecondary }}
    style={{ backgroundColor: colors.surfaceSecondaryPlus }}
    getLabelText={({ route }) => translate(route.title)}
    activeColor={colors.surfaceBrand}
    inactiveColor={colors.textSecondary}
    labelStyle={{
      fontFamily: isRTL ? typography.primary.bold : typography.primaryLatin.bold,
      fontSize: 18,
    }}
  />
)

interface IndexScreenProps extends SideStackScreenProps<"Index"> {}

export const IndexScreen: FC<IndexScreenProps> = observer(function IndexScreen(_props) {
  useSideHeader({ titleTx: "menus.index" })

  const [index, setIndex] = React.useState(0)

  const [ayat, setAyat] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [ayah, setAyah] = React.useState(1)
  const [sura, setSura] = React.useState(1)
  const [juz, setJuz] = React.useState(1)
  const [eighth, setEighth] = React.useState(1)
  const [hizb, setHizb] = React.useState(1)
  const [changing, setChanging] = React.useState("page")

  const pageRef = useRef()
  const surahRef = useRef()
  const ayahRef = useRef()

  const juzRef = useRef()
  const hizbRef = useRef()
  const eighthRef = useRef()

  const [routes] = React.useState([
    { key: "suwar", title: "index.suwar" },
    { key: "ajzaa", title: "index.ajzaa" },
  ])
  const layout = useWindowDimensions()

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "suwar":
        return (
          <SuwarRoute
            ayat={ayat}
            page={page}
            ayah={ayah}
            sura={sura}
            juz={juz}
            eighth={eighth}
            hizb={hizb}
            changing={changing}
            setAyat={setAyat}
            setPage={setPage}
            setAyah={setAyah}
            setSura={setSura}
            setJuz={setJuz}
            setEighth={setEighth}
            setHizb={setHizb}
            setChanging={setChanging}
            pageRef={pageRef}
            surahRef={surahRef}
            ayahRef={ayahRef}
            juzRef={juzRef}
            hizbRef={hizbRef}
            eighthRef={eighthRef}
          />
        )
      case "ajzaa":
        return (
          <EighthsRoute
            ayat={ayat}
            page={page}
            ayah={ayah}
            sura={sura}
            juz={juz}
            eighth={eighth}
            hizb={hizb}
            changing={changing}
            setAyat={setAyat}
            setPage={setPage}
            setAyah={setAyah}
            setSura={setSura}
            setJuz={setJuz}
            setEighth={setEighth}
            setHizb={setHizb}
            setChanging={setChanging}
            pageRef={pageRef}
            surahRef={surahRef}
            ayahRef={ayahRef}
            juzRef={juzRef}
            hizbRef={hizbRef}
            eighthRef={eighthRef}
          />
        )
      default:
        return null
    }
  }

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])
  return (
    <View style={[$root, $containerInsets]}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  )
})

const SearchField = ({ handleTextChange }) => {
  const searchInputRef = useRef()
  return (
    <View
      style={{
        height: spacing.xl,
      }}
    >
      <TextField
        ref={searchInputRef}
        autoFocus={true}
        placeholderTx="index.searchPlaceholder"
        onChangeText={handleTextChange}
        inputWrapperStyle={{ height: spacing.xl }}
        RightAccessory={() => (
          <Icon
            style={{ flex: 1, marginLeft: spacing.xs }}
            size={18}
            color={colors.textBrand}
            icon={"search"}
          />
        )}
      />
    </View>
  )
}

const $root: ViewStyle = { flex: 1, backgroundColor: colors.surfaceSecondary }

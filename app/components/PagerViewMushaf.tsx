import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Image, View, ViewStyle } from "react-native"
import PagerView from "react-native-pager-view"
import { ImageZoomable } from "./ImageZoomable"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { Masahif } from "assets/db/masahif/masahif"
import { Quran } from "app/quran-helpers/quranData"
import { equivalentVerse } from "app/quran-helpers/quranCountingData"
import { getFileOrDownload } from "app/utils/downloadUtils"
// const ayat = require("../../assets/db/ayatShadow/'+current+'.json")

const ResolveImage = (props) => {
  const [imageUri, setImageUri] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const imageUri = await getFileOrDownload(props.remotePath, props.localPath)
      setImageUri(imageUri)
    })()
  }, [])

  const currentPageAyatShadows = useMemo(
    () => props.ayat.ayat.filter((ayah: any) => ayah.page === props.page),
    [props.ayat, props.page],
  )
  const numberOfAyatBeforePage = useMemo(
    () => props.ayat.ayat.filter((a: any) => a.page < props.page).length,
    [props.ayat, props.page],
  )
  return imageUri ? (
    <ImageZoomable
      imageUri={imageUri}
      page={props.page}
      currentPageParams={props.ayat.pages[props.page]}
      currentPageParamsDefault={props.ayat.pages.default}
      currentPageAyatShadows={currentPageAyatShadows}
      numberOfAyatBeforePage={numberOfAyatBeforePage}
    />
  ) : (
    <View style={$pagePlaceholder}>
      <Image
        source={require("../../assets/images/logo.png")}
        resizeMode="contain"
        style={{ height: 200 }}
      />
    </View>
  )
}

const PagerViewMushaf: React.FC = () => {
  const pagerRef = useRef<PagerView>(null)
  const {
    mushafStore: { selectedMushaf, selectedPage, setSelectedPage },
    audioStore: { setCurrentPosition },
  } = useStores()
  const [ignorePageSelected, setIgnorePageSelected] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [currentMushaf, setCurrentMushaf] = useState(Masahif[selectedMushaf])
  const [currentPageIndex, setCurrentPageIndex] = useState(Masahif[selectedMushaf].pages)
  useEffect(() => {
    if (currentMushaf.name !== selectedMushaf) {
      setCurrentMushaf(Masahif[selectedMushaf])
      setCurrentPageIndex(
        Quran.getPageByVerse(
          equivalentVerse(
            Quran.getVerseNoByPage(currentPageIndex, selectedMushaf),
            currentMushaf.name,
            selectedMushaf,
          ),
          selectedMushaf,
        ),
      )
    } else {
      if (!ignorePageSelected) {
        pagerRef.current?.setPageWithoutAnimation(Masahif[selectedMushaf].pages - selectedPage)
      } else {
        setIgnorePageSelected(false)
      }
    }
  }, [selectedPage, selectedMushaf])

  const renderPage = useCallback(
    (pageIndex: number) => {
      const reversedPageIndex = Masahif[selectedMushaf].pages - pageIndex - 1
      const minPageIndex = Math.max(0, currentPageIndex - 2)
      const maxPageIndex = Math.min(Masahif[selectedMushaf].pages - 1, currentPageIndex + 2)
      const reversedMinPageIndex = Masahif[selectedMushaf].pages - maxPageIndex
      const reversedMaxPageIndex = Masahif[selectedMushaf].pages - minPageIndex
      if (
        currentMushaf &&
        reversedPageIndex >= reversedMinPageIndex &&
        reversedPageIndex <= reversedMaxPageIndex
      ) {
        const remotePath = `${currentMushaf.url}/${reversedPageIndex.toString()}.${
          currentMushaf.ext
        }`
        const localPath = `${currentMushaf.local}/${reversedPageIndex.toString()}.${
          currentMushaf.ext
        }`
        return (
          <View key={"p_" + reversedPageIndex} style={{ padding: 10, flex: 1 }}>
            <ResolveImage
              key={currentMushaf.name + "_" + reversedPageIndex}
              remotePath={remotePath}
              localPath={localPath}
              page={reversedPageIndex}
              ayat={currentMushaf.getAyatShadows()}
            />
          </View>
        )
      } else {
        // TODO : show a placeholder
        return (
          <View key={"p_" + reversedPageIndex} style={$pagePlaceholder}>
            <Image
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
              style={{ height: 200 }}
            />
          </View>
        )
      }
    },
    [currentMushaf.name, currentPageIndex],
  )

  const pages = useMemo(
    () => Array.from({ length: Masahif[selectedMushaf].pages }, (_, i) => renderPage(i - 1)),
    [Masahif[selectedMushaf].pages, renderPage],
  )

  const onPageSelected = (event: any) => {
    setCurrentPageIndex(event.nativeEvent.position)
    setCurrentPosition(0)
    setSelectedPage(Masahif[selectedMushaf].pages - event.nativeEvent.position)
    if (ignorePageSelected) {
      clearTimeout(timeoutId!)
    }
    setIgnorePageSelected(true)
    setTimeoutId(
      setTimeout(() => {
        setIgnorePageSelected(false)
      }, 500),
    )
  }

  if (Masahif[selectedMushaf].pages - selectedPage < 0) return
  return (
    <View style={$container}>
      <PagerView
        key={selectedMushaf}
        ref={pagerRef}
        style={$pagerView}
        onPageSelected={onPageSelected}
        offscreenPageLimit={3}
        layoutDirection="ltr"
        initialPage={Masahif[selectedMushaf].pages - selectedPage}
      >
        {pages}
      </PagerView>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
}
const $pagerView: ViewStyle = {
  flex: 1,
}
const $pagePlaceholder: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

export default observer(PagerViewMushaf)

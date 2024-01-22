import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { SideStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { ScrollView, TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { Button, Icon, Text } from "app/components"
import { Masahif } from "assets/db/masahif/masahif"
import { colors, metrics, spacing } from "app/theme"
import { useSideHeader } from "app/utils/useSideHeader"
import { translate } from "app/i18n"
import { equivalentVerse } from "app/quran-helpers/quranCountingData"
import { Quran } from "app/quran-helpers/quranData"
import { closeDrawer } from "app/navigators/navigationUtilities"
import { logAnalyticsEvent } from "app/utils/handleAnalytics"

interface MasahifScreenProps extends SideStackScreenProps<"Masahif"> {}

export const MasahifScreen: FC<MasahifScreenProps> = observer(function MasahifScreen(_props) {
  useSideHeader({ titleTx: "menus.masahif" })

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const {
    mushafStore: { selectedMushaf },
  } = useStores()
  const [selected, setSelected] = useState(null)
  const [notSelected, setNotSelected] = useState([])

  useEffect(() => {
    const currentMushaf =
      _props.route.params?.selection === false
        ? null
        : Object.values(Masahif)
            .filter((m) => m.enabled)
            .find((m) => m.name === selectedMushaf)

    const notSelectedMushafs = Object.values(Masahif).filter(
      (m) => m.enabled && (_props.route.params?.selection === false || m.name !== selectedMushaf),
    )

    setSelected(currentMushaf)
    setNotSelected(notSelectedMushafs)
  }, [selectedMushaf])

  return (
    <ScrollView style={$root}>
      <View style={[$container, $containerInsets]}>
        {selected && (
          <>
            <Text
              size="sm"
              weight="medium"
              tx={`masahif.selectedMushaf`}
              style={{ textAlign: "left", color: colors.textPrimary, marginBottom: spacing.md }}
            ></Text>
            <RenderMushaf mushaf={selected} selected={true} key={selected.name} />
          </>
        )}
        <Text
          size="sm"
          weight="medium"
          tx={`masahif.otherMushaf`}
          style={{ textAlign: "left", color: colors.textPrimary, marginBottom: spacing.md }}
        ></Text>
        <View style={{ flex: 1 }}>
          {notSelected.map((item, index) => (
            <RenderMushaf mushaf={item} key={item.name} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
})

const RenderMushaf = observer(({ mushaf, selected }: any) => {
  const {
    mushafStore: {
      selectedMushaf,
      setSelectedMushaf,
      setSelectedVerse,
      selectedVerse,
      setSelectedPage,
      selectedPage,
    },
    downloadStore: { getDownload, addDownload, downloads },
  } = useStores()

  const [download, setDownload] = useState(getDownload(mushaf.id))

  useEffect(() => {
    if (!download) {
      setDownload(getDownload(mushaf.id))
    }
  }, [downloads.length])

  const handlePressMushaf = () => {
    let newPage =
      Quran.getPageByVerse(selectedVerse, selectedMushaf) === selectedPage
        ? Quran.getPageByVerse(
            equivalentVerse(selectedVerse, selectedMushaf, mushaf.name),
            mushaf.name,
          )
        : Quran.getPageByVerse(
            equivalentVerse(
              Quran.getVerseNoByPage(selectedPage, selectedMushaf),
              selectedMushaf,
              mushaf.name,
            ),
            mushaf.name,
          )

    // if selectedPage is an offset, set newPage to 1
    // TODO : handle extraPages at the end of the Mushaf
    if (selectedPage < Masahif[selectedMushaf].extraStartPages) {
      newPage = 1
    }

    // convert seletedVerse to the equivalent in new Mushaf
    setSelectedVerse(equivalentVerse(selectedVerse, selectedMushaf, mushaf.name))
    // convert seletedPage to the equivalent in new Mushaf after render (to make sure setSelectedMushaf is called first)
    setTimeout(() => {
      setSelectedPage(newPage)
    })
    setSelectedMushaf(mushaf.name)
    logAnalyticsEvent("mushaf_selection", { mushaf: mushaf.name })

    closeDrawer()
  }

  return (
    <TouchableOpacity
      style={[$card, selected ? $cardActive : $shadow]}
      disabled={selected}
      onPress={handlePressMushaf}
    >
      <View style={{ gap: spacing.xxs }}>
        <Text
          size="lg"
          weight="bold"
          tx={`masahif.${mushaf.name}.name`}
          style={{ textAlign: "left", color: colors.textBrandSecondary }}
        />
        <Text
          size="sm"
          tx={`masahif.${mushaf.name}.riwaya`}
          style={{ textAlign: "left", color: colors.textPrimary }}
        />
        <Text
          size="sm"
          tx={`masahif.${mushaf.name}.edition`}
          style={{ textAlign: "left", color: colors.textPrimary }}
        />
      </View>

      <View style={$mushafDownloadStatus}>
        <Text
          size="sm"
          text={translate("quran.numberOfPages", { pages: mushaf.pages })}
          style={{ textAlign: "left", color: colors.textPrimary }}
        ></Text>
        {(download?.status === "pending" || download?.status === "done") && (
          <Text
            style={{ textAlign: "left", color: colors.textBrand }}
            text={
              download?.status === "pending"
                ? translate("masahif.downloadPending", { progress: download.progressHuman })
                : translate("masahif.downloadDone")
            }
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: spacing.xs,
          flexWrap: "wrap",
        }}
      >
        {!selected && (
          <Button
            preset={"filled"}
            textStyle={{ color: colors.white, fontSize: 12 }}
            tx={
              download?.status === "done" || download?.status === "pending"
                ? "masahif.browse"
                : "masahif.browseWithoutDownlod"
            }
            onPress={handlePressMushaf}
            style={[
              {
                minHeight: 0,
                borderRadius: metrics.roundedMedium,
                paddingHorizontal: 8,
                paddingVertical: 4,
              },
            ]}
          />
        )}
        {download?.status !== "done" && (
          <Button
            preset={"outline"}
            tx={download?.status === "pending" ? "masahif.downloadCancel" : "masahif.downloadStart"}
            textStyle={{
              color: download?.status === "pending" ? colors.textPrimary : colors.textBrand,
            }}
            onPress={() => {
              if (!download) {
                addDownload({ id: mushaf.id, type: "mushaf" })
              } else if (download.status === "pending") {
                download.cancel()
              } else {
                download.start()
              }
            }}
            LeftAccessory={
              download?.status === "pending"
                ? () => <Icon size={14} color={colors.textPrimary} icon={"close"} />
                : () => <Icon size={14} color={colors.textBrand} icon={"download"} />
            }
            style={[
              { minHeight: 0, borderRadius: metrics.roundedMedium },
              download?.status === "pending"
                ? {
                    borderColor: colors.textPrimary,
                    borderWidth: 1,
                  }
                : {},
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.surfaceSecondary,
}

const $container: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
}

const $card: ViewStyle = {
  borderColor: colors.transparent,
  borderWidth: 2,
  paddingHorizontal: spacing.md - spacing.xxxs,
  paddingVertical: spacing.xs,
  borderRadius: metrics.roundedMedium,
  marginBottom: spacing.md,
  backgroundColor: colors.white,
  gap: spacing.xxs,
}

const $cardActive: ViewStyle = {
  borderColor: colors.surfaceBrand,
}

const $shadow: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
  elevation: 2,
}

const $mushafDownloadStatus: ViewStyle = {
  flexDirection: "row",
  gap: spacing.xxs,
  overflow: "hidden",
  flexWrap: "wrap",
}

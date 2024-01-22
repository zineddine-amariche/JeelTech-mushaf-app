import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { SideStackScreenProps } from "app/navigators"
import { colors, metrics, spacing } from "app/theme"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { useSideHeader } from "app/utils/useSideHeader"
import { Button, Text } from "app/components"
import { useStores } from "app/models"
import { BookType } from "assets/db/BooksType"
import { TxKeyPath } from "app/i18n"
import { useNavigation } from "@react-navigation/native"
import { sideNavigate } from "app/navigators/navigationUtilities"
import { Tafaseer } from "assets/db/tafaseer/tafaseer"
import { Tarajim } from "assets/db/tarajim/tarajim"
import { logAnalyticsEvent } from "app/utils/handleAnalytics"

interface BooksScreenProps extends NativeStackScreenProps<SideStackScreenProps<"Books">> {}

export const BooksScreen: FC<BooksScreenProps> = observer(function Books({ route }) {
  const { type } = route.params
  const navigation = useNavigation()

  const [selectedBook, setSelectedBook] = useState<BookType | undefined>(null)
  const [books, setBooks] = useState<BookType[] | undefined>(null)

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  const {
    mushafStore: { selectedTafseer, selectedTarjama },
  } = useStores()

  useSideHeader({
    titleTx: `menus.${type}`,
    ...(!((!selectedTafseer && type === "tafaseer") || (!selectedTarjama && type === "tarajim"))
      ? {
          onBackPress: () => {
            navigation.goBack()
          },
          icon: "up",
        }
      : {}),
  })

  useEffect(() => {
    let currentBook, notSelectedBook
    if (type === "tafaseer") {
      currentBook = Object.values(Tafaseer)
        .filter((m) => m.enabled)
        .find((m) => m.id === selectedTafseer)

      notSelectedBook = Object.values(Tafaseer).filter((m) => m.enabled && m.id !== selectedTafseer)
    } else {
      currentBook = Object.values(Tarajim)
        .filter((m) => m.enabled)
        .find((m) => m.id === selectedTarjama)

      notSelectedBook = Object.values(Tarajim).filter((m) => m.enabled && m.id !== selectedTarjama)
    }

    setSelectedBook(currentBook)
    setBooks(notSelectedBook)
  }, [selectedTafseer, selectedTarjama])

  return (
    <ScrollView style={$root}>
      <View style={[$container, $containerInsets]}>
        {selectedBook && (
          <>
            <Text
              size="sm"
              weight="medium"
              tx={`${type}.selectedBook`}
              style={{ textAlign: "left", color: colors.textPrimary, paddingBottom: spacing.xs }}
            ></Text>
            <RenderCard selected={true} type={type} book={selectedBook} key={selectedBook?.id} />
          </>
        )}
        <Text
          size="sm"
          weight="medium"
          tx={`${type}.otherBooks`}
          style={{ textAlign: "left", color: colors.textPrimary, paddingBottom: spacing.xs }}
        ></Text>
        <View style={{ flex: 1 }}>
          {books?.map((item) => (
            <RenderCard selected={false} type={type} book={item} key={item.id} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
})

const RenderCard = observer(({ type, book, selected }: any) => {
  const {
    downloadStore: { getDownload, downloads },
  } = useStores()

  const {
    mushafStore: { setSelectedTafseer, setSelectedTarjama },
  } = useStores()

  const [download, setDownload] = useState(getDownload(book.id))
  useEffect(() => {
    if (!download) {
      setDownload(getDownload(book.id))
    }
  }, [downloads.length])

  const handlePress = () => {
    if (type === "tafaseer") {
      setSelectedTafseer(book.id)
      logAnalyticsEvent("tafseer_selection", { tafseer: book.id, screen: "tafaseer_list" })
    } else {
      setSelectedTarjama(book.id)
      logAnalyticsEvent("tarjama_selection", { tarjama: book.id, screen: "tarajim_list" })
    }
    sideNavigate(type === "tafaseer" ? "TafaseerDetails" : "TarajimDetails")
  }

  return (
    <TouchableOpacity style={[$card, selected ? $cardActive : $shadow]} onPress={handlePress}>
      <Text
        size="lg"
        weight="bold"
        tx={`${type}.${book.id}.name` as TxKeyPath}
        style={{ textAlign: "left", color: colors.textBrandSecondary }}
      />
      <Text
        size="sm"
        tx={`${type}.${book.id}.author` as TxKeyPath}
        style={{ textAlign: "left", color: colors.textPrimary }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: selected ? "flex-end" : "space-between",
          paddingVertical: 4,
        }}
      >
        {!selected && (
          <Button
            onPress={handlePress}
            preset={"filled"}
            textStyle={{ color: colors.white, fontSize: 12 }}
            tx={`${type}.select`}
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
        {/*
        <Button
          preset={"outline"}
          tx={download?.status === "pending" ? "masahif.downloadCancel" : "masahif.downloadStart"}
          textStyle={{
            color: download?.status === "pending" ? colors.textPrimary : colors.borderBrand,
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
        /> */}
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

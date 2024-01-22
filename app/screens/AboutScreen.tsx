import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { SideStackScreenProps } from "app/navigators"
import { ScrollView, View, ViewStyle } from "react-native"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { Text } from "app/components"
import { colors, spacing } from "app/theme"
import { useSideHeader } from "app/utils/useSideHeader"
import { isRTL } from "app/i18n"
import BulletedList from "app/components/BulletedList"

const wizaraMembers = [
  {
    ar: "الأستاذ محمد بن محمد",
    latin: "Mohamed bin mohamed",
  },
]

const devMembers = [
  {
    ar: "الدكتور محمد علي مناصر",
    latin: "DR. Mohamed Ali Menacer",
  },
  {
    ar: "المهندس إسحاق عمري",
    latin: "Ishak Amri",
  },
  {
    ar: "المهندس نبيل بورزان",
    latin: "Nabil Bourzane",
  },
  {
    ar: "الدكتور عمار عرباوي",
    latin: "DR. Ammar Arabaoui",
  },
  {
    ar: "مهدي هشام",
    latin: "Mahdi Hichem",
  },
  {
    ar: "عثمان قادري",
    latin: "Othmane Kaderi",
  },
]

interface AboutScreenProps extends SideStackScreenProps<"About"> {}

export const AboutScreen: FC<AboutScreenProps> = observer(function AboutScreen(_props) {
  useSideHeader({ titleTx: "menus.about" })

  const $containerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <ScrollView
      style={$root}
      contentContainerStyle={{
        gap: spacing.md,
        padding: spacing.md,
        paddingBottom: spacing.md + $containerInsets.paddingBottom,
      }}
    >
      <Text tx={"about.word"} size="md" weight="light" />
      <View>
        <Text weight="semiBold" tx={"about.wizaraStaff"} size="md" />
        <BulletedList
          items={wizaraMembers.map((member) => (isRTL ? member.ar : member.latin))}
          size="md"
          weight="light"
        ></BulletedList>
      </View>
      <View>
        <Text weight="semiBold" tx={"about.developementTeam"} size="md" />
        <BulletedList
          items={devMembers.map((member) => (isRTL ? member.ar : member.latin))}
          size="md"
          weight="light"
        ></BulletedList>
      </View>
    </ScrollView>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.surfaceSecondary,
}

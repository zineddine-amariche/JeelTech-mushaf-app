import React from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components"

interface UnderConstructionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"UnderConstruction">> {}

export const UnderConstructionScreen: FC<UnderConstructionScreenProps> = observer(
  function UnderConstructionScreen() {
    return (
      <View style={{ flex: 1, padding: 20, gap: 12 }}>
        <View>
          <Text tx="common.underConstruction" />
        </View>
      </View>
    )
  },
)

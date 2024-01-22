import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import { colors } from "app/theme"
import { subNavigationRef } from "./navigationUtilities"

export type SideStackParamList = {
  Menu: undefined
  Index: undefined
  Search: undefined
  Masahif: {
    selection?: boolean
  }
  Reciters: {
    shouldPlayAfterSelection?: boolean
  }
  Books: {
    type: "tafaseer" | "tarajim"
  }
  BookDetails: {
    type: "tafaseer" | "tarajim"
  }
  Tafaseer: undefined
  Tarajim: undefined
  TafaseerDetails: undefined
  TarajimDetails: undefined
  Bookmarks: undefined
  Favorites: {
    editVerse?: number
  }
  UnderConstruction: undefined
  Languages: undefined
  About: undefined
}

export type SideStackScreenProps<T extends keyof SideStackParamList> = NativeStackScreenProps<
  SideStackParamList,
  T
>

const Stack = createNativeStackNavigator<SideStackParamList>()

interface SideNavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const SideNavigator = observer(function SideNavigator(props: SideNavigationProps) {
  const colorScheme = useColorScheme()

  return (
    <NavigationContainer
      ref={subNavigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          navigationBarColor: colors.transparent,
          animation: "none",
        }}
        initialRouteName={"Menu"}
      >
        <Stack.Screen name="Menu" component={Screens.MenuScreen} />
        <Stack.Screen name="Index" component={Screens.IndexScreen} />
        <Stack.Screen name="Search" component={Screens.SearchScreen} />
        <Stack.Screen name="Masahif" component={Screens.MasahifScreen} />
        <Stack.Screen name="Reciters" component={Screens.RecitersScreen} />
        <Stack.Screen
          name="Tafaseer"
          component={Screens.BooksScreen}
          initialParams={{ type: "tafaseer" }}
        />
        <Stack.Screen
          name="Tarajim"
          component={Screens.BooksScreen}
          initialParams={{ type: "tarajim" }}
        />
        <Stack.Screen
          name="TafaseerDetails"
          component={Screens.BookDetailsScreen}
          initialParams={{ type: "tafaseer" }}
        />
        <Stack.Screen
          name="TarajimDetails"
          component={Screens.BookDetailsScreen}
          initialParams={{ type: "tarajim" }}
        />
        <Stack.Screen name="Bookmarks" component={Screens.BookmarksScreen} />
        <Stack.Screen name="Favorites" component={Screens.FavoritesScreen} />
        <Stack.Screen name="Languages" component={Screens.LanguagesScreen} />
        <Stack.Screen name="About" component={Screens.AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
})

import { Share } from "react-native"

export const shareText = async (text: string) => {
  try {
    await Share.share({
      message: text,
    })
  } catch (error) {
    console.error("Error sharing:", error)
  }
}

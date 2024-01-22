import analytics from "@react-native-firebase/analytics"

type EventData = {
  [key: string]: string | number | boolean | string[] | undefined
}

export const logAnalyticsEvent = async (
  eventName: string,
  eventData?: EventData,
): Promise<void> => {
  try {
    await analytics().logEvent(eventName, eventData)
    console.log(`Analytics event "${eventName}" logged successfully.`, JSON.stringify(eventData))
  } catch (error) {
    console.error(
      `Error logging analytics event "${eventName}":`,
      JSON.stringify({ eventData, error }),
    )
  }
}

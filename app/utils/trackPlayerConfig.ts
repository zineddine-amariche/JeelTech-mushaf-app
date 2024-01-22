import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
} from "react-native-track-player"
import { formatNumberWithLeadingZeros } from "./conversions"
import { Quran } from "app/quran-helpers/quranData"
import { getLocale, translate } from "app/i18n"

const options = {
  android: {
    appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
  },
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.Stop,
  ],
  compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
  compactViewEnabled: true,
}

export async function setupPlayer() {
  try {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.updateOptions(options)
  } catch (error) {
    console.error(error)
  }
}

export async function addTracks(tracks: any) {
  // Check if the tracks parameter is an array
  if (!Array.isArray(tracks)) {
    console.error("Invalid tracks format. Expecting an array of track objects.")
    return
  }

  // Add the tracks to the player
  await TrackPlayer.add(tracks)

  // Set the repeat mode to Queue
  await TrackPlayer.setRepeatMode(RepeatMode.Queue)
}

export const generateSuwarTracks = (reciter, selectedMushaf) => {
  return Quran.getSuwarDetails(selectedMushaf).map((surah) => {
    const title = translate("quran.surah", {
      surah: surah.name?.[getLocale()] ?? surah.name.ar,
    })
    const subTitle = translate("quran.surahDetail", {
      type: surah.type,
      count: surah.ayahs,
      number: surah.number,
    })
    return {
      id: `${surah.number}`,
      url: `${reciter.url}/${formatNumberWithLeadingZeros(surah.number, 3)}.${reciter.ext}`,
      title,
      artist:
        translate(`reciters.${reciter.id}.name`) +
        " (" +
        translate(`reciters.${reciter.id}.riwayaShort`) +
        ")",
      progressBarEnabled: false,
      surah: surah.number,
      reciter: reciter.id,
    }
  })
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause()
  })

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext()
  })

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious()
  })
}

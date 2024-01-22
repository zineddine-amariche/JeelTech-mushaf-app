import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  useActiveTrack,
} from "react-native-track-player"
import { Quran, QuranDataType } from "app/quran-helpers/quranData"
import { createContext, useContext, useEffect, useState } from "react"
import { useStores } from "app/models"
import { equivalentVerses } from "app/quran-helpers/quranCountingData"
import { generateSuwarTracks } from "./trackPlayerConfig"
import { observer } from "mobx-react-lite"
import { sideNavigate } from "app/navigators/navigationUtilities"

// Fix annotation to make the start always from 0 and the end always to the next ayah's start
const fixAnnotation = (audioAnnotations: QuranDataType) => {
  const newAnnotations: QuranDataType = {}
  Object.keys(audioAnnotations).forEach((surah) => {
    newAnnotations[surah] = audioAnnotations[surah].map((annotation, i, arr) => {
      return {
        ...annotation,
        start: Number(i === 0 ? 0 : annotation.start.toFixed(2)),
        end: Number(arr[i + 1]?.start.toFixed(2) ?? annotation.end.toFixed(2)),
      }
    })
  })
  return newAnnotations
}

type AudioContextType = {
  play: () => Promise<void>
  pause: () => Promise<void>
  previousTrack: () => Promise<void>
  nextTrack: () => Promise<void>
  isPlaying: boolean
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const useAudioContext = () => {
  const audio = useContext(AudioContext)
  if (!audio) {
    throw new Error("useAudioContext must be used within AudioProvider")
  }
  return audio
}

export const AudioProvider = observer((props: any) => {
  const {
    mushafStore: {
      selectedMushaf,
      selectedSurah,
      selectedVerse,
      setSelectedVerses,
      selectedReciterDetails,
    },
  } = useStores()
  // selectedReciterDetails.mushaf Used to convert the ayah of selected mushaf to the correct ayah in the recitation

  // Player state used to know if the player is playing or not
  const playerState = usePlaybackState()
  const [audioAnnotations, setAudioAnnotations] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(playerState.state === State.Playing)
  // Position used to know the current progress
  const { position } = useProgress(0)
  // Active track used to know the current track to extract the current playing surah
  const activeTrack = useActiveTrack()
  // Current playing ayah used to know if we should skip to the next ayah or not
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number>()
  // Used to know if we are seeking to a new position or not; used to prevent triggering useEffect on position when the correct state is not yet updated
  const [seekingToPosition, setSeekingToPosition] = useState(0)
  // Used to know if we are skipping to a new surah or not; used to prevent triggering useEffect on position when the correct state is not yet updated
  const [skippingToSurah, setSkippingToSurah] = useState(0)
  const [shouldPlayAfterInit, setShouldPlayAfterInit] = useState(false)

  // Initialize the player with the surahs if the queue is empty

  const initializePlayer = async () => {
    if (!selectedReciterDetails) return
    const isPlayingTmp = isPlaying
    const queue = await TrackPlayer.getQueue()
    if (queue.length <= 0 || queue[0].reciter !== selectedReciterDetails.name) {
      await TrackPlayer.reset()
      await TrackPlayer.add(generateSuwarTracks(selectedReciterDetails, selectedMushaf))
      setAudioAnnotations(fixAnnotation(selectedReciterDetails.getAudioAnnotations()))
      if (isPlayingTmp) {
        play()
      }
    }
  }

  useEffect(() => {
    initializePlayer()
  }, [selectedReciterDetails])

  // Player state used to know if the player is playing or not
  useEffect(() => {
    setIsPlaying(playerState.state === State.Playing)
  }, [playerState])

  // When the selected mushaf or verse changes, we should skip to the correct ayah depending on the recitation
  useEffect(() => {
    if (!selectedReciterDetails) return
    const eqVerses = equivalentVerses(selectedVerse, selectedMushaf, selectedReciterDetails.mushaf)
    const convertedAyatTmp = eqVerses.map(
      (v) => Quran.getDupletByVerseNo(v, selectedReciterDetails.mushaf).ayah,
    )

    const surah = selectedSurah
    const ayah = convertedAyatTmp[0]

    // Make sure that either surah or ayah changed to skip or seek
    if (
      audioAnnotations !== null &&
      (ayah !== currentPlayingAyah || surah !== activeTrack?.surah)
    ) {
      skipAndSeek(
        surah,
        Number(
          audioAnnotations?.[`${surah}`]
            .find((annotationAyah) => annotationAyah.aya === ayah)
            ?.start.toFixed(2),
        ),
      )
    }
    if (shouldPlayAfterInit) {
      play()
      setShouldPlayAfterInit(false)
    }
  }, [selectedVerse, selectedMushaf, audioAnnotations])

  // When the active track changes, we should prepare the state of a skippingToSurah to make position trigger the useEffect
  useEffect(() => {
    if (!activeTrack || !selectedReciterDetails) return
    if (activeTrack.surah !== skippingToSurah) {
      setSeekingToPosition(0)
      setSkippingToSurah(activeTrack.surah)

      // If the player is not playing, we should set the selected verses and current playing ayah manually because position will not trigger the useEffect
      if (!isPlaying) {
        setSelectedVerses(
          equivalentVerses(
            Quran.getVerseNoByDuplet(activeTrack.surah, 1, selectedReciterDetails.mushaf),
            selectedReciterDetails.mushaf,
            selectedMushaf,
          ),
        )
        setCurrentPlayingAyah(1)
      }
    }
  }, [activeTrack?.surah])

  // When the position changes, we should update the selected verses and current playing ayah
  useEffect(() => {
    // Exit if :
    // the player is not playing
    // or the position is 0 (the player is just starting)
    // or the difference between the position and the seekingToPosition is less than 0.5 (the player is seeking and it may land on slightly different position)
    // or the skippingToSurah is not the same as the activeTrack surah (the player is skipping and the position is not yet updated)
    if (
      !selectedReciterDetails ||
      !activeTrack ||
      !isPlaying ||
      position === 0 ||
      (seekingToPosition - position < 0.5 && seekingToPosition - position > 0) ||
      skippingToSurah !== activeTrack.surah
    ) {
      return
    }
    const positionAyah = getPositionAyah(position, activeTrack?.surah)
    if (
      positionAyah !== undefined &&
      (positionAyah !== currentPlayingAyah || activeTrack.surah !== selectedSurah)
    ) {
      // Convert the playing verse to the correct verse in the selected mushaf
      setSelectedVerses(
        equivalentVerses(
          Quran.getVerseNoByDuplet(activeTrack.surah, positionAyah, selectedReciterDetails.mushaf),
          selectedReciterDetails.mushaf,
          selectedMushaf,
        ),
      )
      setCurrentPlayingAyah(positionAyah)
    }
  }, [position, activeTrack])

  // Helper to Skip and seek to the new position
  const skipAndSeek = async (surah: number, position: number) => {
    // Used to prevent triggering useEffect on position when the correct state is not yet updated
    setSeekingToPosition(position)
    setSkippingToSurah(surah)
    try {
      const currentSurah = activeTrack?.surah

      if (surah !== currentSurah) {
        TrackPlayer.getPlaybackState().then(async ({ state }) => {
          // The state is used to know if we should pause then play after
          if (state === State.Playing) {
            await TrackPlayer.pause()
          }
          await TrackPlayer.skip(surah - 1, position)
          if (state === State.Playing) {
            await play()
          }
        })
      } else {
        await TrackPlayer.seekTo(position)
      }
    } catch (error) {
      console.error("Track player error", error)
    }
  }

  // Helper to get the current playing ayah based on the position
  const getPositionAyah = (positionMillis: number, surah) => {
    const positionAyah = audioAnnotations?.[`${surah}`]?.find(
      (ayahAnnotation) =>
        positionMillis * 1000 >= Number(ayahAnnotation.start.toFixed(2)) * 1000 &&
        positionMillis * 1000 < Number(ayahAnnotation.end.toFixed(2)) * 1000,
    )
    return positionAyah?.aya
  }

  const play = async () => {
    if (!selectedReciterDetails) {
      sideNavigate("Reciters", { shouldPlayAfterSelection: true })
    } else {
      TrackPlayer.play()
    }
  }
  const pause = async () => {
    TrackPlayer.pause()
  }
  const previousTrack = async () => {
    TrackPlayer.skipToPrevious()
  }
  const nextTrack = async () => {
    TrackPlayer.skipToNext()
  }

  const value = {
    play,
    pause,
    previousTrack,
    nextTrack,
    isPlaying,
  }

  return <AudioContext.Provider value={value}>{props.children}</AudioContext.Provider>
})

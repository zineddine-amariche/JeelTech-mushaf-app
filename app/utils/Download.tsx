import { FC, useEffect, useState } from "react"
import { downloadSaveFile } from "./fs"
import { Platform } from "react-native"
import { useStores } from "app/models"
import notifee from "@notifee/react-native"

interface DownloadFile {
  fromUrl: string
  toFile: string
}

interface DownloadArgs {
  id: string
  seriesId: string
  seriesName: string
  title: string
  canceledText: string
  finishedText: string
  files: DownloadFile[]
  progressCallback?: (progress: { max: number; current: number }) => void
}

export const Download: FC = function Download({ args }) {
  const {
    downloadStore: { getDownload },
  } = useStores()
  const [currentDownload, setCurrentDownload] = useState(getDownload(args.id))
  const [current, setCurrent] = useState(0)
  const [failed, setFailed] = useState([])
  const [channelId, setChannelId] = useState<string | null>(null)

  const done = () => {
    if (failed.length > 0 || current < args.files.length) {
      notify(channelId, args.seriesId, args.canceledText)
      currentDownload?.cancel()
    } else {
      notify(channelId, args.seriesId, args.finishedText)
      currentDownload?.finish()
    }
  }

  useEffect(() => {
    if (Platform.OS === "android" && !channelId) return
    currentDownload?.setProgress(current)
    notify(channelId, args.seriesId, args.title, `${current + 1} / ${args.files.length}`, {
      max: args.files.length,
      current,
    })
    if (current >= args.files.length) {
      done()
      return
    }
    downloadSaveFile(args.files[current].fromUrl, args.files[current].toFile)
      .catch((e: any) => {
        setFailed([...failed, args.files[current]])
      })
      .finally(() => {
        setCurrent((current) => current + 1)
      })
  }, [current, channelId])

  useEffect(() => {
    if (Platform.OS === "android") {
      notifee
        .createChannel({
          id: args.seriesId,
          name: args.seriesName,
        })
        .then((channelId: string) => {
          setChannelId(channelId)
        })
    }
    currentDownload?.setTotal(args.files.length)
    // Anything in here is fired on component mount.
    return () => {
      done()
    }
  }, [])
}

const notify = async (
  channelId: string | null,
  notificationId: string,
  title: string,
  body?: string,
  progress?: { max: number; current: number },
) => {
  // Display a notification
  if (progress) {
    await notifee.displayNotification({
      id: notificationId,
      title,
      body,
      android: {
        channelId: channelId ?? "default",
        pressAction: {
          id: "default",
        },
        progress,
        onlyAlertOnce: true,
      },
    })
  } else {
    await notifee.cancelNotification(notificationId)

    await notifee.displayNotification({
      id: notificationId,
      title,
      body,
      android: {
        channelId: channelId ?? "default",
      },
    })
  }
}

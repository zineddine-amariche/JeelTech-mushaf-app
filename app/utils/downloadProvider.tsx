import { useStores } from "app/models"
import React, { createContext, useContext, useEffect, useState } from "react"
import { translate } from "app/i18n"
import { observer } from "mobx-react-lite"
import { Masahif } from "assets/db/masahif/masahif"
import { Download } from "./Download"
import { generateMushafFilesArray } from "./downloadUtils"

const DownloadContext = createContext(undefined)

export const useDownloadContext = () => useContext(DownloadContext)

export const DownloadProvider = observer(({ children }) => {
  const {
    downloadStore: { pendingDownloads },
  } = useStores()

  const [downloads, setDownloads] = useState([])

  const addDownload = (args) => {
    setDownloads((prevDownloads) => [...prevDownloads, args])
  }

  useEffect(() => {
    if (
      downloads.length &&
      (pendingDownloads.length === 0 ||
        pendingDownloads.find((p) => p.id === downloads[0]?.id) === undefined)
    ) {
      setDownloads((prevDownloads) => {
        return prevDownloads.filter((d) => d.id !== downloads[0]?.id)
      })
    }
    if (pendingDownloads.length > 0 && downloads.length === 0) {
      const download = pendingDownloads[0]

      if (download.type === "mushaf") {
        downloadMushaf(download.id)
      } else if (download.type === "audio") {
        /* downloadAudio(download).then(()=>{
                  resumeDownload()
              }) */
      }
    }
  }, [pendingDownloads.length, downloads.length])

  const downloadMushaf = async (mushafId) => {
    const mushaf = Masahif[mushafId]
    generateMushafFilesArray(mushaf).then((mushafFilesArray) => {
      if (mushafFilesArray.length > 0) {
        addDownload({
          id: mushaf.id,
          seriesId: mushaf.name,
          seriesName: mushaf.name as string,
          title: translate("download.downloadingMushafImages", {
            mushaf: translate(`masahif.${mushaf.name}.name`),
          }),
          finishedText: translate("download.finishedDownloadingMushafImages", {
            mushaf: translate(`masahif.${mushaf.name}.name`),
          }),
          canceledText: translate("download.canceledDownloadingMushafImages", {
            mushaf: translate(`masahif.${mushaf.name}.name`),
          }),
          files: mushafFilesArray.map((f, i) => ({
            fromUrl: f.fromUrl,
            toFile: f.toFile,
          })),
          progressCallback: ({ max, current }) => {},
        })
      }
    })
  }

  const value = {}

  return (
    <DownloadContext.Provider value={value}>
      {downloads.map((d) => (
        <Download args={d} key={d.id} />
      ))}

      {children}
    </DownloadContext.Provider>
  )
})

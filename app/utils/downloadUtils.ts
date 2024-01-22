import { downloadSaveFile, fileExists, getFilesFromDir, getLibraryPath } from "./fs"

interface DownloadFile {
  fromUrl: string
  toFile: string
}

interface DownloadArgs {
  seriesId: string
  seriesName: string
  title: string
  canceledText: string
  finishedText: string
  files: DownloadFile[]
  progressCallback?: (progress: { max: number; current: number }) => void
}

interface Mushaf {
  name: string
  ext: string
  url: string
  local: string
  pages: number
}

export const generateMushafFilesArray = async (mushaf: Mushaf): Promise<DownloadFile[]> => {
  return new Promise((resolve, reject) => {
    const dirName = getLibraryPath() + mushaf.local + "/"
    getFilesFromDir(dirName)
      .then((files) => {
        const arr = Array.from(Array(mushaf.pages).keys())
          .map((_, i) => {
            const fileName = i + 1 + "." + mushaf.ext
            return !files.includes(dirName + fileName)
              ? {
                  id: mushaf.name + "_" + (i + 1),
                  fromUrl: mushaf.url + "/" + fileName,
                  toFile: dirName + fileName,
                }
              : null
          })
          .filter((e: DownloadFile | null): e is DownloadFile => e !== null)

        resolve(arr as DownloadFile[])
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const getFileOrDownload = async (remotePath: string, localPath: string) => {
  const fullLocalPath = getLibraryPath() + localPath
  if (!(await fileExists(fullLocalPath))) {
    await downloadSaveFile(remotePath, fullLocalPath)
  }

  return "file://" + fullLocalPath
}

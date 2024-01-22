import { delay } from "./delay"

const { Platform } = require("react-native")
const RNFS = require("react-native-fs")

let downloading = []
// TODO : Refactor /DZMushaf/
const getLibraryPath = () => {
  return Platform.OS === "ios"
    ? RNFS.LibraryDirectoryPath + "/DZMushaf/"
    : RNFS.ExternalDirectoryPath + "/DZMushaf/"
}

// TODO : Refactor /DZMushaf/
const getDocumentPath = () => {
  return RNFS.DocumentDirectoryPath + "/DZMushaf/"
}

const getCachesPath = () => {
  return RNFS.CachesDirectoryPath
}

const fileExists = async (path) => {
  // checks if file/dir exists returns true/false
  try {
    const response = await RNFS.exists(path)
    return response
  } catch (e) {
    return false
  }
}

const unlinkFile = async (path) => {
  // checks if file/dir exists returns true/false
  try {
    const response = await RNFS.unlink(path)
    return response
  } catch (e) {
    return false
  }
}

const getFilesFromDir = async (rootPath: string, onlyFiles?: boolean, extensionFilter?: string) => {
  //  get a list of files and directories in whatever directory u like
  try {
    const response = await RNFS.readDir(rootPath)
    if (onlyFiles) {
      // filter by extension and if its a file
      return response.filter(
        (item: { isFile: () => any; path: string }) =>
          item.isFile() && (extensionFilter ? item.path.endsWith(extensionFilter) : true),
      )
    } else {
      return response
    }
  } catch (e) {
    console.error(e, "I couldnt getFilesFromDir() whoops")
    return []
  }
}

const createDir = async (dir) => {
  // create dir(note this takes the whole path to the directory not just its name)
  // if u want to save something in a certain folder, u first have to create it
  try {
    await RNFS.mkdir(dir)
    return true
  } catch (e) {
    console.error(e, "Whoops, createDir failed and returned false")
    return false
  }
}

const checkCreateDir = async (dirPath) => {
  // check to see if a dir exists if it doesnt it creates it
  // assumes you  sent the path with the file included
  // dirPath => /data/user/0/com.hello/files/hello/world/file.ext
  // remove file name
  let dirExcludeFile = dirPath.substring(0, dirPath.lastIndexOf("/"))
  try {
    // check if dir exists
    const exists = await fileExists(dirExcludeFile)
    // return true if dir already exists
    if (exists) {
      return true
    }
    // else create the dir and return
    else {
      const created = await createDir(dirExcludeFile)
      return created
    }
  } catch (e) {
    console.error(e, "checkCreateDir failed for some reason")
  }
  return false
}

const downloadSaveFile = async (fromUrl, toFile) => {
  // fromUrl => direct link to where ur file is on the internet
  // toFile => includes both directory and file name + extension
  // returns an path on success or throws an error
  try {
    // just wait for this to do its thing(create dir if need be)
    const exists = await fileExists(toFile)
    if (exists) {
      return toFile
    }
    if (downloading.includes(toFile)) {
      throw Error("RNFS.downloadFile, file is already downloading")
    } else {
      downloading.push(toFile)
      await checkCreateDir(toFile)
      downloading = downloading.filter((e) => e !== toFile)

      const response = await RNFS.downloadFile({
        fromUrl, // URL to download file from
        toFile, // Local filesystem path to save the file to
        /* headers?: Headers // An object of headers to be passed to the server
                background?: boolean // Continue the download in the background after the app terminates (iOS only)
                discretionary?: boolean // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
                cacheable?: boolean // Whether the download can be stored in the shared NSURLCache (iOS only)
                progressInterval?: number
                progressDivider?: number
                begin?: (res: DownloadBeginCallbackResult) => void
                progress?: (res: DownloadProgressCallbackResult) => void
                resumable?: () => void // only supported on iOS yet
                connectionTimeout?: number // only supported on Android yet
                readTimeout?: number // supported on Android and iOS
                backgroundTimeout?: number // Maximum time (in milliseconds) to download an entire resource (iOS only, useful for timing out background downloads) */
      }).promise
      downloading = downloading.filter((e) => e !== toFile)
      if ((response.statusCode = 200)) {
        return toFile
      } else {
        throw Error("RNFS.downloadFile, statusCode is not 200", response)
      }
    }
  } catch (error) {
    downloading = downloading.filter((e) => e !== toFile)
    throw Error("RNFS.downloadFile failed ", error)
  }
}

export {
  getLibraryPath,
  getCachesPath,
  getDocumentPath,
  fileExists,
  unlinkFile,
  getFilesFromDir,
  createDir,
  checkCreateDir,
  downloadSaveFile,
}

import TrackPlayer from "react-native-track-player"
import RNRestart from "react-native-restart"

const restartApp = () => {
  setTimeout(() => {
    TrackPlayer.reset()
    if (RNRestart) {
      RNRestart.restart()
    }
  })
}

export default restartApp

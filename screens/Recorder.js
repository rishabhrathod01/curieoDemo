import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Platform,
  AppRegistry,
  PermissionsAndroid,
  Button
} from "react-native";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Sound from "react-native-sound";
import { LogLevel, RNFFmpeg } from "react-native-ffmpeg";

export default class Recorder extends Component {
  state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: AudioUtils.DocumentDirectoryPath + "/test.aac",
    hasPermission: undefined,
    trimPath: AudioUtils.DocumentDirectoryPath + "/trim.aac",
    mergePath: AudioUtils.DocumentDirectoryPath + "/merge.aac"
  };

  trimAudio = () => {
    console.log("Trim");
    let audioPath = this.state.audioPath;
    let trimPath = this.state.trimPath;
    RNFFmpeg.execute(`-y -ss 00 -to 04 -i ${audioPath} ${trimPath}`).then(
      result => console.log("FFmpeg process exited with rc " + result.rc)
    );
  };

  componentWillUnmount() {
    this.cancel();
  }
  cancel = () => {
    RNFFmpeg.cancel();
  };

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization().then(isAuthorised => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = data => {
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = data => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === "ios") {
          this._finishRecording(
            data.status === "OK",
            data.audioFileURL,
            data.audioFileSize
          );
        }
      };
    });
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn("Can't pause, not recording!");
      return;
    }

    try {
      const filePath = await AudioRecorder.pauseRecording();
      this.setState({ paused: true });
    } catch (error) {
      console.error(error);
    }
  }

  async _resume() {
    if (!this.state.paused) {
      console.warn("Can't resume, not paused!");
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({ paused: false });
    } catch (error) {
      console.error(error);
    }
  }

  async _stop() {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({ stoppedRecording: true, recording: false, paused: false });

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === "android") {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  playAudio = path => {
    setTimeout(() => {
      var sound = new Sound(path, "", error => {
        if (error) {
          console.log("failed to load the sound", error);
        }
      });

      setTimeout(() => {
        sound.play(success => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      }, 100);
    }, 100);
  };

  async _play() {
    if (this.state.recording) {
      await this._stop();
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      var sound = new Sound(this.state.audioPath, "", error => {
        if (error) {
          console.log("failed to load the sound", error);
        }
      });

      setTimeout(() => {
        sound.play(success => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      }, 100);
    }, 100);
  }

  async _record() {
    if (this.state.recording) {
      console.warn("Already recording!");
      return;
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({ recording: true, paused: false });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath, fileSize) {
    this.setState({ finished: didSucceed });
    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath} and size of ${fileSize || 0} bytes`
    );
  }

  mergeAudio = () => {
    console.log("Marger");
    let audioPath = this.state.audioPath;
    let trimPath = this.state.trimPath;
    let mergePath = this.state.mergePath;
    RNFFmpeg.execute(
      `-i ${audioPath} -i ${trimPath} -filter_complex concat=n=2:v=0:a=1 ${mergePath} `
    ).then(result => console.log("FFmpeg process exited with rc " + result.rc));
    //Result.rc = 0 => operation successful for any ffmpeg operation
  };
  render() {
    return (
      <View style={styles.container}>
        <Button
          style={styles.button}
          onPress={() => {
            !this.state.recording ? this._record() : this._stop();
          }}
          title={!this.state.recording ? "Record" : "Stop"}
        />
        <Button
          style={styles.button}
          onPress={() => this.playAudio(this.state.audioPath)}
          title="play Recorded Audio"
        />
        <Text style={{ fontSize: 16 }}>{this.state.currentTime}s</Text>
        <Button
          style={styles.button}
          onPress={() => this.playAudio(this.state.trimPath)}
          title="play Trim Audio"
        />
        <Button
          style={styles.button}
          onPress={this.trimAudio}
          title="Trim Audio"
        />
        <Button
          style={styles.button}
          onPress={() => this.playAudio(this.state.mergePath)}
          title="play Merge Audio"
        />
        <Button
          style={styles.button}
          onPress={this.mergeAudio}
          title="Merge Audio"
        />
        <Button
          style={styles.button}
          onPress={this.cancel}
          title="Cancel FFmpeg Operation"
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  button: {
    flex: 1,
    margin: 10,
    height: 40,
    borderRadius: 5,
    backgroundColor: "grey"
  },
  disabledButtonText: {
    color: "#eee"
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  }
});

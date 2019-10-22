import Prediction from "./Prediction";
import { Howl, Howler } from "howler";
import beepSoundFile from "../../assets/beep.mp3";

class VoiceFeedback {
  constructor() {
    this._synth = window.speechSynthesis;
    this.setVoice();
    this._voiceTexts = [];
    this._voiceVolumes = [];
    this._elapsedTime = 0;
    this._threshold = 0.3;
    this._synth.onvoiceschanged = this.setVoice.bind(this);
    this._beepHowler = undefined;
  }

  setVoice() {
    var voices = this.getVoices();
    console.log(voices);
    if (voices.length > 4) {
      this._voice = voices[4];
      console.log("voice is loaded");
    } else if (voices.length > 2) {
      this._voice = voices[2];
      console.log("voice is loaded");
    } else if (voices.length > 0) {
      this._voice = voices[0];
      console.log("voice is loaded");
    } else {
      console.log("voice list is not loaded");
    }
  }

  get voice() {
    return this._voice;
  }

  set voice(value) {
    this._voice = value;
  }

  getVoices() {
    return this._synth.getVoices();
  }

  _reset() {
    this._currentIndex = 0;
    this._voiceTexts = [];
    this._voiceVolumes = [];
    this._elapsedTime = 0;
  }

  _speakTexts(texts) {
    this._voiceTexts = texts.map(script => script.label);
    this._voiceVolumes = texts.map(script => script.score);
    this._playNext(undefined);
  }

  speakPredictionSets(predictionSet) {
    this._reset();
    this.setVoice();
    console.log(this);
    var vf = this;
    console.log(vf);
    var speechPromise = function (resolve, reject) {
      console.log(vf);
      if (vf._voice == undefined) {
        console.warn("voice list is not loaded");
        resolve(Error(false));
      } else {
        vf._resolve = resolve;
        vf._speakTexts(predictionSet);
      }
    };

    return new Promise(speechPromise);
  }

  playSwitch(onSwitchEnd) {
    this._speak("Switch", 1.0, onSwitchEnd)
  }

  playKeepGoing(onPlayEnd) {
    this._speak("Keep going", 1.0, onPlayEnd);
  }

  playBeep(onBeepEnd) {
    const beepHowler = new Howl({
      src: beepSoundFile
    });
    beepHowler.on("end", onBeepEnd);
    if (beepHowler.state() == "loaded") {
      beepHowler.play();
    } else {
      beepHowler.once("load", function playBeepOnLoad() {
        beepHowler.play();
      });
    }
  }

  speakPrediction(prediction) {
    const topNPredictionSet = prediction.getTopN(3);
    // threshold to cut off those <= 0.3
    // const likelyTopPredictionSet = topNPredictionSet.filter(script => script.score > this._threshold);
    const predictionSets = topNPredictionSet.map(script => {
      return {
        label: Prediction.PREDEFINED_CLASS_TEXT[script.label],
        score: script.score
      };
    });
    return this.speakPredictionSets(predictionSets);
  }

  speakInstruction(text, onInstructionEnd) {
    this._speak(text, 1.0, onInstructionEnd);
  }

  _playNext(event) {
    if (this._voiceTexts.length > 0) {
      this._elapsedTime =
        event == undefined
          ? this._elapsedTime
          : this._elapsedTime + event.elapsedTime;
      const text = this._voiceTexts.shift();
      const volume = this._voiceVolumes.shift();
      this._speak(text, volume, this._playNext.bind(this));
    } else {
      console.log(
        "Finished playing all texts, spent " +
        this._elapsedTime / 1000.0 +
        " seconds"
      );
      this._resolve(true);
    }
  }

  _speak(text, volume, onVoiceEnd) {
    console.log(text);
    const synUtterance = new SpeechSynthesisUtterance();
    synUtterance.text = text;
    synUtterance.voice = this._voice;
    synUtterance.volume = volume;
    synUtterance.rate = 0.85;
    synUtterance.addEventListener("end", onVoiceEnd);
    this._synth.speak(synUtterance);
  }
}

export default VoiceFeedback;

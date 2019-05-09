import Prediction from './Prediction';

class VoiceFeedback {
    constructor() {
        this._synth = window.speechSynthesis;
        this._voice = undefined;
    }

    get voice() {
        return this._voice;
    }

    set voice(value) {
        this._voice = value;
    }

    getVoices(lang = 'en-us') {
        return this._synth.getVoices().filter(v => v.lang == lang)
    }

    speakInstruction(instruction) {
        this.voice = this.getVoices()[0];
        this._speak(instruction);
    }

    speakPrediction(prediction, onVoiceEnd) {
        let text = "The system thinks you may be ";
        const topNPredictionSet = prediction.getTopN(3);
        console.log(topNPredictionSet);
        console.log(prediction.prediction);
        topNPredictionSet.forEach(script => {
            text += Prediction.PREDEFINED_CLASS_TEXT[script.label] + " (" + Math.round(script.score * 100) + "%) "
        });
        this.voice = this.getVoices()[2];
        this._speak(text, onVoiceEnd);
    }

    _speak(text, onVoiceEnd) {
        const synUtterance = new SpeechSynthesisUtterance();
        synUtterance.text = text;
        synUtterance.voice = this.voice;
        synUtterance.addEventListener('end', onVoiceEnd);
        this._synth.speak(synUtterance);
    }
}

export default VoiceFeedback;
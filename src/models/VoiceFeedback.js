import Prediction from './Prediction';

class VoiceFeedback {
    constructor() {
        this._synth = window.speechSynthesis;
        this._voice = undefined;
        this._voiceTexts = [];
        this._voiceVolumes = [];
        this._elapsedTime = 0;
        this._synth.onvoiceschanged = this.setVoice.bind(this);
    }

    setVoice() {
        this._voice = this.getVoices()[4];
        console.log('voice list loaded');
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

    _reset(){
        this._currentIndex = 0;
        this._voiceTexts = [];
        this._voiceVolumes = [];
        this._elapsedTime = 0;
    }

    _speakTexts(texts) {
        this._voice = this.getVoices()[4];
        this._voiceTexts = texts.map(script => script.label);
        this._voiceVolumes = texts.map(script => script.score);
        this._playNext(undefined);
    }

    speakPredictionSets(predictionSet) {
        this._reset();
        const vf = this;
        return new Promise(function(resolve, reject) {
            if(vf._voice == undefined){
                console.warn('voice list is not loaded');
                resolve(Error(false))
            }else{
                vf._resolve = resolve;
                vf._speakTexts(predictionSet);
            }
        });
    }

    speakPrediction(prediction) {
        const topNPredictionSet = prediction.getTopN(3);
        const predictionSets = topNPredictionSet.map(script => {return {
            label: Prediction.PREDEFINED_CLASS_TEXT[script.label],
            score: script.score
        }
        });
        return this.speakPredictionSets(predictionSets);
    }

    _playNext(event) {
        if(this._voiceTexts.length > 0){
            this._elapsedTime = event == undefined ? this._elapsedTime: this._elapsedTime + event.elapsedTime;
            const text = this._voiceTexts.shift();
            const volume = this._voiceVolumes.shift();
            this._speak(text, volume, this._playNext.bind(this));
        }else{
            console.log('Finished playing all texts, spent ' + this._elapsedTime / 1000.0 + ' seconds');
            this._resolve(true);
        }
    }

    _speak(text, volume, onVoiceEnd){
        console.log(text);
        const synUtterance = new SpeechSynthesisUtterance();
        synUtterance.text = text;
        synUtterance.voice = this._voice;
        synUtterance.volume = volume;
        synUtterance.rate = 1;
        synUtterance.addEventListener('end', onVoiceEnd);
        this._synth.speak(synUtterance);
    }
}

export default VoiceFeedback;
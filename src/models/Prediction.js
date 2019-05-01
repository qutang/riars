import moment from "moment";

class Prediction {
    constructor(prediction) {
        this._prediction = prediction || [];
        this._startTime = moment();
        this._stopTime = this._startTime.clone();
        this._stopTime.add(12.8, 's');
        this._refreshRate = 1;
        this._correction = undefined;
        this._correctionNote = undefined;
    }

    static get PREDEFINED_CLASS_ABBR() {
        return {
            'BIKING': '🚴‍',
            'BRISK WALKING': 'Brisk 🚶',
            'RUNNING': '🏃‍️',
            'NORMAL WALKING': 'Normal 🚶',
            'LYING': '🛌',
            'SITTING': 'Sit',
            'SITTING AND TYPING ON A KEYBOARD': 'Sit typing 💻',
            'SITTING AND WRITING': 'Sit ✍',
            'SLOW WALKING': 'Slow 🚶',
            'STANDING AND FOLDING TOWELS': '🕴 folding 👕',
            'STANDING AND SWEEPING': '🕴 sweep',
            'STANDING LOADING/UNLOADING SHELF': '🕴 loading 📚',
            'UNKNOWN': '❓',
            'STANDING': '🕴'

        }
    }

    clone() {
        const predictionSet = this.immutablePrediction
        const clonedPredictionSet = predictionSet.map((pr) => {
            return {
                label: pr.label,
                score: pr.score
            }
        });
        const newPrediction = new Prediction(clonedPredictionSet);
        newPrediction.startTime = this.startTime;
        newPrediction.stopTime = this.stopTime;
        newPrediction.correction = this.correction;
        newPrediction.correctionNote = this.correctionNote;
        newPrediction.refreshRate = this.refreshRate;
        return newPrediction;
    }

    getPredictionByLabel(label) {
        const prediction = this._prediction.filter((prediction) => {
            prediction.label == label
        })[0];
        return prediction;
    }

    getPredictionByScore(score) {
        const prediction = this._prediction.filter((prediction) => {
            prediction.score == score
        })[0];
        return prediction;
    }

    get refreshRate() {
        return this._refreshRate
    }

    set refreshRate(value) {
        this._refreshRate = value;
    }

    get duration() {
        return Math.round((this._stopTime - this._startTime) / 100.0) / 10.0;
    }

    set correction(correctLabel) {
        this._correction = correctLabel;
    }

    set correctionNote(correctNote) {
        this._correctionNote = correctNote;
    }

    get correction() {
        return this._correction;
    }

    get correctionNote() {
        return this._correctionNote;
    }

    get startTime() {
        return this._startTime
    }

    set startTime(value) {
        this._startTime = value
    }

    get stopTime() {
        return this._stopTime
    }

    set stopTime(value) {
        this._stopTime = value
    }

    get scores() {
        return this._prediction.map((prediction) => prediction.score);
    }

    get labels() {
        return this._prediction.map((prediction) => prediction.label);
    }

    get immutablePrediction() {
        return this._prediction;
    }

    getMostProbable() {
        const scores = this.scores;
        const maxScore = Math.max(...scores);
        const prediction = this.getPredictionByScore(maxScore);
        return prediction;
    }

    static copy(another) {
        const scores = another.scores;
        const labels = another.labels;
        const newPrediction = scores.map((score, index) => {
            return {
                label: labels[index],
                score: score
            }
        });
        return new Prediction(newPrediction);
    }

    getTopN(n = 5) {
        const sorted = this._prediction.slice(0);
        sorted.sort((a, b) => b.score - a.score);
        const topN = new Prediction(sorted.slice(0, n - 1));
        const copied = Prediction.copy(topN);
        return copied.immutablePrediction;
    }

    static fromJSON(jsonData) {
        const predictionSet = jsonData.prediction.map(p => { return { label: p.label, score: p.y } });
        const prediction = new Prediction(predictionSet);
        prediction.startTime = jsonData['START_TIME'];
        prediction.stopTime = jsonData['STOP_TIME'];
        return prediction;
    }
}

export default Prediction;
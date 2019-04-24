import moment from "moment";

class Prediction {
    constructor(prediction) {
        this._prediction = prediction || [];
        this._startTime = moment();
        this._stopTime = this._startTime.clone();
        this._stopTime.add(12.8, 's');
        this._correction = undefined;
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

    get duration() {
        return Math.round((this._stopTime - this._startTime) / 100.0) / 10.0;
    }

    set correction(correctLabel) {
        this._correction = correctLabel;
    }

    get correction() {
        return this._correction;
    }

    get startTime() {
        return this._startTime
    }

    get stopTime() {
        return this._stopTime
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
}

export default Prediction;
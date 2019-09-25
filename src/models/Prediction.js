import moment from "moment";

class Prediction {
  constructor(prediction) {
    this._prediction = prediction || [];
    this._startTime = moment();
    this._stopTime = this._startTime.clone();
    this._stopTime.add(12.8, "s");
    this._refreshRate = 1;
    this._correction = undefined;
    this._correctionNote = undefined;
  }

  static get PREDEFINED_CLASS_ABBR() {
    return {
      BIKING: "🚴‍",
      "WALKING AT 3-3.5 MPH": "🚶 3-3.5",
      RUNNING: "🏃‍️",
      "WALKING AT 2 MPH": "🚶 2",
      LYING: "🛌",
      STRETCHING: "Stretch",
      "SITTING STILL": "Sit",
      "SITTING AND USING A COMPUTER": "Sit 💻",
      "SITTING AND WRITING": "Sit ✍",
      "STANDING AND USING A COMPUTER": "Stand 💻",
      "STANDING AND WRITING": "Stand ✍",
      "WALKING AT 1 MPH": "🚶 1",
      "FOLDING TOWELS": "folding 👕",
      SWEEPING: "sweep",
      "LOADING/UNLOADING SHELF": "loading 📚",
      "WALKING DOWNSTAIRS": "🚶 down",
      "WALKING UPSTAIRS": "🚶 up",
      UNKNOWN: "❓",
      "SELF-SELECTED FREE STANDING": "🕴"
    };
  }

  static get PREDEFINED_CLASS_TEXT() {
    return {
      BIKING: "biking",
      "WALKING AT 3-3.5 MPH": "walking around three miles per hour",
      RUNNING: "running",
      "WALKING AT 2 MPH": "walking around two miles per hour",
      LYING: "lying",
      "SITTING STILL": "sitting",
      "SITTING AND USING A COMPUTER": "sitting and using computer",
      "SITTING AND WRITING": "sitting and writing",
      "STANDING AND USING A COMPUTER": "standing and using computer",
      "STANDING AND WRITING": "standing and writing",
      "WALKING AT 1 MPH": "walking at one mile per hour",
      "FOLDING TOWELS": "folding laundries",
      SWEEPING: "sweeping",
      "LOADING/UNLOADING SHELF": "loading shelf",
      "WALKING DOWNSTAIRS": "walking downstairs",
      "WALKING UPSTAIRS": "walking upstairs",
      UNKNOWN: "unknown",
      STRETCHING: "stretching",
      "SELF-SELECTED FREE STANDING": "standing"
    };
  }

  clone() {
    const predictionSet = this.prediction;
    const clonedPredictionSet = predictionSet.map(pr => {
      return {
        label: pr.label,
        score: pr.score
      };
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
    const prediction = this._prediction.filter(prediction => {
      prediction.label == label;
    })[0];
    return prediction;
  }

  getPredictionByScore(score) {
    const prediction = this._prediction.filter(prediction => {
      prediction.score == score;
    })[0];
    return prediction;
  }

  get refreshRate() {
    return this._refreshRate;
  }

  set refreshRate(value) {
    this._refreshRate = value;
  }

  computeDuration() {
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
    return this._startTime;
  }

  set startTime(value) {
    this._startTime = value;
  }

  get stopTime() {
    return this._stopTime;
  }

  set stopTime(value) {
    this._stopTime = value;
  }

  getScores() {
    return this._prediction.map(prediction => prediction.score);
  }

  getLabels() {
    return this._prediction.map(prediction => prediction.label);
  }

  get prediction() {
    return this._prediction;
  }

  getMostProbable() {
    const scores = this.getScores();
    const maxScore = Math.max(...scores);
    const prediction = this.getPredictionByScore(maxScore);
    return prediction;
  }

  static copy(another) {
    const scores = another.getScores();
    const labels = another.getLabels();
    const newPrediction = scores.map((score, index) => {
      return {
        label: labels[index],
        score: score
      };
    });
    const newCopy = new Prediction(newPrediction);
    newCopy.startTime = another.startTime;
    newCopy.stopTime = another.stopTime;
    newCopy.correction = another.correction;
    newCopy.correctionNote = another.correctionNote;
    return newCopy;
  }

  getTopN(n = 5) {
    const sorted = this.prediction.slice(0);
    sorted.sort((a, b) => b.score - a.score);
    return sorted.slice(0, n);
  }

  static fromJSON(jsonData) {
    const predictionSet = jsonData.prediction.map(p => {
      return { label: p.label, score: p.y };
    });
    const prediction = new Prediction(predictionSet);
    prediction.startTime = jsonData["START_TIME"];
    prediction.stopTime = jsonData["STOP_TIME"];
    return prediction;
  }

  toJSON() {
    const { startTime, stopTime, correction, correctionNote } = this;
    return {
      start_time: startTime,
      stop_time: stopTime,
      label_name: correction,
      note: correctionNote
    };
  }

  static convertToJSONAnnotations(predictions, id) {
    const jsonObj = predictions.map(prediction => {
      const newJson = prediction.toJSON();
      return newJson;
    });
    return jsonObj;
  }
}

export default Prediction;

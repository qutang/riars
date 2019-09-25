import React, { Component } from "react";
import { Slider, Spin, Icon } from "antd";
import PredictionTagGroup from "./PredictionTagGroup";
import AnnotationPanel from "./AnnotationPanel";
import Annotation from "../models/Annotation";
import VoiceFeedback from "../models/VoiceFeedback";
import "./UserPredictionMonitor.css";
import { get } from "http";

class UserPredictionMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPredicting: false,
      currentTime: 0,
      voiceOn: false,
      voiceFeedbackInterval: 13,
      beepOn: false
    };
    this.voiceFiredForCurrentPrediction = false;
    this.correctPredictionCount = 0;
    this.wrongPredictionCount = 0;
    this.voiceFeedbackTimer = 0;
    this.sessionStartTime = undefined;
    this.lastNumOfPredictions = 0;
    this.windowStartTime = 0;
    this.calibrationCountDown = 100;
    this.voiceCountDown = 1000;
    this.predictionTime = 0;
    this.voiceFeedback = new VoiceFeedback();
    this.selectedProcessor = undefined;
    this.stage = "stop";
    this.nowPanelContent = undefined;
    this.labels = [];
    this.isResting = true;
    this.predictionPanelWidth = 370;
    this.nowPanelWidth = 500;
    this.inferenceDelay = 0;
    this.currentAnnotationLapsedTime = 0;
  }

  changeVoiceFeedbackInterval(value) {
    this.setState({
      voiceFeedbackInterval: value
    });
  }

  addPredictionNote(index, note) {
    this.props.addPredictionNote(index, note);
  }

  renderCurrentPrediction() {
    if (this.props.predictions.length >= 2 && this.state.isPredicting) {
      return <h3>Making activity prediction...</h3>;
    } else if (this.props.predictions.length >= 3 && !this.state.isPredicting) {
      const currentPrediction = this.props.predictions[
        this.props.predictions.length - 1
      ];
      return this._renderPrediction(
        currentPrediction,
        false,
        this.props.predictions.length - 1,
        1
      );
    }
  }

  onFinishDataCollection() {
    this.setState({
      isPredicting: true
    });
    this.voiceFiredForCurrentPrediction = false;
  }

  decideFeedback(lastPrediction) {
    
    let activityAnnotations = Annotation.getMeAnnotations(
      this.props.annotations,
      "activity"
    );
    let lastActivityAnnotation = Annotation.getLastAnnotation(
      activityAnnotations
    );
    const variationStatus = Annotation.getVariationStatus(
      this.props.annotations
    );

    const systemPrediction = lastPrediction.getTopN(1)[0];
    // decide when to auto beep to remind switching
    if (
      lastActivityAnnotation != undefined &&
      lastActivityAnnotation.label_name != "BREAK" &&
      lastActivityAnnotation.label_name != "SYNC" &&
      variationStatus != false
    ) {
      console.log("annotation label:" + lastActivityAnnotation.label_name);
      console.log("system prediction label:" + systemPrediction.label);
      if (lastActivityAnnotation.label_name === systemPrediction.label) {
        this.correctPredictionCount += 1;
      } else {
        this.wrongPredictionCount += 1;
        this.wrongPredictionCount += this.correctPredictionCount; // previous correct ones are now counted as uncertain
        this.correctPredictionCount = 0;
      }
      if (
        this.correctPredictionCount >= 2 ||
        this.wrongPredictionCount >= 5 ||
        this.correctPredictionCount + this.wrongPredictionCount >= 5
      ) {
        this.correctPredictionCount = 0;
        this.wrongPredictionCount = 0;
        // beep to switch when we detect 2 consecutive success predictions or 4 consecutive wrong predictions
        this.setState({
          beepOn: true
        });
        this.voiceFeedback.playSwitch(
          function onSwitchEnd() {
            this.setState({
              beepOn: false
            });
          }.bind(this)
        );
        // this.voiceFeedback.playBeep(
        //   function onBeepEnd() {
        //     this.setState({
        //       beepOn: false
        //     });
        //   }.bind(this)
        // );
      } else {
        if(!this.voiceFiredForCurrentPrediction){
          this.runVoiceFeedback(lastPrediction);
        }
      }
    } else {
      this.correctPredictionCount = 0;
      this.wrongPredictionCount = 0;
      if(!this.voiceFiredForCurrentPrediction){
        this.runVoiceFeedback(lastPrediction);
      }
    }
  }

  onFinishPrediction() {
    this.inferenceDelay =
      this.state.currentTime -
      this.props.predictions[this.props.predictions.length - 1].stopTime;
    
    this.setState({
      isPredicting: false
    });

    this.lastNumOfPredictions = this.props.predictions.length;

    let lastPrediction = this.props.predictions[
      this.props.predictions.length - 1
    ];
    
    if (this.props.predictions.length >= 3){
      this.decideFeedback(lastPrediction);
    }
  }

  onVoiceFeedbackEnd() {
    this.setState({
      voiceOn: false
    });
  }

  componentDidMount() {
    this.selectedProcessor = this.props.processors.filter(p => p.selected)[0];
    this.setState({
      currentTime: new Date().getTime() / 1000.0
    });
    setInterval(() => {
      this.setState({
        currentTime: new Date().getTime() / 1000.0
      });
    }, 1000);
  }

  runVoiceFeedback(currentPrediction) {
    this.voiceFiredForCurrentPrediction = true;
    this.voiceFeedback.speakPrediction(currentPrediction).then(
      success => {
        if (success) {
          this.onVoiceFeedbackEnd();
        }
      },
      function(error) {
        console.error(error);
        this.onVoiceFeedbackEnd();
      }
    );
    this.setState({
      voiceOn: true
    });
  }

  renderPastPredictions(n) {
    let startIndex;
    let stopIndex;
    if (this.state.isPredicting) {
      startIndex = Math.max(2, this.props.predictions.length - n);
      stopIndex = this.props.predictions.length;
    } else {
      startIndex = Math.max(2, this.props.predictions.length - n - 1);
      stopIndex = this.props.predictions.length - 1;
    }
    const pastPredictions = this.props.predictions.slice(startIndex, stopIndex);
    return pastPredictions.map((prediction, index) => {
      const tags = this._renderPrediction(
        prediction,
        true,
        startIndex + index,
        this.props.predictions.length - index
      );
      return (
        <div
          key={index}
          className="past-prediction"
          style={{ width: this.predictionPanelWidth }}
        >
          {tags}
        </div>
      );
    });
  }

  _renderPrediction(prediction, past = true, index, pastIndex) {
    const displayTime =
      Math.round((this.state.currentTime - prediction.stopTime) * 10.0) / 10.0;
    const displayTimeStart =
      Math.round((this.state.currentTime - prediction.startTime) * 10.0) / 10.0;
    return (
      <div>
        <h3>{displayTimeStart + "-" + displayTime + " seconds ago"}</h3>
        <PredictionTagGroup
          index={index}
          prediction={prediction}
          isPast={past}
          correctLabel={this.props.correctLabel}
          addPredictionNote={this.props.addPredictionNote}
        />
      </div>
    );
  }

  onInit() {
    this.voiceFeedbackTimer = 0;
    this.sessionStartTime = undefined;
    this.labels = [];
    this.isResting = true;
    this.predictionPanelWidth = 370;
    this.nowPanelWidth = 500;
    this.lastNumOfPredictions = 0;
    this.windowStartTime = 0;
    this.calibrationCountDown = 100;
    this.predictionTime = 0;
    this.correctPredictionCount = 0;
    this.wrongPredictionCount = 0;
    this.currentAnnotationLapsedTime = 0;
    // set now panel
    this.nowPanelContent = (
      <h3>
        <Spin /> Calibrating timestamps...
      </h3>
    );
    // set init annotation
    if (this.props.annotations.length == 0) {
      this.props.annotate({
        name: "BREAK",
        isMutualExclusive: true,
        category: "activity"
      });
    }
  }

  getLabels() {
    var labels = this.props.predictions[0].prediction.map(p => ({
      name: p.label,
      isMutualExclusive: true,
      category: "activity",
      annotate: this.props.annotate
    }));
    labels.push({
      name: "STRETCHING",
      isMutualExclusive: true,
      category: "activity",
      annotate: this.props.annotate,
    });
    labels.push({
      name: "SYNC",
      isMutualExclusive: true,
      category: "activity",
      annotate: this.props.annotate
    });
    labels.push({
      name: "BREAK",
      isMutualExclusive: true,
      category: "activity",
      annotate: this.props.annotate
    });
    labels.push({
      name: "OUT_SCOPE",
      isMutualExclusive: false,
      category: "activity",
      annotate: this.props.annotate
    });
    labels.push({
      name: "Variation I",
      isMutualExclusive: true,
      category: "session",
      annotate: this.switchVariationStatus.bind(this)
    });
    labels.push({
      name: "Variation II",
      isMutualExclusive: true,
      category: "session",
      annotate: this.switchVariationStatus.bind(this)
    });
    labels.push({
      name: "Warm up",
      isMutualExclusive: false,
      category: "session",
      annotate: this.switchWarmUpStatus.bind(this)
    });
    return labels;
  }

  onCalibrate() {
    if (this.inferenceDelay == 0) {
      this.inferenceDelay =
        new Date().getTime() / 1000.0 - this.props.predictions[0].stopTime;
    }
    this.windowStartTime =
      this.props.predictions[0].stopTime + this.selectedProcessor.windowSize;
    const deadline = this.windowStartTime;
    this.calibrationCountDown = Math.ceil(deadline - this.state.currentTime);
    this.labels = this.getLabels();
    // set now panel
    if (this.calibrationCountDown > 0) {
      this.nowPanelContent = (
        <>
          <h3>
            Data collection will start in {this.calibrationCountDown} seconds
          </h3>
          <AnnotationPanel
            labels={this.labels}
            annotations={this.props.annotations}
            // annotate={this.props.annotate}
          />
        </>
      );
    }
  }

  switchVariationStatus(label) {
    console.log("switching variation status");
    this.correctPredictionCount = 0;
    this.wrongPredictionCount = 0;
    this.props.annotate(label);
  }

  switchWarmUpStatus(label) {
    console.log("switching warm-up status");
    this.props.annotate(label);
  }

  onRun() {
    if (this.sessionStartTime == undefined) {
      this.sessionStartTime = this.state.currentTime;
    }
    let deadline = this.windowStartTime + this.selectedProcessor.windowSize;
    const displaySeconds = Math.ceil(deadline - this.state.currentTime);
    if (displaySeconds == 0) {
      this.windowStartTime =
        this.windowStartTime + this.selectedProcessor.windowSize;
      this.onFinishDataCollection();
    }
    if (this.props.predictions.length > this.lastNumOfPredictions) {
      this.onFinishPrediction();
    }

    this.labels = this.getLabels();

    // set now panel
    this.nowPanelContent = (
      <>
        <h3>
          Data collection for current window finishes in {displaySeconds}{" "}
          seconds {this.state.voiceOn && <Icon type="sound" />}{" "}
          {this.state.beepOn && <Icon type="alert" />}
        </h3>
        <h4>
          Correct predictions: {this.correctPredictionCount}, wrong predictions:{" "}
          {this.wrongPredictionCount}
        </h4>
        <h4>Current annotation: {this.getCurrentAnnotationLapsedTime()}</h4>
        <AnnotationPanel
          labels={this.labels}
          annotations={this.props.annotations}
          //   annotate={this.props.annotate}
        />
      </>
    );

    // when break or sync is on
    if (this.props.annotations.length > 0) {
      let lastMeAnnotation = Annotation.getLastAnnotation(
        Annotation.getMeAnnotations(this.props.annotations, "activity")
      );
      if (
        lastMeAnnotation != undefined &&
        (lastMeAnnotation.label_name == "BREAK" ||
          lastMeAnnotation.label_name == "SYNC") &&
        lastMeAnnotation["stop_time"] == undefined
      ) {
        this.isResting = true;
      } else {
        this.isResting = false;
      }
    } else {
      this.isResting = false;
    }
  }

  onStop() {
    this.nowPanelContent = <h3>Stopped</h3>;
  }

  setStage() {
    if (this.selectedProcessor == undefined) {
      this.stage = "stop";
      return;
    }
    if (
      this.selectedProcessor.status == "stopped" &&
      this.props.predictions.length == 0
    ) {
      this.stage = "stop";
    } else if (
      this.selectedProcessor.status == "running" &&
      this.props.predictions.length == 0
    ) {
      this.stage = "init";
    } else if (
      this.props.predictions.length == 1 &&
      this.calibrationCountDown > 0
    ) {
      this.stage = "calibrate";
    } else if (this.props.predictions.length >= 1) {
      this.stage = "run";
    }
  }

  handleStage() {
    if (this.stage == "init") {
      this.onInit();
    } else if (this.stage == "calibrate") {
      this.onCalibrate();
    } else if (this.stage == "run") {
      this.onRun();
    } else if (this.stage == "stop") {
      this.onStop();
    }
  }

  getSessionLapseTime() {
    if (this.sessionStartTime != undefined) {
      const totalSeconds = this.state.currentTime - this.sessionStartTime;
      return this.formatLapseTime(totalSeconds);
    }
    return "not started";
  }

  getCurrentAnnotationLapsedTime() {
    // update annotation lapsed time (only mutual exclusive annotations)
    var meAnnotations = Annotation.getMeAnnotations(
      this.props.annotations,
      "activity"
    );
    if (meAnnotations.length > 0) {
      this.currentAnnotationLapsedTime =
        this.state.currentTime -
        meAnnotations[meAnnotations.length - 1].start_time;
    } else {
      this.currentAnnotationLapsedTime = 0;
    }
    return this.formatLapseTime(this.currentAnnotationLapsedTime);
  }

  formatLapseTime(totalSeconds) {
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round((totalSeconds % 3600) % 60);
    const displayTime =
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (minute < 10 ? "0" + minute : minute) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);
    return displayTime;
  }

  getCurrentProcessor() {
    return this.props.processors.filter(p => p.selected)[0];
  }

  getCurrentWindowSize() {
    return this.getCurrentProcessor().windowSize;
  }

  getVoiceFeedbackCountDown() {
    if (this.voiceFeedbackTimer == 0 && !this.isResting) {
      this.voiceFeedbackTimer =
        this.state.currentTime + this.state.voiceFeedbackInterval;
      return this.state.voiceFeedbackInterval + " seconds";
    } else if (this.voiceFeedbackTimer != 0 && !this.isResting) {
      this.voiceCountDown = Math.round(
        this.voiceFeedbackTimer - this.state.currentTime
      );
      if (this.voiceCountDown <= 0) {
        this.voiceFeedbackTimer += this.state.voiceFeedbackInterval;
      }
      return this.voiceCountDown + " seconds";
    } else if (this.isResting) {
      this.voiceFeedbackTimer = 0;
      return "In break";
    }
  }

  componentDidUpdate() {
    // if (this.voiceCountDown <= 0) {
    //   this.runVoiceFeedback();
    // }
  }

  render() {
    this.setStage();
    this.handleStage();
    return (
      <div className="user-prediction-monitor-container">
        <div className="user-prediction-monitor-control">
          <div className="user-prediction-monitor-control-item">
            <h4>Choose number of past predictions to show</h4>
            <Slider
              className="num-of-past-prediction"
              min={0}
              max={10}
              defaultValue={1}
              value={this.props.numOfPastPredictions}
              onChange={this.props.changeNumOfPastPredictions}
            />
          </div>
          <div className="user-prediction-monitor-control-item">
            <h4>
              Voice feedback interval (every {this.state.voiceFeedbackInterval}{" "}
              seconds){" "}
            </h4>
            <Slider
              className="voice-feedback-interval"
              min={Math.ceil(this.getCurrentWindowSize())}
              max={120}
              defaultValue={15}
              value={this.state.voiceFeedbackInterval}
              onChange={this.changeVoiceFeedbackInterval.bind(this)}
            />
          </div>
          <div className="user-prediction-monitor-control-item">
            <h3>
              Lapsed time: {this.getSessionLapseTime()}, Voice feedback count
              down: {this.getVoiceFeedbackCountDown()}, Inference delay:{" "}
              {Math.round(this.inferenceDelay * 10) / 10.0}
            </h3>
          </div>
        </div>
        <div
          className="user-prediction-monitor"
          style={{
            width:
              (Math.min(
                this.props.numOfPastPredictions,
                this.props.predictions.length - 1
              ) +
                1) *
                380 +
              510
          }}
        >
          <div className="now-panel" style={{ width: this.nowPanelWidth }}>
            {this.nowPanelContent}
          </div>
          <div
            className="current-prediction"
            style={{ width: this.predictionPanelWidth }}
          >
            {this.renderCurrentPrediction()}
          </div>
          {this.renderPastPredictions(this.props.numOfPastPredictions)}
        </div>
      </div>
    );
  }
}

export default UserPredictionMonitor;

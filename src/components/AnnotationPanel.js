import React, { Component } from "react";
import { Input } from "antd";
import AnnotationTag from "./AnnotationTag";
import Annotation from "../models/Annotation";

class AnnotationPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const annotations = this.props.annotations;
    const labels = this.props.labels;
    return (
      <div className="label-list">
        {labels.map(label => {
          let isOn = false;
          if (annotations.length > 0) {
            if (label.isMutualExclusive) {
              const meAnnotations = Annotation.getMeAnnotations(
                annotations,
                label.category
              );

              const lastMeAnnotation = Annotation.getLastAnnotation(
                meAnnotations
              );
              if (
                lastMeAnnotation != undefined &&
                lastMeAnnotation["stop_time"] == undefined &&
                label.name == lastMeAnnotation.label_name
              ) {
                isOn = true;
              }
            } else {
              const notMeSameAnnotations = annotations.filter(
                ({ is_mutual_exclusive, label_name, category, ...rest }) =>
                  !is_mutual_exclusive &&
                  label_name === label.name &&
                  category == label.category
              );
              const lastNotMeSameAnnotation =
                notMeSameAnnotations.length > 0
                  ? notMeSameAnnotations[notMeSameAnnotations.length - 1]
                  : undefined;
              if (
                lastNotMeSameAnnotation != undefined &&
                lastNotMeSameAnnotation["stop_time"] == undefined
              ) {
                isOn = true;
              }
            }
          }
          return (
            <AnnotationTag
              key={label.name}
              label={label}
              annotate={label.annotate}
              isOn={isOn}
            />
          );
        })}
      </div>
    );
  }
}

export default AnnotationPanel;

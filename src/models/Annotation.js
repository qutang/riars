var copyAnnotations = function(annotations) {
  return annotations.map(
    ({ label_name, start_time, stop_time, is_mutual_exclusive, category }) => {
      return {
        label_name: label_name,
        start_time: start_time,
        stop_time: stop_time,
        is_mutual_exclusive: is_mutual_exclusive,
        category: category
      };
    }
  );
};

var getMeAnnotations = function(annotations, cat) {
  return annotations.filter(
    ({ is_mutual_exclusive, category, ...rest }) =>
      is_mutual_exclusive && category == cat
  );
};

var getVariationStatus = function(annotations) {
  var variationAnnotations = annotations.filter(
    ({ is_mutual_exclusive, category, label_name, ...rest }) =>
      is_mutual_exclusive &&
      category == "session" &&
      label_name.includes("Variation")
  );
  var lastVariationAnnotation = getLastAnnotation(variationAnnotations);
  if (
    lastVariationAnnotation != undefined &&
    lastVariationAnnotation["stop_time"] == undefined
  ) {
    return lastVariationAnnotation.label_name;
  } else {
    return false;
  }
};

var isWarmUpOn = function(annotations) {
  var warmUpAnnotations = annotations.filter(
    ({ is_mutual_exclusive, category, label_name, ...rest }) =>
      !is_mutual_exclusive &&
      category == "session" &&
      label_name.includes("Warm up")
  );
  var lastWarmUpAnnotation = getLastAnnotation(warmUpAnnotations);
  if (
    lastWarmUpAnnotation != undefined &&
    lastWarmUpAnnotation["stop_time"] == undefined
  ) {
    return true;
  } else {
    return false;
  }
};

var getLastAnnotation = function(annotations) {
  return annotations.length > 0
    ? annotations[annotations.length - 1]
    : undefined;
};

export default {
  copyAnnotations,
  getMeAnnotations,
  getLastAnnotation,
  getVariationStatus,
  isWarmUpOn
};

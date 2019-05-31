var copyAnnotations = function (annotations) {
    return annotations.map(({ label_name, start_time, stop_time, is_mutual_exclusive }) => {
        return {
            label_name: label_name,
            start_time: start_time,
            stop_time: stop_time,
            is_mutual_exclusive: is_mutual_exclusive
        }
    })
}

var getMeAnnotations = function (annotations) {
    return annotations.filter(({ is_mutual_exclusive, ...rest }) => is_mutual_exclusive)
}

var getLastAnnotation = function (annotations) {
    return annotations.length > 0 ? annotations[annotations.length - 1] : undefined;
}

export default { copyAnnotations, getMeAnnotations, getLastAnnotation }
import React from 'react';
import AnnotationTag from './AnnotationTag';

export default { title: 'AnnotationTag' };

export const mutual_exclusive_activity = () => {
        return (
            <>
                <AnnotationTag label={{category: 'activity', name: 'Not selected', isMutualExclusive: true}}  isOn={false} />
                <AnnotationTag label={{category: 'activity', name: 'Selected', isMutualExclusive: true}}  isOn={true} />
            </>
        )
    }
;

export const not_mutual_exclusive_activity = () => {
    return (
        <>
            <AnnotationTag label={{category: 'activity', name: 'Not selected', isMutualExclusive: false}}  isOn={false} />
            <AnnotationTag label={{category: 'activity', name: 'Selected', isMutualExclusive: false}}  isOn={true} />
        </>
    )
}
;

export const mutual_exclusive_session = () => {
    return (
        <>
            <AnnotationTag label={{category: 'session', name: 'Not selected', isMutualExclusive: true}}  isOn={false} />
            <AnnotationTag label={{category: 'session', name: 'Selected', isMutualExclusive: true}}  isOn={true} />
        </>
    )
}
;

export const not_mutual_exclusive_session = () => {
return (
    <>
        <AnnotationTag label={{category: 'session', name: 'Not selected', isMutualExclusive: false}}  isOn={false} />
        <AnnotationTag label={{category: 'session', name: 'Selected', isMutualExclusive: false}}  isOn={true} />
    </>
)
}
;

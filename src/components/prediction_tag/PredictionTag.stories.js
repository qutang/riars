import React from 'react';
import PredictionTag from './PredictionTag';

export default { title: 'PredictionTag' };

export const high_confident_prediction_in_the_past = () => {
        return (
            <>
                <PredictionTag past={true} pr={{label: 'Not corrected', score: 0.9}}  flag='red' />
                <PredictionTag past={true} pr={{label: 'Corrected', score: 0.9}}  flag='' />
            </>
        )
    }
;

export const low_confident_prediction_in_the_past = () => {
    return (
        <>
            <PredictionTag past={true} pr={{label: 'Not corrected', score: 0.1}}  flag='red' />
            <PredictionTag past={true} pr={{label: 'Corrected', score: 0.1}}  flag='' />
        </>
    )
}
;

export const high_confident_prediction_present = () => {
    return (
        <>
            <PredictionTag past={false} pr={{label: 'Not corrected', score: 0.9}}  flag='red' />
            <PredictionTag past={false} pr={{label: 'Corrected', score: 0.9}}  flag='' />
        </>
    )
}
;

export const low_confident_prediction_present = () => {
return (
    <>
        <PredictionTag past={false} pr={{label: 'Not corrected', score: 0.1}}  flag='red' />
        <PredictionTag past={false} pr={{label: 'Corrected', score: 0.1}}  flag='' />
    </>
)
}
;


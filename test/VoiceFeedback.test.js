import VoiceFeedback from '../src/models/VoiceFeedback';
const assert = require('assert');

describe('Voice feedback', function() {
describe('voice-feedback', () => {
    it(
        "should play voice after clicking the run button on the right.", function(done) {
            this.timeout(8000);
            const voiceFeedback = new VoiceFeedback();
            setTimeout(function() {
                // wait a second then play, as the browser needs to first load voices 
                const pendingResult = voiceFeedback.speakPredictionSets([
                    {
                        label: "running",
                        score: 0.8
                    },
                    {
                        label: 'walking',
                        score: 0.2
                    },
                    {
                        label: 'lying',
                        score: 0
                    }
                ]);
                pendingResult.then(function(success){
                    console.log(success);
                    assert.strictEqual(success, true);
                    done();
                }, function(error){
                    assert.strictEqual(success, error);
                    done();
                });
            }, 1000);
        }
    )
});

describe('beep-feedback', () => {
    it(
        "should play beep after clicking the run button on the right.", function(done) {
            this.timeout(5000);
            const voiceFeedback = new VoiceFeedback();
            voiceFeedback.playBeep(function onBeepEnd() {
                done(); 
            });
        }
    )
});

describe('switch-feedback', () => {
    it(
        "should play 'switch' after clicking the run button on the right.", function(done) {
            this.timeout(5000);
            const voiceFeedback = new VoiceFeedback();
            setTimeout(function() {
                // wait a second then play, as the browser needs to first load voices 
                voiceFeedback.playSwitch(function() {
                    done();
                });
            }, 1000);
        }
    )
});
});
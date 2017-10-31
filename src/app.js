import * as DOM from './DOM/Elements';
import { ObservableValue } from './Structures/Observable';
import { Button, IntegerInput, IntegerOutput } from './views';
import { Howl } from 'howler';

console.log("hello");

var sound = new Howl({
    // src: ['assets/sounds/alert.mp3']
    src: ['assets/sounds/btn402.mp3']
});

/*
.myButton {
    background - color:#44c767;
    -moz - border - radius:28px;
    -webkit - border - radius:28px;
    border - radius:28px;
    border: 1px solid #18ab29;
    display: inline - block;
    cursor: pointer;
    color: #ffffff;
    font - family:Arial;
    font - size:17px;
    padding: 16px 31px;
    text - decoration:none;
    text - shadow:0px 1px 0px #2f6627;
}
.myButton: hover {
    background - color:#5cbf2a;
}
.myButton: active {
    position: relative;
    top: 1px;
}
*/
let rolls = [];
let minRoll = 0;
let maxRoll = 0;
let avgRoll = 0;

const fight = (numDices, numEyes, offset) => {
    let total = offset;
    for (let i = 0; i < numDices; i++) {
        total += Math.ceil(numEyes * Math.random());
    }
    return total;
};

const update = () => {    
    let roll = fight(
        obs.numDices.value,
        obs.numEyes.value,
        obs.offset.value
    );
    rolls.push(roll);

    if (roll < minRoll) {
        minRoll = roll;
    }
    
    if (roll > maxRoll) {
        maxRoll = roll;
    }

    avgRoll = rolls.length ?
        rolls.reduce((sum, value) => sum + value) / rolls.length :
        0;
    
    refreshViews(roll);
    gfx.addRoll(roll);
};

const refreshViews = (roll) => {
    views.resultValue.fn.setText(roll);
    views.resultMin.fn.setText(minRoll);
    views.resultMax.fn.setText(maxRoll);
    views.numRolls.fn.setText(rolls.length);
    views.resultAvg.fn.setText(avgRoll.toFixed(2));
};

const reset = () => {
    rolls = [];
    minRoll = obs.numDices.value * obs.numEyes.value + obs.offset.value;
    maxRoll = obs.numDices.value + obs.offset.value;
    avgRoll = 0;
    refreshViews(0);
    gfx.reset();
};

let obs = {
    numDices: new ObservableValue(1, val => {
        console.log("numDices changed: " + val);
        reset();
    }),
    numEyes: new ObservableValue(6, val => {
        console.log("numEyes changed: " + val);
        reset();
    }),
    offset: new ObservableValue(0, val => {
        console.log("offset changed: " + val);
        reset();
    }),
    soundFlag: new ObservableValue(false, val => {
        console.log("sound: " + (val ? "on" : "off"));
    }),
     
};

// actions of views are only allowed to change observables
let views = {
    numDices: IntegerInput({
        text: "dices",
        value: obs.numDices.value, min: 1, max: 20,
        action: val => {
            obs.numDices.value = val; 
        }
    }),
    numEyes: IntegerInput({
        text: "eyes",
        value: obs.numEyes.value, min: 2, max: 20,
        action: val => {
            obs.numEyes.value = val; 
        }
    }),
    offset: IntegerInput({
        text: "offset",
        value: obs.offset.value, min: -20, max: 20,
        action: val => {
            obs.offset.value = val; 
        }
    }),
    button1: Button("roll", () => {
        if (obs.soundFlag.value) sound.play();
        update();
    }),
    resultValue: IntegerOutput({
        text: "result", style: { margin: "10px" }
    }),
    resultMin: IntegerOutput({
        text: "min", style: { margin: "10px" }
    }),
    resultMax: IntegerOutput({
        text: "max", style: { margin: "10px" }
    }),
    numRolls: IntegerOutput({
        text: "rolls", style: { margin: "10px" }
    }),
    resultAvg: IntegerOutput({
        text: "avg", style: { margin: "10px" }, size: 50
    }),
    button2: Button("reset", () => { reset(); }),
};

let dicer = DOM.Div({
    style: {
        margin: "4px"
    },
    children: Object.values(views),
    listenTo: {
        "mgMount": () => {
            console.log('mounted');
            reset();        
        }
    }
});

let options = DOM.Div({
    children: [
        DOM.Span({
            text: "sound", 
            style: {
                "color": "#aaa",
                "font-size": "9pt", 
                "font-family": "sans-serif"
            }
        }),
        DOM.Input({
            attr: {
                type: "checkbox"
            },
            listenTo: {
                change: (ev) => {
                    obs.soundFlag.value = ev.target.checked; 
                }
            }
        })
    ]
});

let gfx = ((numDices, numEyes) => {
    let canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 160;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.style.margin = "4px";
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dices = numDices, eyes = numEyes;
    let hits = Array.from({ length: numDices * (numEyes - 1) + 1 }, (v, i) => 0);

    const addRoll = (roll) => {
        ctx.fillStyle = '#fda';
        hits[roll-dices]++; // e.g. 3 dices starts with 3, this gives index 0
        let len = hits.length;
        let cx = canvas.width;
        let cy = canvas.height;
        let dx = cx / len;
        let dy = 4;
        for(let i = 0; i < len; i++) {
            let px = i * dx;
            ctx.fillRect(px, cy - dy * hits[i], dx, dy);
        }
    };

    const reset = () => {
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dices = obs.numDices.value;
        eyes = obs.numEyes.value;
        let len = dices * (eyes - 1) + 1;
        hits = Array.from({ length: len }, (v, i) => 0);
    };

    return {
        canvas, ctx, addRoll, reset
    };
})(obs.numDices.value, obs.numEyes.value);

export default DOM.Div({
    children: [
        dicer,
        gfx.canvas,
        options
    ]
});
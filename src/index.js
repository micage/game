import * as DOM from './DOM/Elements';
import { Howl } from 'howler';

console.log("hello");

var sound = new Howl({
    src: ['assets/sounds/alert.mp3']
    // src: ['assets/sounds/btn402.mp3']
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

DOM.App(DOM.Div({
    style: {
        margin: "4px"
    },
    children: [
        DOM.Span({
            style: {
                // width: "60px", 
                padding: "8px",
                border: "3px solid green", "background-color": "#ffa",
                borderRadius: "8px",
                display: "inline-block",
                cursor: "pointer",
                "text-decoration": "none"
            },
            text: "play",
            listenTo: {
                click: ev => {
                    sound.play();
                }
            }
        })
    ]
}));

if (module.hot) {
    module.hot.accept();
}
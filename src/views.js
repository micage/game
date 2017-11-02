import * as __ from './Util/ParamCheck';
import * as DOM from './DOM/Elements';

const Button = (text, action) => DOM.Span({
    style: {
        // width: "60px",
        "margin-right": "10px",
        "padding": "8px",
        "border": "3px solid orange",
        "background-color": "#ffe",
        "border-radius": "8px",
        "display": "inline-block",
        "cursor": "pointer",
        // "text-decoration": "none",
        "user-select": "none"
    },
    text,
    listenTo: {
        click: () => {
            action();
        }
    }
});

const IntegerInput = args => {
    let children = [];
    if (args.text) {
        children.push(
            DOM.Span({
                text: args.text,
                style: {
                    "display": "block",
                    "font-size": "9pt",
                    "font-family": "sans-serif",
                }
            })
        );
    }
    if (!args.action) {
        args.action = ev => console.log("value changed: " + ev.target.value);
    }
    if (!__.checkNumber(args.value)) args.value = 0;
    if (!__.checkNumber(args.min)) args.min = 0;
    if (!__.checkNumber(args.max)) args.max = 10;
    if (!__.checkNumber(args.step)) args.step = 1;

    children.push(
        DOM.Input({
            attr: {
                type: "number",
                value: args.value,
                min: args.min,
                max: args.max,
                step: args.step
            },
            style: {
                "width": "30px",
            },
            listenTo: {
                change: ev => args.action(parseInt(ev.target.value))
            }
        })
    );

    return DOM.Div({
        style: {
            "display": "inline-block",
            // "width": "60px",
            "margin-right": "10px",
            "color": "#aaa",
        },
        children
    });
};

const IntegerOutput = args => {
    let children = [];
    
    if (args.text) {
        children.push(
            DOM.Span({
                text: args.text,
                style: {
                    "display": "block",
                    "font-size": "9pt",
                    "font-family": "sans-serif",
                }
            })
        );
    }

    children.push(
        DOM.Span({
            text: "0",
            style: {
                "color": "initial",
                "display": "inline-block",
                "width": args.size ? args.size + "px" : "30px",
                "height": "16px",
                "padding": "1px",
                "border-width": "1px",
                "border-color": "#aaa",
                "border-style": "solid",
                "font-family": "system-ui",
                "font-size": "11px",
                "text-align": "center",
                // "text-transform": "none",
                // "text-rendering": "auto",
                //"-webkit-appearance": "textfield",
            }
        })
    );

    return DOM.Div({
        style: {
            "color": "#aaa",
            "display": "inline-block",
            // "width": "60px",
            "margin-right": "10px",
        },
        children,
        fn: {
            setText: text => { children[1].innerText = text; }
        }
    });
};

export { Button, IntegerInput, IntegerOutput }


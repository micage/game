import { App } from './DOM/Elements';
import MyApp from './app';

var app = MyApp;
App(app);

if (module.hot) {
    module.hot.accept(['./app.js'], () => {
        document.body.removeChild(app);
        app = require("./app").default;
        App(app);
    });
}

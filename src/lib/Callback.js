export default class Callback {
    key;    
    constructor(fn, global = false) {
        this.key = '_callback' + Math.random();
        this.global = global;

        if (!this.global) {
            window.currentScene[this.key] = fn;
        }
        else {
            window._callbacks = window._callbacks ?? {};
            window._callbacks[this.key] = fn;
        }
    }

    get callString() {
        var call;

        if (!this.global) {
            call = `window.currentScene["${this.key}"]()`;
        }
        else {
            call = `window._callbacks["${this.key}"]();`;
        }

        return `try {
    ${call}
}
catch(e) {
    console.error('Error executing callback');
    console.error(e);
}`;
    }

    static delayed(seconds, fn, global = false) {
        var callback = new Callback(fn, global);
        try {
            _i.delayedEval(seconds, callback.callString);
        }
        catch(e) {
            console.error(`error calling _i.delayedEval with ${seconds} ${fn} ${global}`);
            console.error(e);
        }
    }
}
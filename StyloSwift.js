const StyloSwiftConfig = {
    addToDOM: 'Manual',
    forceAddCSS: false,
    patseOnly: false
};

class StyloSwift {
    constructor() {
        this._styleSheet = document.createElement("style");
        document.head.appendChild(this._styleSheet);

        this.classID = Math.random();

        this.cssom = {};
        this.temp_cssom = {};

        this.config = StyloSwiftConfig;
    }

    get CSSOM() {
        return this.cssom;
    }

    /**
     * For configuring the StyloSwift instence
     * @param {Object} config
     */

    set config(config) {
        this.config = { ...this.config, ...config };
    }

    get Config() {
        return this.config;
    }

    addCSS(...css) {
        let blocks = css.length;

        if(blocks%2 !== 0) {
            throw new Error('Adding css make sure that the structure is Ok', this);
        }

        for(let id = 0; id < blocks/2; id++) {
            let selector = css[id];
            let rules = css[id + 1];

            if(typeof selector !== 'string') {
                throw new Error('Adding css make sure that the structure is Ok', this);
            }
            if(typeof rules !== 'object') {
                throw new Error('Adding css make sure that the structure is Ok', this);
            }

            if(this.cssom[selector] != undefined) {
                this.temp_cssom[selector] = this.cssom[selector];
            }
            else if(this.cssom[selector] == undefined && this.temp_cssom[selector] == undefined) {
                this.temp_cssom[selector] = {};
            }

            for(var rule in rules) {
                this.temp_cssom[selector][rule] = rules[rule];
            }
        }

        if(this.config.addToDOM === 'Auto') {
            this.addToDOM(this.classID);
        }
    }

    addToDOM(ID = NaN) {
        if(ID !== this.classID && this.config.addToDOM === 'Auto') {
            console.warn('You don\'t have to Manually add the CSS to DOM');
        }

        this.cssom = { ...this.cssom, ...this.temp_cssom };
        this.temp_cssom = {};

        let stylesheet = "";

        for (var selector in this.cssom)
        {
            stylesheet += selector + "{";

            var rules = this.cssom[selector];

            for (var prop in rules)
            {
                stylesheet += prop + ":" + rules[prop] + ";";
            }

            stylesheet += "}";
        }

        this._styleSheet.textContent = stylesheet;
    }

    addCSSToDOM(...css) {
        this.addCSS(css);

        if(this.config.addToDOM === "Auto") return;

        this.addToDOM();
    }
}

const stylesheet = new StyloSwift();

stylesheet.addCSSToDOM(
    'a',
    {
        'width': '100px',
        'height': '100px'
    },
    'b',
    {
        'width': '100px',
        'height': '100px'
    }
);

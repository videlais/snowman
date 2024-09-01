const { expect } = require('chai');
const getStyles = require("../../lib/Misc/getStyles.js");

// Setup JSDOM
// Require JSDOM
const jsdom = require('jsdom');

// Extract JSDOM from jsdom.
const { JSDOM } = jsdom;

const defaultHTML =  `<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
<tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
<tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata>
<tw-passagedata pid="3" name="Test Passage 3" tags=""><div><p><span>Test</span><p></div></tw-passagedata>
<tw-passagedata pid="4" name="Test Passage 4" tags=""><% print(; %></tw-passagedata>
<tw-passagedata pid="5" name="Test Passage 5" tags="">[[Test Passage]]</tw-passagedata>
<script type="text/twine-javascript">window.scriptRan = true;</script>
<style type="text/twine-css">body { color: blue }</style>
</tw-storydata>`;

// Create a new JSDOM instance.
const dom = new JSDOM(defaultHTML, {url: "https://localhost/", runScripts: "dangerously"});

// Extract window from JSDOM
const window = dom.window;

// Pretend this is a browser setting and define some globals.
// This is not a good idea, but jQuery will not load in Node otherwise!
// https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global
global.window = window;
global.document = window.document;
global.jQuery = global.$ = window.$ = window.jQuery = require('jquery');

describe('getStyles()', function() {

    it('Should return null if no arguments are given', function() {
        expect(getStyles()).to.equal(null);
    });

    it('Should fail on bad URL', function() {
        expect(() => getStyles("./file") ).to.throw;
    });

    it('Should load single CSS file', function() {
        expect(getStyles("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css") ).to.eventually.be.fulfilled;
    });

    it('Should load multiple CSS files', function() {
        expect(getStyles("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css") ).to.eventually.be.fulfilled;
    });
});
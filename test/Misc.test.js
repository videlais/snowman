const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

// Require JSDOM
const jsdom = require('jsdom');
// Extract JSDOM from jsdom
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

// Reset the window before each test.
const resetWindow = function() {
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
  global._ = window._ = require('underscore');
  global.marked = window.marked = require('marked');
};

// Initialize the window global.
resetWindow();

// Load Story and Passage.
const Story = require("../lib/Story.js");
const Passage = require("../lib/Passage.js");

// Load additional functions
require("../lib/Misc.js");

describe('Misc', function() {

    describe('#either()', function() {

        it('Should return nothing when given nothing', function() {

            expect(window.either()).to.equal();

        });

        it('Should non-Array single value', function() {

            expect(window.either(1)).to.equal(1);

        });

        it('Should return value within single Array', function() {

            expect(window.either([1])).to.equal(1);

        });

        it('Should return one of the arguments passed to it', function() {

            expect(window.either("A", "B", "C", "D")).to.be.an('string');

        });

        it('Should return one of the arguments passed to it with arrays', function() {

            expect(window.either("A", "B", "C", "D", ["E", "F"])).to.be.an('string');

        });

    });

    describe('#hasVisited()', function() {

        let storyEl, story;

        beforeEach(function() {
            storyEl = $('tw-storydata');
            story = new Story(storyEl);
            window.story = story;
        });

        it('Should return true if passage id visited', function() {

            window.story.history = [1];
            expect(window.hasVisited(1)).to.equal(true);

        });

        it('Should return false if passage id not visited', function() {

            window.story.history = [];
            expect(window.hasVisited(1)).to.equal(false);

        });

        it('Should return false if passage name not visited', function() {

            window.story.history = [];
            expect(window.hasVisited("Random")).to.equal(false);

        });

        it('Should return true if passage name visited', function() {

            window.story.history = [1];
            expect(window.hasVisited("Test Passage")).to.equal(true);

        });

        it('Should return true if multiple passage names visited', function() {

            window.story.history = [1,4];
            expect(window.hasVisited("Test Passage", "Test Passage 4")).to.equal(true);

        });

        it('Should return false if any multiple passage names not visited', function() {

            window.story.history = [1,4];
            expect(window.hasVisited("Random", "Another")).to.equal(false);

        });

    });

    describe('#visited()', function() {

        before(function() {
        storyEl = $('tw-storydata');
        story = new Story(storyEl);
        window.story = story;
        });

        it('Should return 0 if passage does not exist', function() {

        window.story.history = [1,1];
        expect(window.visited(7)).to.equal(0);

        });

        it('Should return number of passage visits for single id', function() {

        window.story.history = [1,1];
        expect(window.visited(1)).to.equal(2);

        });

        it('Should return number of passage visits for single name', function() {

        window.story.history = [1,1];
        expect(window.visited("Test Passage")).to.equal(2);

        });

        it('Should return lowest number of passage visits for multiple ids', function() {

        window.story.history = [1,1,1,2,2];
        expect(window.visited(1,2)).to.equal(2);

        });

        it('Should return lowest number of passage visits for multiple names', function() {

        window.story.history = [1,1,1,2,2];
        expect(window.visited("Test Passage", "Test Passage 2")).to.equal(2);

        });

    });

    describe('#renderToSelector()', function() {

        before(function() {
        storyEl = $('tw-storydata');
        story = new Story(storyEl);
        window.story = story;
        });

        it('Should do nothing when passed nothing', function() {
        expect(window.renderToSelector() ).to.equal();
        });

        it('Should do nothing when selector does not exist', function() {
        expect(window.renderToSelector(null) ).to.equal();
        });

        it('Should do nothing when selector and passage do not exist', function() {
        expect(window.renderToSelector(null, null) ).to.equal();
        });

        it('Should overwrite HTML content with passage content', function() {
        window.renderToSelector('[name="Test Passage 2"]', "Test Passage");
        expect($('[name="Test Passage 2"]').html()).to.equal("Hello world");
        });

    });

    describe('getStyles()', function() {

        it('Should return Promise', function() {

        expect(window.getStyles() ).to.be.a("Object");

        });

        it('Should fail on bad URL', function() {

        expect(() => window.getStyles("./file") ).to.throw;

        });

        it('Should load single CSS file', function() {

        expect(window.getStyles("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css") ).to.eventually.be.fulfilled;

        });

        it('Should load multiple CSS files', function() {

        expect(window.getStyles("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css") ).to.eventually.be.fulfilled;

        });

    });
});

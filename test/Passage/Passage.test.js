
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

// Require Story.
const Story = require("../../lib/Story.js");

// Require Passage.
const Passage = require("../../lib/Passage.js");

describe("Passage", function() {
    describe("#constructor()", function() {

        it('Should throw error if $ does not exist', function() {

            delete global.$;
            expect(() => { new Passage(); } ).to.throw();
            global.$ = window.$;

        });

        it('Should throw error if _ does not exist', function() {

            delete global._;
            expect(() => { new Passage(); } ).to.throw();
            global._ = window._;

        });

        it('Should throw error if marked does not exist', function() {

            delete global.marked;
            expect(() => { new Passage(); } ).to.throw();
            global.marked = window.marked;

        });

        it('Should contain default values when initialized with no arguments', function() {

            let p = new Passage();
            expect(p.name).to.equal("Default");

        });

    });

    describe("#render()", function() {

        before(function() {

            // Setup a dummy window.story.state
            window.story = {
                state: {}
            };

        });

        it("Should render empty string", function() {

            let p = new Passage();
            expect(p.render("") ).to.equal("");

        });

        it("Should render [[Passage]] into correct link", function() {

            let p = new Passage();
            expect(p.render("[[Passage]]") ).to.equal('<a href="javascript:void(0)" data-passage="Passage">Passage</a>');

        });

        it("Should render [[Passage->Another]] into correct link", function() {

            let p = new Passage();
            expect(p.render("[[Passage->Another]]") ).to.equal('<a href="javascript:void(0)" data-passage="Another">Passage</a>');

        });

        it("Should render [[Passage|Another]] into correct link", function() {

            let p = new Passage();
            expect(p.render("[[Passage|Another]]") ).to.equal('<a href="javascript:void(0)" data-passage="Another">Passage</a>');

        });

        it("Should render [[Passage<-Another]] into correct link", function() {

            let p = new Passage();
            expect(p.render("[[Passage<-Another]]") ).to.equal('<a href="javascript:void(0)" data-passage="Passage">Another</a>');

        });

        it("Should render [[Passage]]{#test} into correct link with ID markup", function() {

            let p = new Passage();
            expect(p.render("[[Passage]]{#test}") ).to.equal('<a href="javascript:void(0)" data-passage="Passage" id="test">Passage</a>');

        });

        it("Should render [[Passage]]{.test} into correct link with CLASS markup", function() {

            let p = new Passage();
            expect(p.render("[[Passage]]{.test}") ).to.equal('<a href="javascript:void(0)" data-passage="Passage" class="test">Passage</a>');

        });

        it("Should render [[Passage]]{.test.test2} into correct link with CLASS markup", function() {

            let p = new Passage();
            expect(p.render("[[Passage]]{.test.test2}") ).to.equal('<a href="javascript:void(0)" data-passage="Passage" class="test test2">Passage</a>');

        });

        it("Should render [[Passage<-Another]]{#test} into correct link", function() {

            let p = new Passage();
            expect(p.render("[[Passage<-Another]]{#test}") ).to.equal('<a href="javascript:void(0)" data-passage="Passage" id="test">Another</a>');

        });

        it("Should render [[Passage<-Another]]{.test} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage<-Another]]{.test}") ).to.equal('<a href="javascript:void(0)" data-passage="Passage" class="test">Another</a>');

        });

        it("Should render [[Passage<-Another]]{.test.test2} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage<-Another]]{.test.test2}") ).to.equal('<a href="javascript:void(0)" data-passage="Passage" class="test test2">Another</a>');

        });

        it("Should render [[Passage<-Another]]{#test} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage<-Another]]{#test}") ).to.equal('<a href="javascript:void(0)" data-passage="Passage" id="test">Another</a>');

        });

        it("Should render [[Passage->Another]]{.test} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage->Another]]{.test}") ).to.equal('<a href="javascript:void(0)" data-passage="Another" class="test">Passage</a>');

        });

        it("Should render [[Passage->Another]]{.test.test2} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage->Another]]{.test.test2}") ).to.equal('<a href="javascript:void(0)" data-passage="Another" class="test test2">Passage</a>');

        });

        it("Should render [[Passage|Another]]{#test} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage|Another]]{#test}") ).to.equal('<a href="javascript:void(0)" data-passage="Another" id="test">Passage</a>');

        });

        it("Should render [[Passage|Another]]{.test} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage|Another]]{.test}") ).to.equal('<a href="javascript:void(0)" data-passage="Another" class="test">Passage</a>');

        });

        it("Should render [[Passage|Another]]{.test.test2} into correct link", function() {

        let p = new Passage();
        expect(p.render("[[Passage|Another]]{.test.test2}") ).to.equal('<a href="javascript:void(0)" data-passage="Another" class="test test2">Passage</a>');

        });

        it("Should render <a-0.class#id> correctly", function() {

        let p = new Passage();
        expect(p.render("<a-0.class#id>") ).to.equal('<a style="display:none" href="javascript:void(0)" id="id" class="class">');

        });

        it("Should ignore custom elements using a dash in its name", function() {
            
        let p = new Passage();
        expect(p.render("<custom-element>") ).to.equal('<custom-element>');
    
        });

        it("Should passthrough any <script> tags", function() {

        let p = new Passage();
        expect( p.render('<div><script>console.log("Hello world")</script></div>') ).to.equal('<div><script>console.log("Hello world")</script></div>');

        });

        it("Should render in-line markdown: Emphasis", function() {

        let p = new Passage();
        expect( p.render('*Emphasis* or _Emphasis_.') ).to.equal('<em>Emphasis</em> or <em>Emphasis</em>.');

        });

        it("Should render in-line markdown: Strong Emphasis", function() {

        let p = new Passage();
        expect( p.render('**Strong emphasis** or __Strong emphasis__.') ).to.equal('<strong>Strong emphasis</strong> or <strong>Strong emphasis</strong>.');

        });

        it("Should render in-line markdown: Strikethrough", function() {

        let p = new Passage();
        expect( p.render('~~Strikethrough~~') ).to.equal('<del>Strikethrough</del>');

        });

        it("Should render in-line markdown: Header 5", function() {

        let p = new Passage();
        expect( p.render('##### Header 5') ).to.equal('<h5 id="header-5">Header 5</h5>\n');

        });

        it("Should render multi-line markdown: Ordered List", function() {

        let p = new Passage();
        expect (p.render('1. First ordered list item\n2. Another item') ).to.equal('<ol>\n<li>First ordered list item</li>\n<li>Another item</li>\n</ol>\n');

        });

        it("Should render multi-line links correctly", function() {

        let p = new Passage();
        expect (p.render('Rooms:\n- [[Front Room]]\n- [[Back Room]]') ).to.equal('<p>Rooms:</p>\n<ul>\n<li><a href="javascript:void(0)" data-passage="Front Room">Front Room</a></li>\n<li><a href="javascript:void(0)" data-passage="Back Room">Back Room</a></li>\n</ul>\n');

        });

        it("Should not trigger markdown code blocks", function() {

            let p = new Passage();
            window.setup = {};
            window.setup.example = true;
            let test = `<% if(window.setup.example) { %>
                <div>[[Testing]]</div>
            <% } %>`;
            expect( p.render(test).trim() ).to.equal(`<div><a href="javascript:void(0)" data-passage="Testing">Testing</a></div>`);

        });
    });
});

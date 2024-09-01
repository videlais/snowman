const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

const fs = require('fs');
const LZString = require('lz-string');
const exec = require('child-process-promise').exec;

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
  delete global.window;
  delete global.document;
  delete global.$;
  delete global.jQuery;
  delete global._;
  delete global.marked;

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

// Run Story tests
const Story = require("../../lib/Story.js");
// Run Story tests
describe('Story', function() {

  let storyEl;
  let story;

  before(function() {
    resetWindow();
    storyEl = $('tw-storydata');
    story = new Story(storyEl);
  });

  describe("#constructor()", function() {

    it('Should throw error if $ does not exist', function() {

      delete global.$;
      expect(() => { new Story(storyEl); } ).to.throw();
      global.$ = window.$;

    });

    it('Should throw error if _ does not exist', function() {

      delete global._;
      expect(() => { new Story(storyEl); } ).to.throw();
      global._ = window._;

    });

  	it('Should set the story name from the element attribute', function() {
  		expect(story.name).to.equal('Test');
  	});

  	it('Should set the story creator from the element attribute', function() {
  		expect(story.creator).to.equal('jasmine');
  	});

  	it('Should set the story creator version from the element attribute', function() {
  		expect(story.creatorVersion).to.equal('1.2.3');
  	});

    it('Should set startPassage to parseInt(startNode)', function() {
  		expect(story.startPassage).to.equal(1);
  	});

  	it('Should set the story\'s scripts from the element', function() {
  		expect(story.userScripts.length).to.equal(1);
  		expect(story.userScripts[0]).to.equal('window.scriptRan = true;');
  	});

  	it('Should set the story\'s styles from the element', function() {
  		expect(story.userStyles.length).to.equal(1);
  		expect(story.userStyles[0]).to.equal('body { color: blue }');
  	});

  });

  describe("#render()", function() {

    it('Should render a passage by ID', function() {
  		window.story = { state: {} };
  		expect(story.render(1)).to.equal('Hello world');
	  });

    it('Should render a passage by name', function() {
      window.story = { state: {} };
      expect(story.render('Test Passage')).to.equal('Hello world');
    });

    it('Should throw error when name or ID is not found in passages', function() {
      window.story = { state: {} };
      expect(() => { story.render('Not Found') } ).to.throw();
    });

  });

  describe("#passage()", function() {

    it('Should find a passage by ID with passage()', function() {
        expect(story.passage(1).name).to.equal('Test Passage');
    });

    it('Should find a passage by name with passage()', function () {
		    expect(story.passage('Test Passage').name).to.equal('Test Passage');
	  });

    it('Should return null if no passage exists with that ID or name', function () {
		    expect(story.passage('Testing')).to.equal(null);
	  });

  });

  describe("#start()", function() {

    describe("#start() - parsing story JavaScript", function() {

      beforeEach(function() {
        storyEl = $('tw-storydata');
      });

      it('Should run story scripts with start()', function() {
        window.scriptRan = false;
        story.start($('nowhere'));
        expect(window.scriptRan).to.equal(true);
      });
        
      it("Should ignore </script> in a comment", function() {

        // Save previous story JavaScript
        let temp = story.userScripts[0];
        // Replace with new script
        story.userScripts[0] = "//<script></script>";
        // Run the script.
        story.start($('nowhere'));
        // Restore previous story JavaScript.
        story.userScripts[0] = temp;
        // Check if script ran.
        expect(window.scriptRan).to.equal(undefined);
      });

    });

    describe("#start() - adding story styles", function() {

      before(function() {
        storyEl = $('tw-storydata');
        story = new Story(storyEl);
      });
        
        it('Should add story styles with start()', function() {
          var $el = $('<div></div>');
          story.start($el);
          var $styles = $el.find('style');
          expect($styles.length).to.equal(1);
          expect($styles.eq(0).html()).to.equal('body { color: blue }');
        });
  
      });
    });

  describe("#show()", function() {

    it('Should display content in a .passage element with show()', function() {
  		var $el = $('<div></div>');
  		story.start($el);
  		story.show('Test Passage');
  		expect($el.find('.passage').html()).to.equal('Hello world');
  	});

  	it('Should trigger a sm.passage.hidden event when show() is called', function() {
  		var $el = $('<div></div>');
      let eventHappened = false;
  		var passage = story.passage('Test Passage');
  		$el.on('sm.passage.hidden', () => { eventHappened = true; });
  		story.start($el);
  		story.show('Test Passage 2');
  		expect(eventHappened).to.equal(true);
  	});

  	it('Should trigger a sm.passage.showing event when show() is called', function () {
  		var $el = $('<div></div>');
  		let eventHappened = false;
  		var passage = story.passage('Test Passage 2');

  		$el.on('sm.passage.showing', () => { eventHappened = true; });
  		story.start($el);
  		story.show('Test Passage 2');
  		expect(eventHappened).to.equal(true);
  	});

  	it('Should trigger a sm.passage.shown event when show() is called', function () {
  		var $el = $('<div></div>');
  		let eventHappened = false;
  		var passage = story.passage('Test Passage 2');
  		$el.on('sm.passage.shown', () => { eventHappened = true; });
  		story.start($el);
  		story.show('Test Passage 2');
  		expect(eventHappened).to.equal(true);
  	});

    it('Should trigger sm.checkpoint.added when checkpoint() used before show()', function() {

      let $window = $(window);
  		let eventHappened = false;
  		$window.on('sm.checkpoint.added', () => { eventHappened = true });
      story.checkpoint("Test");
  		story.show("Test Passage 2");
  		expect(eventHappened).to.equal(true);

    });

    it('Should render nested HTML into passage element correctly', function() {
  		var $el = $('<div></div>');
  		story.start($el);
  		story.show('Test Passage 3');
      $el.find('.passage').children()[0]
  		expect( $el.find('.passage').children().find("span").text() ).to.equal('Test');
  	});

    it('Should throw error if passage cannot be found', function() {

  		expect( () => { story.show('Test Passage 10') } ).to.throw();

    });

    it('Should trigger error when passage contents malformed JS', function() {

      var $el = $('<div></div>');
  		story.start($el);
      story.show("Test Passage 4");

    });

    it('Should trigger sm.checkpoint.failed during failure', function() {

      let temp = window.history.pushState;
      let temp2 = window.history.replaceState;
      window.history.pushState = null;
      window.history.replaceState = null;
      let $window = $(window);
      let eventHappened = false;
      $window.on('sm.checkpoint.failed', () => { eventHappened = true });
      story.checkpoint("Testing");
      story.show("Test Passage 2", false);
      window.history.pushState = temp;
      window.history.replaceState = temp2;
      expect(eventHappened).to.equal(true);

    });


  });

  describe("#start()", function() {

    it("Should trigger sm.story.started event", function() {

      let eventHappened = false;
      let $win = $(window);
      var $el = $('<div></div>');
      $win.on('sm.story.started', () => { eventHappened = true; });
      story.start($el);
      expect(eventHappened).to.equal(true);

    });

    it("Should trigger popstate change event", function() {

      story.start(storyEl);
      story.show("Test Passage 5");
      let pText = $('.passage').text();
      $('.passage > a').trigger("click");
      window.history.back();
      expect(pText).to.not.equal( $('.passage').text() );

    });

  describe("#checkpoint()", function() {

    it("Should trigger sm.checkpoint.adding event", function() {

      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.checkpoint.adding', () => { eventHappened = true; });
      story.checkpoint();
      expect(eventHappened).to.equal(true);

    });

    it("Should change the document title when passed an argument", function() {

      story.checkpoint("Test");
      expect(document.title).to.equal(story.name + ': Test');

    });

    it("Should set atCheckpoint to be true", function() {

      story.checkpoint("Test");
      expect(story.atCheckpoint).to.equal(true);

    });

  });

  describe("#save()", function() {

    it('Should save the story\'s state to the location hash', function() {

      story.start($('nowhere'));
      let hash = story.saveHash();
      story.save(hash);
      expect(window.location.hash).not.to.equal('');

    });

    it("Should trigger sm.story.saved event", function() {

      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.story.saved', () => { eventHappened = true; });
      let hash = story.saveHash();
      story.save(hash);
      expect(eventHappened).to.equal(true);


    });

  });

  describe("#saveHash()", function() {

    it("Should return correct LZString", function() {

      let testHash = LZString.compressToBase64(JSON.stringify({
  			state: story.state,
  			history: story.history,
  			checkpointName: story.checkpointName
  		}));

      expect( story.saveHash() ).to.equal(testHash);

    });

  });

  describe("#restore()", function(){

    it('Should return false on invalid (non LZString) hash argument', function() {

      expect(story.restore()).to.equal(false);

    });

    it('Should trigger sm.restore.failed event on failure', function() {

      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.restore.failed', () => { eventHappened = true; });
      story.restore();
      expect(eventHappened).to.equal(true);

    });

    it('Should return true upon successful parsing', function() {

      let hash = story.saveHash();
      expect( story.restore(hash) ).to.equal(true);

    });

    it('Should trigger sm.restore.success event upon successful parsing', function() {

      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.restore.success', () => { eventHappened = true; });
      let hash = story.saveHash();
      story.restore(hash);
      expect(eventHappened).to.equal(true);

    });

  });

  });
});
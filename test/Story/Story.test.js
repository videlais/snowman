import { use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { expect } from 'chai';
import LZString from 'lz-string';
import { JSDOM } from 'jsdom';

// Import jQuery
import jquery from 'jquery';
import Story from '../../lib/Story.js';

const defaultHTML =  `<tw-story tags><tw-passage class="passage" aria-live="polite"></tw-passage>
</tw-story><tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
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

global.window = dom.window;
global.document = window.document;
global.$ = jquery(window);

// Reset the window before each test.
const resetWindow = function() {
  // Create a new JSDOM instance.
  const dom = new JSDOM(defaultHTML, {url: "https://localhost/", runScripts: "dangerously"});

  // Pretend this is a browser setting and define some globals.
  // This is not a good idea, but jQuery will not load in Node otherwise!
  // https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global
  global.window = dom.window;
  global.document = window.document;
  global.$ = jquery(window);
};

// Run Story tests
describe('Story', function() {

  describe("#constructor()", function() {

    beforeEach(function() {
      resetWindow();
      global.window.story = new Story();
    });

  	it('Should set the story name from the element attribute', function() {
  		expect(window.story.name).to.equal('Test');
  	});

    it('Should set startPassage to parseInt(startNode)', function() {
  		expect(window.story.startPassage).to.equal(1);
  	});

  	it('Should set the story\'s scripts from the element', function() {
  		expect(window.story.userScripts.length).to.equal(1);
  		expect(window.story.userScripts[0]).to.equal('window.scriptRan = true;');
  	});

  	it('Should set the story\'s styles from the element', function() {
  		expect(window.story.userStyles.length).to.equal(1);
  		expect(window.story.userStyles[0]).to.equal('body { color: blue }');
  	});

  });

  describe("#render()", function() {

    beforeEach(function() {
      resetWindow();
      global.window.story = new Story();
    });

    it('Should render a passage by ID', function() {
  		expect(window.story.render(1)).to.equal('Hello world');
	  });

    it('Should render a passage by name', function() {
      expect(window.story.render('Test Passage')).to.equal('Hello world');
    });

    it('Should throw error when name or ID is not found in passages', function() {
      window.story = { state: {} };
      expect(() => { window.story.render('Not Found') } ).to.throw();
    });

  });

  describe("#passage()", function() {

    beforeEach(function() {
      resetWindow();
      global.window.story = new Story();
    });

    it('Should find a passage by ID with passage()', function() {
        expect(window.story.passage(1).name).to.equal('Test Passage');
    });

    it('Should find a passage by name with passage()', function () {
		    expect(window.story.passage('Test Passage').name).to.equal('Test Passage');
	  });

    it('Should return null if no passage exists with that ID or name', function () {
		    expect(window.story.passage('Testing')).to.equal(null);
	  });

  });

  describe("#start()", function() {

    beforeEach(function() {
      resetWindow();
      global.window.story = new Story();
    });

    describe("#start() - parsing story JavaScript", function() {

      beforeEach(function() {
        resetWindow();
        global.window.story = new Story();
      });

      it('Should run story scripts with start()', function() {
        window.scriptRan = false;
        window.story.start();
        expect(window.scriptRan).to.equal(true);
      });
        
      it("Should ignore </script> in a comment", function() {

        window.story.userScripts = [`// </script>
          window.comment = 1;`];

        window.story.start();
       
        expect(window.comment).to.equal(1);
      });

    });

    describe("#start() - adding story styles", function() {

      before(function() {
        global.window.story = new Story();
      });
        
        it('Should add story styles with start()', function() {
          // start() should add an additional style element to the head
          window.story.start();
          const $styles = $('style');
          expect($styles.length).to.equal(2);
        });
  
      });
  });

  describe("#show()", function() {

    beforeEach(function() {
      resetWindow();
      global.window.story = new Story();
    });

    it('Should throw an error if the passage cannot be found', function() {
      expect(() => { window.story.show('Test Passage 10') }).to.throw();
    });

    it('Should display content in a passage element with show()', function() {
      // call story.show() with the passage name
      window.story.show('Test Passage');
  		expect($('tw-passage').text()).to.equal('Hello world');
  	});

  	it('Should trigger a sm.passage.hidden event when show() is called', function() {
      let eventHappened = false;
  		$('tw-passage').on('sm.passage.hidden', () => { eventHappened = true; });
  		window.story.show('Test Passage 2');
  		expect(eventHappened).to.equal(true);
  	});

  	it('Should trigger a sm.passage.showing event when show() is called', function () {
  		let eventHappened = false;
  		$('tw-passage').on('sm.passage.showing', () => { eventHappened = true; });
  		window.story.show('Test Passage 2');
  		expect(eventHappened).to.equal(true);
  	});

  	it('Should trigger a sm.passage.shown event when show() is called', function () {
  		let eventHappened = false;
  		$('tw-passage').on('sm.passage.shown', () => { eventHappened = true; });
  		window.story.show('Test Passage 2');
  		expect(eventHappened).to.equal(true);
  	});

    it('Should trigger sm.checkpoint.added when checkpoint() used before show()', function() {

      let $window = $(window);
  		let eventHappened = false;
  		$window.on('sm.checkpoint.added', () => { eventHappened = true });
      window.story.checkpoint("Test");
  		window.story.show("Test Passage 2");
  		expect(eventHappened).to.equal(true);
    });

    it('Should render nested HTML into passage element correctly', function() {
  		window.story.show('Test Passage 3');
  		expect( $('.passage').children().find("span").text() ).to.equal('Test');
  	});

    it('Should trigger error when passage contents malformed JS', function() {
      expect(() => { window.story.show("Test Passage 4") }).to.throw();
    });

    it('Should trigger sm.checkpoint.failed during failure', function() {

      let temp = window.history.pushState;
      let temp2 = window.history.replaceState;
      window.history.pushState = null;
      window.history.replaceState = null;
      let $window = $(window);
      let eventHappened = false;
      $window.on('sm.checkpoint.failed', () => { eventHappened = true });
      window.story.checkpoint("Testing");
      window.story.show("Test Passage 2", false);
      window.history.pushState = temp;
      window.history.replaceState = temp2;
      expect(eventHappened).to.equal(true);
    });
  });

  describe("#start()", function() {

    beforeEach(function() {
      resetWindow();
      global.window.story = new Story();
    });

    it("Should trigger sm.story.started event", function() {
      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.story.started', () => { eventHappened = true; });
      window.story.start();
      expect(eventHappened).to.equal(true);
    });

    it("Should trigger popstate change event", function() {
      window.story.start();
      window.story.show("Test Passage 5");
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
      window.story.checkpoint();
      expect(eventHappened).to.equal(true);
    });

    it("Should change the document title when passed an argument", function() {
      window.story.checkpoint("Test");
      expect(document.title).to.equal(window.story.name + ': Test');
    });

    it("Should set atCheckpoint to be true", function() {
      window.story.checkpoint("Test");
      expect(window.story.atCheckpoint).to.equal(true);
    });
  });

  describe("#save()", function() {
    it('Should save the story\'s state to the location hash', function() {
      window.story.start();
      let hash = window.story.saveHash();
      window.story.save(hash);
      expect(window.location.hash).not.to.equal('');
    });

    it("Should trigger sm.story.saved event", function() {
      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.story.saved', () => { eventHappened = true; });
      let hash = window.story.saveHash();
      window.story.save(hash);
      expect(eventHappened).to.equal(true);
    });
  });

  describe("#saveHash()", function() {

    it("Should return correct LZString", function() {

      let testHash = LZString.compressToBase64(JSON.stringify({
  			state: window.story.state,
  			history: window.story.history,
  			checkpointName: window.story.checkpointName
  		}));

      expect( window.story.saveHash() ).to.equal(testHash);

    });

  });

  describe("#restore()", function(){

    it('Should return false on invalid (non LZString) hash argument', function() {
      expect(window.story.restore()).to.equal(false);
    });

    it('Should trigger sm.restore.failed event on failure', function() {
      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.restore.failed', () => { eventHappened = true; });
      window.story.restore();
      expect(eventHappened).to.equal(true);
    });

    it('Should return true upon successful parsing', function() {
      // Visit a single passage to populate the internal history
      window.story.show('Test Passage');
      // Save the state
      let hash = window.story.saveHash();
      // Restore the state
      expect( window.story.restore(hash) ).to.equal(true);
    });

    it('Should trigger sm.restore.success event upon successful parsing', function() {
      // Visit a single passage to populate the internal history
      window.story.show('Test Passage');
      let eventHappened = false;
      let $win = $(window);
      $win.on('sm.restore.success', () => { eventHappened = true; });
      let hash = window.story.saveHash();
      window.story.restore(hash);
      expect(eventHappened).to.equal(true);
    });
  });
  });
});
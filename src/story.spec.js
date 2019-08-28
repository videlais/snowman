var Story = require('./story');
var $ = require('jquery');
var $storyEl = $('<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3"><tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata><tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata><tw-passagedata pid="3" name="Script" tags=""><div><script>console.log("Hello world")</script></div></tw-passagedata><script type="text/twine-javascript">window.scriptRan = true;</script><style type="text/twine-css">body { color: blue }</style></tw-storydata>');
var story = new Story($storyEl);

describe('#Story()', function() {

	it('Should contain story name from the element attribute', function() {
		expect(story.name).toBe('Test');
	});

	it('Should contain the starting passage ID', function() {
		expect(story.startPassage).toBe(1);
	});

	it('Should contain story creator from the element attribute', function() {
		expect(story.creator).toBe('jasmine');
	});

	it('Should contain story creator version from the element attribute', function() {
		expect(story.creatorVersion).toBe('1.2.3');
	});

	it('Should set the story scripts from the element', function() {
		expect(story.userScripts.length).toBe(1);
		expect(story.userScripts[0]).toBe('window.scriptRan = true;');
	});

	it('Should set the story styles from the element', function() {
		expect(story.userStyles.length).toBe(1);
		expect(story.userStyles[0]).toBe('body { color: blue }');
	});

	it('Should have an empty history', function() {
		expect(story.history.length).toBe(0);
	});

	it('Should have an empty state upon creation', function() {
		expect(Object.keys(story.state).length ).toBe(0);
	});

	it('Should have an empty checkpointName', function() {
		expect(story.checkpointName).toBe('');
	});

	it('Should have ignoreErrors set to false', function() {
		expect(story.ignoreErrors).toBe(false);
	});

	it('Should set an initial error message', function() {
		expect(story.errorMessage).toBe('\u26a0 %s');
	});

	it('Should set atCheckpoint to false on start', function() {
		expect(story.atCheckpoint).toBe(false);
	});

	it('Should have correct number of passages', function() {
		expect(story.passages.length).toBe(4);
	});

	it('Should have loaded user scripts', function() {
		expect(story.userScripts.length).toBe(1);
	});

	it('Should have loaded user styles', function() {
		expect(story.userStyles.length).toBe(1);
	});

});

describe('#passage()', function() {

	it('Should look up a passage by ID with passage()', function() {
		expect(story.passage(1).name).toBe('Test Passage');
	});

	it('Should look up a passage by name with passage()', function () {
		expect(story.passage('Test Passage').name).toBe('Test Passage');
	});

});

describe('#render()', function() {

	it('Should render a passage by ID with render()', function() {
		window.story = { state: {} };
		expect(story.render(1)).toBe('<p>Hello world</p>\n');
	});

	it('Should set ARIA attributes on the DOM element it renders to', function() {
		var $el = $('<div></div>');

		story.start($el);
		expect($el.find('.passage').attr('aria-live')).toBe('polite');
	});

	it('Should render a passage by ID with render()', function() {
		window.story = { state: {} };
		expect(story.render('Test Passage')).toBe('<p>Hello world</p>\n');
	});

	it('Should pass <script> tags', function() {
		expect(story.render("Script")).toBe('<div><script>console.log("Hello world")</script></div>');
	});

});

describe('#start()', function() {

	it('Should run story scripts with start()', function() {
		window.scriptRan = false;
		story.start($('<div startnode="1"></div>'));
		expect(window.scriptRan).toBe(true);
	});

	it('Should add story styles with start()', function() {
		var $el = $('<div startnode="1"></div>');

		story.start($el);

		var $styles = $el.find('style');

		expect($styles.length).toBe(1);
		expect($styles.eq(0).html()).toBe('body { color: blue }');
	});

	it('Should trigger a start.sm.story event with start()', function() {
		var $el = $('<div startnode="1"></div>');
		var eventListener = jasmine.createSpy();

		$(window).on('start.sm.story', eventListener);
		story.start($el);
		expect(eventListener.calls.mostRecent().args[1].story).toBe(story);
	});

});

describe('#save()', function() {

	it('Should save the story\'s state to the location hash with save()', function() {
		story.start($('<div startnode="1"></div>'));
		story.save();
		expect(window.location.hash).not.toBe('');
	});

});

describe('#show()', function() {

	it('Should display content in a .passage element with show()', function() {
		var $el = $('<div startnode="1"></div>');

		story.start($el);
		story.show('Test Passage');
		expect($el.find('.passage').html()).toBe('<p>Hello world</p>\n');
	});

	it('Should trigger a hide.sm.passage event when show() is called', function() {
		var $el = $('<div startnode="1"></div>');
		var eventListener = jasmine.createSpy();
		var passage = story.passage('Test Passage');

		$(window).on('hide.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		expect(eventListener.calls.mostRecent().args[1].passage).toBe(passage);
	});

	it('Should trigger a show.sm.passage event when show() is called', function () {
		var $el = $('<div startnode="1"></div>');
		var eventListener = jasmine.createSpy();
		var passage = story.passage('Test Passage 2');

		$(window).on('show.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		expect(eventListener.calls.mostRecent().args[1].passage).toBe(passage);
	});

	it('Should trigger a shown.sm.passage event when show() is called', function () {
		var $el = $('<div startnode="1"></div>');
		var eventListener = jasmine.createSpy();
		var passage = story.passage('Test Passage 2');

		$(window).on('shown.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		expect(eventListener.calls.mostRecent().args[1].passage).toBe(passage);
	});

});

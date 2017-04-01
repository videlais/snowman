var Story = require('./story');
var $ = require('jquery');
var $storyEl = $('<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3"><tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata><tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata></tw-passagedata><script type="text/twine-javascript">window.scriptRan = true;</script><style type="text/twine-css">body { color: blue }</style></script></tw-storydata>');
var story = new Story($storyEl);

describe('Story', function() {
	it('sets the story name from the element attribute', function() {
		expect(story.name).toBe('Test');
	});

	it('sets the story creator from the element attribute', function() {
		expect(story.creator).toBe('jasmine');
	});

	it('sets the story creator version from the element attribute', function() {
		expect(story.creatorVersion).toBe('1.2.3');
	});

	it('sets the story\'s scripts from the element', function() {
		expect(story.userScripts.length).toBe(1);
		expect(story.userScripts[0]).toBe('window.scriptRan = true;');
	});

	it('sets the story\'s styles from the element', function() {
		expect(story.userStyles.length).toBe(1);
		expect(story.userStyles[0]).toBe('body { color: blue }');
	});

	it('looks up a passage by ID with passage()', function() {
		expect(story.passage(1).name).toBe('Test Passage');
	});

	it('looks up a passage by name with passage()', function () {
		expect(story.passage('Test Passage').name).toBe('Test Passage');
	});

	it('renders a passage by ID with render()', function() {
		window.story = { state: {} };
		expect(story.render(1)).toBe('<p>Hello world</p>\n');
	});

	it('sets ARIA attributes on the DOM element it renders to', function() {
		var $el = $('<div></div>');

		story.start($el);
		expect($el.find('.passage').attr('aria-live')).toBe('polite');
	});

	it('renders a passage by ID with render()', function() {
		window.story = { state: {} };
		expect(story.render('Test Passage')).toBe('<p>Hello world</p>\n');
	});

	it('saves the story\'s state to the location hash with save()', function() {
		story.start($('nowhere'));
		story.save();
		expect(window.location.hash).not.toBe('');
	});

	it('runs story scripts with start()', function() {
		window.scriptRan = false;
		story.start($('nowhere'));
		expect(window.scriptRan).toBe(true);
	});

	it('adds story styles with start()', function() {
		var $el = $('<div></div>');

		story.start($el);

		var $styles = $el.find('style');

		expect($styles.length).toBe(1);
		expect($styles.eq(0).html()).toBe('body { color: blue }');
	});

	it('triggers a start.sm.story event with start()', function() {
		var $el = $('<div></div>');
		var eventListener = jasmine.createSpy();

		$el.on('start.sm.story', eventListener);
		story.start($el);
		expect(eventListener.calls.mostRecent().args[1].story).toBe(story);
	});

	it('displays content in a .passage element with show()', function() {
		var $el = $('<div></div>');

		story.start($el);
		story.show('Test Passage');
		expect($el.find('.passage').html()).toBe('<p>Hello world</p>\n');
	});

	it('triggers a hide.sm.passage event when show() is called', function() {
		var $el = $('<div></div>');
		var eventListener = jasmine.createSpy();
		var passage = story.passage('Test Passage');

		$el.on('hide.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		expect(eventListener.calls.mostRecent().args[1].passage).toBe(passage);
	});

	it('triggers a show.sm.passage event when show() is called', function () {
		var $el = $('<div></div>');
		var eventListener = jasmine.createSpy();
		var passage = story.passage('Test Passage 2');

		$el.on('show.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		expect(eventListener.calls.mostRecent().args[1].passage).toBe(passage);
	});

	it('triggers a shown.sm.passage event when show() is called', function () {
		var $el = $('<div></div>');
		var eventListener = jasmine.createSpy();
		var passage = story.passage('Test Passage 2');

		$el.on('shown.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		expect(eventListener.calls.mostRecent().args[1].passage).toBe(passage);
	});

	it('restores state stored in the location hash with start()');
	it('restores a previous hash with restore()');
});
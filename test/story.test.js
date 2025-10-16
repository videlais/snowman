import Story from '../src/story.js';
import $ from 'jquery';

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

	it('Should handle stories with no passages gracefully', function() {
		var emptyStoryEl = $('<tw-storydata name="Empty" startnode="1"></tw-storydata>');
		var emptyStory = new Story(emptyStoryEl);
		var $el = $('<div></div>');
		
		// This should not throw an error
		expect(function() {
			emptyStory.start($el);
		}).not.toThrow();
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
		var eventListener = jest.fn();

		$(window).on('start.sm.story', eventListener);
		story.start($el);
		expect(eventListener.mock.calls[eventListener.mock.calls.length - 1][1].story).toBe(story);
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
		var eventListener = jest.fn();
		var passage = story.passage('Test Passage');

		$(window).on('hide.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		var lastCall = eventListener.mock.calls[eventListener.mock.calls.length - 1];
		expect(lastCall[1].passage).toBe(passage);
	});

	it('Should trigger a show.sm.passage event when show() is called', function () {
		var $el = $('<div startnode="1"></div>');
		var eventListener = jest.fn();
		var passage = story.passage('Test Passage 2');

		$(window).on('show.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		var lastCall = eventListener.mock.calls[eventListener.mock.calls.length - 1];
		expect(lastCall[1].passage).toBe(passage);
	});

	it('Should trigger a shown.sm.passage event when show() is called', function () {
		var $el = $('<div startnode="1"></div>');
		var eventListener = jest.fn();
		var passage = story.passage('Test Passage 2');

		$(window).on('shown.sm.passage', eventListener);
		story.start($el);
		story.show('Test Passage 2');
		var lastCall = eventListener.mock.calls[eventListener.mock.calls.length - 1];
		expect(lastCall[1].passage).toBe(passage);
	});

});

describe('Error handling', function() {

	let originalOnerror;
	
	beforeEach(function() {
		originalOnerror = window.onerror;
	});
	
	afterEach(function() {
		window.onerror = originalOnerror;
	});

	it('Should handle JavaScript errors when ignoreErrors is false', function() {
		var testStoryEl = $('<tw-storydata name="Test" startnode="1"><tw-passagedata pid="1" name="Test">Test</tw-passagedata></tw-storydata>');
		var testStory = new Story(testStoryEl);
		var $el = $('<div></div>');
		testStory.start($el);
		
		// Trigger an error through the story's error handler
		testStory.$passageEl.html('initial content');
		window.onerror('Test error', 'test.js', 123);
		
		expect($el.find('.passage').html()).toContain('Test error (test.js: 123)');
	});

	it('Should ignore JavaScript errors when ignoreErrors is true', function() {
		var testStoryEl = $('<tw-storydata name="Test" startnode="1"><tw-passagedata pid="1" name="Test">Test</tw-passagedata></tw-storydata>');
		var testStory = new Story(testStoryEl);
		var $el = $('<div></div>');
		testStory.ignoreErrors = true;
		testStory.start($el);
		
		// Set initial content
		testStory.$passageEl.html('original content');
		
		// Trigger an error
		window.onerror('Test error', 'test.js', 123);
		
		// Content should remain unchanged
		expect($el.find('.passage').html()).toBe('original content');
	});

	it('Should handle errors without URL information', function() {
		var testStoryEl = $('<tw-storydata name="Test" startnode="1"><tw-passagedata pid="1" name="Test">Test</tw-passagedata></tw-storydata>');
		var testStory = new Story(testStoryEl);
		var $el = $('<div></div>');
		testStory.start($el);
		
		// Set initial content first
		testStory.$passageEl.html('initial content');
		
		// Trigger an error without URL
		window.onerror('Simple error', null, null);
		
		expect($el.find('.passage').html()).toContain('Simple error');
	});

	it('Should set up error handler during start', function() {
		var $el = $('<div></div>');
		var originalOnerror = window.onerror;
		
		story.start($el);
		
		// Verify that window.onerror was set up
		expect(window.onerror).not.toBe(originalOnerror);
		expect(typeof window.onerror).toBe('function');
	});



});

describe('History and state management', function() {

	it('Should set up popstate event handler during start', function() {
		var $el = $('<div></div>');
		
		// Test that the popstate handler is set up
		var popstateHandlers = $._data($(window)[0], 'events');
		var initialHandlers = popstateHandlers ? popstateHandlers.popstate.length : 0;
		
		story.start($el);
		
		popstateHandlers = $._data($(window)[0], 'events');
		var finalHandlers = popstateHandlers ? popstateHandlers.popstate.length : 0;
		
		expect(finalHandlers).toBeGreaterThan(initialHandlers);
	});

	it('Should handle popstate event logic with valid state data', function() {
		var testStoryEl = $('<tw-storydata name="Test" startnode="1"><tw-passagedata pid="1" name="Start">Start</tw-passagedata><tw-passagedata pid="2" name="Second">Second</tw-passagedata></tw-storydata>');
		var testStory = new Story(testStoryEl);
		var $el = $('<div></div>');
		
		testStory.start($el);
		
		// Mock a state object that would come from browser history
		var mockState = {
			state: { testVar: 'value' },
			history: [2],
			checkpointName: 'test'
		};
		
		// Spy on show method to track calls
		const showSpy = jest.spyOn(testStory, 'show');
		
		// Manually trigger the popstate logic by directly accessing the stored event handler
		var popstateHandlers = $._data($(window)[0], 'events').popstate;
		var storyHandler = popstateHandlers.find(handler =>
			handler.handler.toString().includes('this.state = state.state')
		);
		
		if (storyHandler) {
			// Create a mock event object
			var mockEvent = {
				originalEvent: { state: mockState }
			};
			
			// Call the handler with proper context
			storyHandler.handler.call(testStory, mockEvent);
			
			// Verify the state was updated
			expect(testStory.state.testVar).toBe('value');
			expect(testStory.history).toEqual([2]);
			expect(testStory.checkpointName).toBe('test');
			expect(showSpy).toHaveBeenCalledWith(2, true);
		}
		
		showSpy.mockRestore();
	});

});

describe('Link handling', function() {

	it('Should handle clicks on passage links', function() {
		var $el = $('<div></div>');
		story.start($el);
		
		// Add a link to the passage
		story.$passageEl.html('<a data-passage="Test Passage 2">Link text</a>');
		
		// Spy on the show method
		const showSpy = jest.spyOn(story, 'show');
		
		// Click the link
		story.$passageEl.find('a[data-passage]').click();
		
		expect(showSpy).toHaveBeenCalledWith('Test Passage 2');
		
		showSpy.mockRestore();
	});

	it('Should handle clicks on nested elements within passage links', function() {
		var $el = $('<div></div>');
		story.start($el);
		
		// Add a link with nested content
		story.$passageEl.html('<a data-passage="Test Passage 2"><span>Nested content</span></a>');
		
		// Spy on the show method
		const showSpy = jest.spyOn(story, 'show');
		
		// Click the nested span
		story.$passageEl.find('span').click();
		
		expect(showSpy).toHaveBeenCalledWith('Test Passage 2');
		
		showSpy.mockRestore();
	});

});

describe('Hash change handling', function() {

	it('Should handle hash changes and attempt restore', function() {
		var $el = $('<div></div>');
		story.start($el);
		
		// Spy on the restore method
		const restoreSpy = jest.spyOn(story, 'restore');
		
		// Change the hash
		window.location.hash = 'test-hash';
		
		// Trigger hashchange event
		$(window).trigger('hashchange');
		
		expect(restoreSpy).toHaveBeenCalledWith('test-hash');
		
		restoreSpy.mockRestore();
		window.location.hash = '';
	});

});

describe('#checkpoint()', function() {

	it('Should set checkpoint with name', function() {
		story.checkpoint('test checkpoint');
		
		expect(story.checkpointName).toBe('test checkpoint');
		expect(story.atCheckpoint).toBe(true);
		expect(document.title).toBe('Test: test checkpoint');
	});

	it('Should set checkpoint without name', function() {
		story.checkpoint();
		
		expect(story.checkpointName).toBe('');
		expect(story.atCheckpoint).toBe(true);
	});

	it('Should trigger add.sm.checkpoint event', function() {
		var eventListener = jest.fn();
		$(window).on('add.sm.checkpoint', eventListener);
		
		story.checkpoint('test checkpoint');
		
		var lastCall = eventListener.mock.calls[eventListener.mock.calls.length - 1];
		expect(lastCall[1].name).toBe('test checkpoint');
		
		$(window).off('add.sm.checkpoint', eventListener);
	});

});

describe('#saveHash() and #restore()', function() {

	beforeEach(function() {
		story.state = { testVar: 'testValue' };
		story.history = [1, 2];
		story.checkpointName = 'test checkpoint';
	});

	it('Should generate a hash from current state', function() {
		var hash = story.saveHash();
		expect(hash).toBeTruthy();
		expect(typeof hash).toBe('string');
	});

	it('Should restore state from valid hash', function() {
		var hash = story.saveHash();
		
		// Clear current state
		story.state = {};
		story.history = [];
		story.checkpointName = '';
		
		var result = story.restore(hash);
		
		expect(result).toBe(true);
		expect(story.state.testVar).toBe('testValue');
		expect(story.history).toEqual([1, 2]);
		expect(story.checkpointName).toBe('test checkpoint');
	});

	it('Should trigger restore events', function() {
		var restoreListener = jest.fn();
		var restoredListener = jest.fn();
		
		$(window).on('restore.sm.story', restoreListener);
		$(window).on('restored.sm.story', restoredListener);
		
		var hash = story.saveHash();
		story.restore(hash);
		
		expect(restoreListener).toHaveBeenCalled();
		expect(restoredListener).toHaveBeenCalled();
		
		$(window).off('restore.sm.story', restoreListener);
		$(window).off('restored.sm.story', restoredListener);
	});

	it('Should handle invalid hash and trigger restorefail event', function() {
		var failListener = jest.fn();
		$(window).on('restorefail.sm.story', failListener);
		
		var result = story.restore('invalid-hash');
		
		expect(result).toBe(false);
		expect(failListener).toHaveBeenCalled();
		
		$(window).off('restorefail.sm.story', failListener);
	});

});

describe('Error conditions', function() {

	it('Should throw error when showing non-existent passage', function() {
		expect(function() {
			story.show('NonExistent Passage');
		}).toThrow('There is no passage with the ID or name "NonExistent Passage"');
	});

	it('Should throw error when rendering non-existent passage', function() {
		expect(function() {
			story.render('NonExistent Passage');
		}).toThrow('There is no passage with the ID or name NonExistent Passage');
	});

});

describe('Browser history integration', function() {

	it('Should handle history.pushState failure gracefully', function() {
		var $el = $('<div></div>');
		story.start($el);
		
		// Mock pushState to throw an error
		const originalPushState = window.history.pushState;
		window.history.pushState = jest.fn().mockImplementation(() => {
			throw new Error('Security error');
		});
		
		var failListener = jest.fn();
		$(window).on('fail.sm.checkpoint', failListener);
		
		story.checkpoint('test');
		story.show('Test Passage 2');
		
		expect(failListener).toHaveBeenCalled();
		
		// Restore original pushState
		window.history.pushState = originalPushState;
		$(window).off('fail.sm.checkpoint', failListener);
	});

	it('Should handle history.replaceState failure gracefully', function() {
		var $el = $('<div></div>');
		story.start($el);
		
		// Mock replaceState to throw an error
		const originalReplaceState = window.history.replaceState;
		window.history.replaceState = jest.fn().mockImplementation(() => {
			throw new Error('Security error');
		});
		
		var failListener = jest.fn();
		$(window).on('fail.sm.checkpoint', failListener);
		
		// Reset checkpoint state to false to trigger replaceState path
		story.atCheckpoint = false;
		story.show('Test Passage 2');
		
		expect(failListener).toHaveBeenCalled();
		
		// Restore original replaceState
		window.history.replaceState = originalReplaceState;
		$(window).off('fail.sm.checkpoint', failListener);
	});

});
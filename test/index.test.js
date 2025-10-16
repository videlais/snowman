describe('Bootstrap', function() {

	it('Should make jQuery globally available', function() {
		expect(window.jQuery).toBeDefined();
	});

	it('Should make $ globally available', function() {
		expect(window.$).toBeDefined();
	});

	it('Should make Underscore globally available', function () {
		expect(window._).toBeDefined();
	});

	it('Should make Marked globally available', function () {
		expect(window.marked).toBeDefined();
	});

	it('Should make Story globally available', function () {
		expect(window.Story).toBeDefined();
	});

	it('Should make Passage globally available', function () {
		expect(window.Passage).toBeDefined();
	});

	it('Should load element that does not exist', function() {
		window.story = new Story($('<div startnode="1"></div>'));
		expect(window.story instanceof Story);
	});

	it('Should load <tw-storydata> element', function() {
		var $storyEl = $('<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3"><tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata><tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata><tw-passagedata pid="3" name="Script" tags=""><div><script>console.log("Hello world")</script></div></tw-passagedata><script type="text/twine-javascript">window.scriptRan = true;</script><style type="text/twine-css">body { color: blue }</style></tw-storydata><tw-story>');
		window.story = new Story($storyEl);
		expect(story.name).toBe('Test');
	});

	it('Should initialize story from DOM when ready', function() {
		// Add a tw-storydata element to the DOM for testing
		var $storyData = $('<tw-storydata name="DOMTest" startnode="1"><tw-passagedata pid="1" name="Start">Test content</tw-passagedata></tw-storydata>');
		var $main = $('<div id="main"></div>');
		
		$('body').append($storyData).append($main);
		
		// The code in index.js should run on DOM ready
		// Since we can't easily test the actual DOM ready event in Jest,
		// we'll test the equivalent functionality directly
		var testStory = new window.Story($('tw-storydata'));
		testStory.start($('#main'));
		
		expect(testStory).toBeInstanceOf(window.Story);
		expect(testStory.name).toBe('DOMTest');
		
		// Clean up
		$storyData.remove();
		$main.remove();
	});

	it('Should handle DOM ready callback execution', function() {
		// Test that the DOM ready callback would execute the story initialization
		var originalStory = window.story;
		
		// Mock tw-storydata and main elements
		var $mockStoryData = $('<tw-storydata name="ReadyTest" startnode="1"><tw-passagedata pid="1" name="Start">Content</tw-passagedata></tw-storydata>');
		var $mockMain = $('<div id="main"></div>');
		
		$('body').append($mockStoryData).append($mockMain);
		
		// Simulate what index.js does in the DOM ready callback
		window.story = new window.Story($('tw-storydata'));
		
		expect(window.story).toBeInstanceOf(window.Story);
		expect(window.story.name).toBe('ReadyTest');
		
		// Test that start method can be called
		expect(() => {
			window.story.start($('#main'));
		}).not.toThrow();
		
		// Clean up
		window.story = originalStory;
		$mockStoryData.remove();
		$mockMain.remove();
	});

});
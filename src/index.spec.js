describe('The bootstrap', function() {
	it('makes jQuery globally available', function() {
		expect(window.jQuery).toBeDefined();
		expect(window.$).toBeDefined();
	});

	it('makes Underscore globally available', function () {
		expect(window._).toBeDefined();
	});

	it('makes Marked globally available', function () {
		expect(window.marked).toBeDefined();
	});

	it('makes Story globally available', function () {
		expect(window.Story).toBeDefined();
	});

	it('makes Passage globally available', function () {
		expect(window.Passage).toBeDefined();
	});

	it('can load element that does not exist', function() {
		window.story = new Story($('element'));
		expect(window.story instanceof Story);
	});

	it('can load <tw-storydata> element', function() {

		var $storyEl = $('<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3"><tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata><tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata><tw-passagedata pid="3" name="Script" tags=""><div><script>console.log("Hello world")</script></div></tw-passagedata><script type="text/twine-javascript">window.scriptRan = true;</script><style type="text/twine-css">body { color: blue }</style></tw-storydata><tw-story><div id="main"></div>');
		window.story = new Story($storyEl);
		expect(story.name).toBe('Test');

	});

	it('can start #main element', function() {

		var $storyEl = $('<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3"><tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata><tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata><tw-passagedata pid="3" name="Script" tags=""><div><script>console.log("Hello world")</script></div></tw-passagedata><script type="text/twine-javascript">window.scriptRan = true;</script><style type="text/twine-css">body { color: blue }</style></tw-storydata><tw-story><div id="main"></div>');
		window.story = new Story($storyEl);
		window.story.start($('#main'));
		expect(story.passage(1).name).toBe('Test Passage');

	});

});

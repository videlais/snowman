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

});

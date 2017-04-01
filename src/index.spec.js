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

	it('loads the story stored in <tw-storydata> and starts it');
});
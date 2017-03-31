var Passage = require('./passage');

describe('Passage', function() {
	it('offers a static render function', function() {
		expect(typeof Passage.render).toBe('function');
	});

	it('sets an id with its constructor', function() {
		var p = new Passage(123);
		expect(p.id).toBe(123);
	});

	it('sets a name with its constructor', function () {
		var p = new Passage(null, 'The Quick Brown Fox');
		expect(p.name).toBe('The Quick Brown Fox');
	});

	it('sets tags with its constructor', function () {
		var p = new Passage(null, null, ['red', 'blue']);
		expect(p.tags.length).toBe(2);
		expect(p.tags[0]).toBe('red');
		expect(p.tags[1]).toBe('blue');
	});

	it('sets source with its constructor', function () {
		var p = new Passage(null, null, null, 'Hello world');
		expect(p.source).toBe('Hello world');
	});

	it('renders Markdown', function() {
		var p = new Passage();
		p.source = 'Hello _there_.';

		/* Needs to be stubbed. */
		window.story = { state: {} };
		expect(p.render()).toBe('<p>Hello <em>there</em>.</p>\n');
	});
});
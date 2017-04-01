var Passage = require('./passage');
var $ = require('jquery');

describe('Passage', function() {
	beforeEach(function() {
		if (!window.story) {
			window.story = { fake: true, state: {} };
		}
	});

	afterEach(function() {
		if (window.story.fake) {
			window.story = undefined;
		}
	});

	it('offers a static render function', function() {
		expect(typeof Passage.render).toBe('function');
	});

	it('sets an id with its constructor', function() {
		var p = new Passage(123);

		expect(p.id).toBe(123);
	});

	it('sets a name with its constructor', function() {
		var p = new Passage(null, 'The Quick Brown Fox');

		expect(p.name).toBe('The Quick Brown Fox');
	});

	it('sets tags with its constructor', function() {
		var p = new Passage(null, null, ['red', 'blue']);

		expect(p.tags.length).toBe(2);
		expect(p.tags[0]).toBe('red');
		expect(p.tags[1]).toBe('blue');
	});

	it('sets source with its constructor', function() {
		var p = new Passage(null, null, null, 'Hello world');

		expect(p.source).toBe('Hello world');
	});

	it('renders with render() method', function() {
		var p = new Passage(null, null, null, 'Hello world');

		expect(typeof p.render).toBe('function');
		expect(p.render()).toBe('<p>Hello world</p>\n');
	});

	it('renders Markdown', function() {
		expect(Passage.render('Hello _there_.'))
			.toBe('<p>Hello <em>there</em>.</p>\n');
	});

	it('renders [[basic links]]', function() {
		var $out = $(Passage.render('[[A link]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('A link');
	});

	it('renders [[pipe|links]]', function() {
		var $out = $(Passage.render('[[Displayed|A link]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('renders [[links|to URLs]]', function() {
		var $out = $(Passage.render('[[Displayed|https://twinery.org]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).attr('href')).toBe('https://twinery.org');
		expect($link.eq(0).data('passage')).toBe(undefined);
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('renders [[arrow->links]]', function() {
		var $out = $(Passage.render('[[Displayed->A link]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('renders [[links->to URLs]]', function() {
		var $out = $(Passage.render('[[Displayed->https://twinery.org]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).attr('href')).toBe('https://twinery.org');
		expect($link.eq(0).data('passage')).toBe(undefined);
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('renders [[arrow<-links]]', function() {
		var $out = $(Passage.render('[[A link<-Displayed]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('renders [[URL<-links]]', function() {
		var $out = $(Passage.render('[[https://twinery.org<-Displayed]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).attr('href')).toBe('https://twinery.org');
		expect($link.eq(0).data('passage')).toBe(undefined);
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('renders EJS tags', function() {
		expect(Passage.render('<% print("Hello") %>')).toBe('<p>Hello</p>\n');
	});

	it('renders <.class#id>s on a line by itself as <div> tags', function() {
		expect(Passage.render('<.class#id>\nInside\n</>'))
			.toBe('<div id="id" class="class">\nInside\n</div>');

		expect(Passage.render('<.class#id>\rInside\r</>'))
			.toBe('<div id="id" class="class">\nInside\n</div>');
	});

	it('renders <.class#id>s in text as <span> tags', function() {
		expect(Passage.render('<.class#id>Inside</>'))
			.toBe('<p><span id="id" class="class">Inside</span></p>\n');
	});

	it('nests <div> shorthands properly', function() {
		expect(Passage.render('<.class>\n<.subclass>\nInside\n</>\n</>'))
			.toBe('<div class="class">\n<div class="subclass">\nInside\n</div>\n</div>');
	});

	it('nests <span> shorthands properly', function() {
		expect(Passage.render('<.class><.subclass>Inside</></>'))
			.toBe('<p><span class="class"><span class="subclass">Inside</span></span></p>\n');
	});

	it('nests <span> shorthands inside <div> shorthands properly', function () {
		expect(Passage.render('<.class>\n<.subclass>Inside</>\n</>'))
			.toBe('<div class="class">\n<span class="subclass">Inside</span>\n</div>');
	});
	
	it('renders a shorthand starting with - as hidden', function() {
		var $result = $(Passage.render('<-.class>Inside</>')).find('.class');

		expect($result.length).toBe(1);
		expect($result.css('display')).toBe('none');

		/*
		Don't need to search for the element as it will be at the very top.
		*/

		$result = $(Passage.render('<-.class>\nInside\n</>'));

		expect($result.prop('nodeName')).toBe('DIV');
		expect($result.css('display')).toBe('none');
	});
});
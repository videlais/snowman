import Passage from '../src/passage.js';
import $ from 'jquery';

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

	it('Should offer a static render function', function() {
		expect(typeof Passage.render).toBe('function');
	});

	it('Should set an id with its constructor', function() {
		var p = new Passage(123);

		expect(p.id).toBe(123);
	});

	it('Should set a name with its constructor', function() {
		var p = new Passage(null, 'The Quick Brown Fox');

		expect(p.name).toBe('The Quick Brown Fox');
	});

	it('Should set tags with its constructor', function() {
		var p = new Passage(null, null, ['red', 'blue']);

		expect(p.tags.length).toBe(2);
		expect(p.tags[0]).toBe('red');
		expect(p.tags[1]).toBe('blue');
	});

	it('Should set source with its constructor', function() {
		var p = new Passage(null, null, null, 'Hello world');

		expect(p.source).toBe('Hello world');
	});

	it('Should render with render() method', function() {
		var p = new Passage(null, null, null, 'Hello world');

		expect(typeof p.render).toBe('function');
		expect(p.render()).toBe('<p>Hello world</p>\n');
	});

	it('Should render Markdown', function() {
		expect(Passage.render('Hello _there_.'))
			.toBe('<p>Hello <em>there</em>.</p>\n');
	});

	it('Should render [[basic links]]', function() {
		var $out = $(Passage.render('[[A link]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('A link');
	});

	it('Should render [[pipe|links]]', function() {
		var $out = $(Passage.render('[[Displayed|A link]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('Should render [[links|to URLs]]', function() {
		var $out = $(Passage.render('[[Displayed|https://twinery.org]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).attr('href')).toBe('https://twinery.org');
		expect($link.eq(0).data('passage')).toBe(undefined);
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('Should render [[arrow->links]]', function() {
		var $out = $(Passage.render('[[Displayed->A link]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('Should render [[links->to URLs]]', function() {
		var $out = $(Passage.render('[[Displayed->https://twinery.org]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).attr('href')).toBe('https://twinery.org');
		expect($link.eq(0).data('passage')).toBe(undefined);
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('Should render [[arrow<-links]]', function() {
		var $out = $(Passage.render('[[A link<-Displayed]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).data('passage')).toBe('A link');
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('Should render [[URL<-links]]', function() {
		var $out = $(Passage.render('[[https://twinery.org<-Displayed]]'));
		var $link = $out.find('a');

		expect($link.length).toBe(1);
		expect($link.eq(0).attr('href')).toBe('https://twinery.org');
		expect($link.eq(0).data('passage')).toBe(undefined);
		expect($link.eq(0).text()).toBe('Displayed');
	});

	it('Should render EJS tags', function() {
		expect(Passage.render('<% print("Hello") %>')).toBe('<p>Hello</p>\n');
	});

	it('Should pass window.story.state as a s property to EJS', function() {
		window.story = { state: { color: 'red' }};
		expect(Passage.render('<div><%= s.color %></div>')).toBe('<div>red</div>');
	});

	it('Should pass through jQuery to EJS', function() {
		$('body').append('<div class="target">passed</div>');
		expect(Passage.render('<div><%= $(".target").text() %></div>'))
			.toBe('<div>passed</div>');
	});

	it('Should delay functions run via $ until a shown.sm.passage event is triggered', function() {
		window.passed = false;

		$('body').append(Passage.render('<% $(function() { window.passed = true; }) %>'));
		$('body').trigger('shown.sm.passage');
		expect(window.passed).toBe(true);
	});

	it('Should render attribute shorthands', function() {
		expect(Passage.render('<div.class#id>\nInside\n</div>'))
			.toBe('<div id="id" class="class">\nInside\n</div>');
	});

	it('Should render a shorthand starting with - as hidden', function() {
		var $result = $(Passage.render('<span-.class>Inside</span>')).find('.class');

		expect($result.length).toBe(1);
		expect($result.css('display')).toBe('none');
	});

	it('Should render a shorthand starting with 0 as a void href', function() {
		var $result = $(Passage.render('<a0.class>Inside</a>')).find('.class');

		expect($result.length).toBe(1);
		expect($result.attr('href')).toBe('javascript:void(0)');
	});

	it('Should allow mixing - and 0 prefixes', function() {
		var $result = $(Passage.render('<a-0.class>Inside</a>')).find('.class');

		expect($result.length).toBe(1);
		expect($result.attr('href')).toBe('javascript:void(0)');
		expect($result.css('display')).toBe('none');

		$result = $(Passage.render('<a0-.class>Inside</a>')).find('.class');

		expect($result.length).toBe(1);
		expect($result.attr('href')).toBe('javascript:void(0)');
		expect($result.css('display')).toBe('none');
	});

	it('Should allow prefixes by themselves', function() {
		expect(Passage.render('<a0>Inside</a>'))
			.toBe('<p><a href="javascript:void(0)">Inside</a></p>\n');
		expect(Passage.render('<a->Inside</a>'))
			.toBe('<p><a style="display:none">Inside</a></p>\n');
		expect(Passage.render('<li.class><a0>Inside A Tag</a></li>'))
			.toBe('<li class="class"><a href="javascript:void(0)">Inside A Tag</a></li>');
	});

	it('Should render shorthands next to each other correctly', function() {
		var $result = $(Passage.render('<li.class><a.subclass>Inside</span></li>'));

		expect($result.attr('class')).toBe('class');
		expect($result.find('a').length).toBe(1);
		expect($result.find('a').attr('class')).toBe('subclass');
		expect($result.find('a').text()).toBe('Inside');
	});

	it('Should handle invalid selector patterns gracefully', function() {
		// This test is designed to cover edge cases in renderAttrs function
		// by testing malformed attribute patterns that might cause unexpected behavior
		
		// Test with valid patterns first to ensure normal operation
		expect(Passage.render('<div.valid#myid>Content</div>'))
			.toBe('<div id="myid" class="valid">Content</div>');
		
		// Test with empty class/id patterns
		expect(Passage.render('<div.>Content</div>'))
			.toBe('<div >Content</div>');
			
		expect(Passage.render('<div#>Content</div>'))
			.toBe('<div >Content</div>');
	});

	it('Should handle complex attribute combinations', function() {
		// Test multiple classes
		expect(Passage.render('<div.class1.class2.class3>Content</div>'))
			.toBe('<div class="class1 class2 class3">Content</div>');
		
		// Test mixed prefixes and attributes (wrapped in p tag by marked)
		expect(Passage.render('<a-0.button#submit>Click</a>'))
			.toBe('<p><a style="display:none" href="javascript:void(0)" id="submit" class="button">Click</a></p>\n');
		
		// Test only prefixes
		expect(Passage.render('<div->Hidden</div>'))
			.toBe('<div style="display:none">Hidden</div>');
		
		expect(Passage.render('<a0>Void Link</a>'))
			.toBe('<p><a href="javascript:void(0)">Void Link</a></p>\n');
	});

	it('Should handle edge cases in link parsing', function() {
		// Test various URL formats that should be treated as external
		var externalUrls = [
			'http://example.com',
			'https://example.com',
			'ftp://files.example.com'
		];
		
		externalUrls.forEach(function(url) {
			var result = Passage.render('[[' + url + ']]');
			expect(result).toContain('href="' + url + '"');
			expect(result).not.toContain('data-passage');
		});
		
		// Test URLs that match the external URL regex (require :// pattern)
		expect(Passage.render('[[file:///local/path]]'))
			.toContain('href="file:///local/path"');
		
		// Test URLs that don't match the external URL regex
		var internalUrls = [
			'mailto:test@example.com',
			'javascript:alert(1)',
			'tel:+1234567890'
		];
		
		internalUrls.forEach(function(url) {
			var result = Passage.render('[[' + url + ']]');
			expect(result).toContain('data-passage="' + _.escape(url) + '"');
			expect(result).not.toContain('href="' + url + '"');
		});
			
		// Test URLs with custom display text
		expect(Passage.render('[[Display Text|https://example.com]]'))
			.toBe('<p><a href="https://example.com">Display Text</a></p>\n');
	});

	it('Should properly escape passage names in data attributes', function() {
		// Test passage names that need escaping
		expect(Passage.render('[[Passage with "quotes"]]'))
			.toContain('data-passage="Passage with &quot;quotes&quot;"');
			
		expect(Passage.render('[[Passage with <tags>]]'))
			.toContain('data-passage="Passage with &lt;tags&gt;"');
			
		expect(Passage.render('[[Passage & More]]'))
			.toContain('data-passage="Passage &amp; More"');
	});

	it('Should handle renderAttrs function edge cases', function() {
		// Access the renderAttrs function directly to test edge cases
		// This is an internal function, but we want to ensure it's robust
		
		// Test normal operation
		var result1 = Passage.render('<div.test#id>Content</div>');
		expect(result1).toContain('class="test"');
		expect(result1).toContain('id="id"');
		
		// Test with no attributes
		var result2 = Passage.render('<div>Content</div>');
		expect(result2).toBe('<div>Content</div>');
		
		// Test with multiple same-type attributes
		var result3 = Passage.render('<div.class1.class2>Content</div>');
		expect(result3).toContain('class="class1 class2"');
	});
});
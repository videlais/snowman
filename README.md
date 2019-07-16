# Snowman

Snowman is a minimal Twine 2 story format designed for people who already know
JavaScript and CSS. It's designed to implement basic functionality for playing
Twine stories and then get out of your way.

Snowman includes [jQuery](http://jquery.com) and [Underscore](http://underscorejs.org/) for you.

## Changes From The Norm

Snowman uses Markdown formatting in its passage syntax. Instead of invoking macros with `<<double angle brackets>>`, it uses Underscore templating to provide interactivity. Specifically, passages are rendered onscreen with this process:

1. The passage source is run through Underscore's [_.template() method](http://underscorejs.org/#template). Code in `<% blocks %>` receive two special variables:

	* `s`, which is a shorthand for `window.story.state`
	* `$`, which acts like jQuery's `$` method but with one exception. If you pass it a single function, this function is run when the passage appears onscreen, with it bound to the passage DOM element.

2. Comments inside `/* inline blocks */` are removed, as are `// line comments`. `//` comments remove their line break, so that:
```
The die comes up...

// TODO: randomize this properly
Three!
```
is rendered as:
```
The die comes up...

Three!
```
Line comments (that is, ones that start with //) may be used at the very start of a line. This is to avoid problems when URLs appear in the text, which might otherwise accidentally trigger a comment.

3. HTML shorthand:

Prefixes:
* 0: an "empty" link (a ```href``` set to ```javascript:void(0)```).
* -: "hidden" with a ```style``` set to ```display:none```.

Example:
```<a-0>Empty link and hidden</a>```

Prefixes can appear in any order, but **must** be used after the name of the HTML element and before any suffixes.

Suffixes:
* #id: the ```id``` of the element
* .class: a ```class``` of the element

Suffixes can appear in any order, but **must** be used after the name of the HTML element and after any prefixes.

Example: ```<div#banner.green.large>Large, green banner!</div>```

5. All double-bracketed links (`[[passage]]`, `[[displayed->passage]]`, and `[[passage<-displayed]]` are converted to functional links.

6. Finally, the result of this is rendered with the
[Marked](https://github.com/chjj/marked/) Markdown parser.

By default, clicking a passage link does not add an entry to the reader's browser history. See `story.checkpoint()` for how to do this.

## Building From Source

Run `npm install` to install dependencies. `npm run build` will create a Twine 2-ready story format under dist/, as well as a guide to Snowman features at `dist/guide.html`. `npm start` will start a file watching process that updates the story format as changes are made under `src/`.

To check for style errors, run `npm run lint`. To run unit tests, run `npm test`. Please ensure that both run cleanly before submitting a pull request.

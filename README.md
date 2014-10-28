# Snowman

Snowman is a minimal Twine 2 story format designed for people who already know
JavaScript and CSS. It's designed to implement basic functionality for playing
Twine stories and then get out of your way.

Snowman includes [jQuery](http://jquery.com) and
[Underscore](http://underscorejs.org/) for you.

## Big Changes From The Norm

Snowman uses Markdown formatting in its passage syntax. Instead of invoking
macros with `<<double angle brackets>>`, it uses Underscore templating to
provide interactivity. Specifically, passages are rendered onscreen with this
process:

1. The passage source is run through Underscore's [_.template() method](http://underscorejs.org/#template).
2. The result of this is rendered with the [Marked](https://github.com/chjj/marked/) Markdown parser.
3. Finally, all double-bracketed links ([[passage]], [[displayed->passage]], and [[passage<-displayed]] are converted to functional links. 

By default, clicking a passage link does not add an entry to the reader's
browser history. See `story.checkpoint()` for how to do this.

## Building From Source

Run `npm install` to install dependencies. `grunt` will create a testing
version of the format as index.html, and `grunt release` will build a release
version ready to be used in Twine.

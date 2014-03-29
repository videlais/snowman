# Snowman

Snowman is a minimal Twine 2 story format designed for people who already know
JavaScript and CSS. It's designed to implement basic functionality for playing
Twine stories and then get out of your way.

Snowman includes [jQuery](http://jquery.com) and
[Underscore](http://underscorejs.org/) for you.

## Big Changes From The Norm

Snowman uses Markdown formatting in its passage syntax. Instead of invoking
macros with `<<double angle brackets>>`, it uses ERB-style `<% %>` delimiters.
Anything inside a `<% %>` pair is treated as JavaScript that is evaluted as-is
when a passage is displayed. See `story.write()` for how code can dynamically
set passage contents.

As a shortcut, you can write `<%= expression %>` to have a particular expression
interpolated into the passage, e.g. `The answer to the question is <%= 2 + 2 %>.`

*n.b.* Although this syntax looks like Underscore templating, it is not.

By default, clicking a passage link does not add an entry to the reader's
browser history. See `story.checkpoint()` for how to do this.

## Building From Source

Run `npm install` to install dependencies. `grunt` will create a testing
version of the format as index.html, and `grunt release` will build a release
version ready to be used in Twine.

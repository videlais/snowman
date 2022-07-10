# Working with CSS

Snowman 2.X uses a simple set of CSS rules for displaying HTML content. These can easily be extended or overwritten through adding new style rules within the Story Stylesheet when using the Twine 2 editor or as part of a `stylesheet`-tagged passage when using a Twee compiler.

## Link Styles Example

Snowman uses the following rules for all `<a>` links:

```css
a {
    color: #222;
    text-decoration-color: #bbb;
}

a:hover {
    color: #cc8929;
    text-decoration-color: #cc8929;
}

a:active {
    color: #ffb040;
    text-decoration-color: #cc8929;
}
```

These can be directly overwritten using new `a{}` rules, but more specific overriding of their rules could take place by targeting the `a` elements within the element with the class "passage" instead.

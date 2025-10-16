# JavaScript Scope

As explained within the templates page, all Underscore template code sections are their own function scope. The same is also true of any use of `<script>` tags within a passage. These all run within their own contextual scopes.

Unlike other story formats like Harlowe, SugarCube, and others, Snowman does not provide global access to variables created. However, it does provide the additional global `s` that is a shorthand for `window.story.state`. This can safely be used as an object to save properties across passages and code sections.

When working with user-defined functions and variables, it is highly recommended to use either `s` or another user-defined global object such as `window.setup` to store and access data across Snowman passages.

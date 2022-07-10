# Functions Not Macros

Snowman does not supply any macros. In other story formats like Harlowe or SugarCube, there are bits of code that can be used called "macros." Instead of providing these, Snowman uses two global variables, `window.story` and `window.passage`.

These variables provide functions and properties that can be accessed as part of the template system built into Snowman. JavaScript is used in place of any other code either with `<script>` tags or as part of template code blocks.

## window.story

### Story Properties

* name
* startPassage
* creator
* creatorVersion
* history
* state
* checkpointName
* ignoreErrors
* errorMessage
* passages
* userScripts
* userStyles
* atCheckpoint

### Story Functions

* checkpoint()
* passage()
* render()
* restore()
* save()
* saveHash()
* show()
* start()

## window.passage

### Passage Properties

* id
* name
* tags
* source

### Passage Functions

* render()

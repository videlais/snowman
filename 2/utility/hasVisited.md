---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## hasVisited()

The global function `window.hasVisited()` returns if a passage has been visited (if it is a part of the story history) or not. It accepts one or more passage ID numbers or names and will return if all of the passages have been visited or not.

## Single Passage ID Example

```javascript
// Returns true if there is a passage with the ID of 1 in the history
hasVisited(1);
```

## Multiple Passage ID Example

```javascript
// Returns true if there are passages with the IDs of 1 and 2 in the history
hasVisited(1,2);
```

## Single Passage Name Example

```javascript
// Returns true if there is a passage with the name of "Start" in the history
hasVisited("Start");
```

## Multiple Passage Names Example

```javascript
// Returns true if there are passages with the names of "Start" and "Second" in the history
hasVisited("Start", "Second");
```

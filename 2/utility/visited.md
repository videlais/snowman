---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## visited()

The global function `window.visited()` returns the number of times a passage appears in the story history. It accepts one or more passage IDs or names and, with multiple passages, returns the smallest visited count among them.

## Single Passage ID Example

```javascript
// Returns number of visits
visited(1);
```

## Single Passage Name Example

```javascript
// Returns number of visits
visited("Start");
```

## Multiple Passage IDs Example

```javascript
// Returns smallest number of visits
visited(1,2);
```

## Multiple Passage Names Example

```javascript
// Returns smallest number of visits
visited("Start", "Another");
```

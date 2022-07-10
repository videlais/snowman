# either()

The global function `window.either()` picks and returns a random entry from its arguments. It will also combine the values of any arrays passed to it together and return a random entry from the total set.

## Single Array Example

```javascript
// Returns 1, 2, or 3
either([1,2,3]);
```

## Multiple Arguments Example

```javascript
// Returns 1, 2, or 3
either(1,2,3);
```

## Multiple Array Arguments Example

```javascript
// Returns 1, 2, or 3
either([1],[2],[3]);
```

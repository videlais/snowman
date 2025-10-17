---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## Working with CSS

Before Snowman 2.X's CSS is loaded, the [normalize.css](https://necolas.github.io/normalize.css/) rules are applied first.

Snowman 2.X uses the following default CSS rules.

```css
body {
    font: 18px "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #222;
}

#main {
    max-width: 38em;
    margin: 0 auto;
    line-height: 145%;
}

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

tw-storydata {
    display: none;
}

/* scale font sizes for phones */

@media screen and (max-device-width: 480px) {
    #passage {
        font-size: 70%;
    }
}
```

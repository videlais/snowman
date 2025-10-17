---
layout: version_1x
title: "Snowman 1.X Documentation"
---

## Checkpoint Events

The event `added.sm.checkpoint` is triggered when a passage is about to be shown and a checkpoint has been set. The name property of the event object contains the passage id or name.

The event `fail.sm.checkpoint` is triggered when a passage is about to be shown, a checkpoint was set, but a browser security setting blocked the use of `window.history` for some reason. The error property of the event object contains the error message.

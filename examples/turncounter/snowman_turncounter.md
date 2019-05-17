# "Turn Counter": Snowman (v1.3.0)

## Summary

"Turn Counter" demonstrates the use of the *window.story.history* array in keeping track of "turns" (number of passages visited). The *window.story.render()* function is used to "display" or otherwise include another passage at the start of each.

In this example, the *length* of the array *window.story.history* is compared to its modulo 24 value. Sometimes known as "wrap around," the modulus operator (%) is used to get the remainder of the number of "turns" (passages) divided by 24. This creates a clock where its value shows one of a series of strings representing "morning", "mid-morning", "afternoon", or "night."

By visiting other passages, the turn count is increased and the hour reaches 23 before being reset back to 0 before increasing again.

## Live Example

<section>
<iframe src="snowman_turncounter_example.html" height=400 width=90%></iframe>


Download: <a href="snowman_turncounter_example.html" target="_blank">Live Example</a>
</section>

## Twee Code

Download: <a href="snowman_turncounter_twee.txt" target="_blank">Twee Code</a>

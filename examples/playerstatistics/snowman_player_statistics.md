# "Player Statistics": Snowman (v1.3.0)

## Summary

One of the most popular mechanics of table-top role-playing games are those where the player must determine their in-game statistics and then use them to make decsions.

In this example, the jQuery event handler *[click()](https://api.jquery.com/click/)* is used to bind to multiple buttons. Depending on what was clicked, the content is replaced or values adjusted based on if a conditional statement is true. Values are then tested when combined with a [random number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) between 1 to 6, mimicking a common 1d6 mechanic to check if a value is above a target number.


<div class="alertbox information"><strong>Note:</strong> Elements must exist <em>before</em> the attempt to bind to them in order to be successful. This example uses the <em><a href="https://api.jquery.com/ready/">ready()</a></em> function to achieve this with the first, starting passage.</div>

## Live Example

<section>
<iframe src="snowman_player_statistics_example.html" height=400 width=90%></iframe>


Download: <a href="snowman_player_statistics_example.html" target="_blank">Live Example</a>
</section>

## Twee Code

Download: <a href="snowman_player_statistics_twee.txt" target="_blank">Twee Code</a>

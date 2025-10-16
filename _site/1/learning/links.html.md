# Working with passages

Passages are how Twine divides up a story into different parts. These can be scenes, like times or locations, logical sections, such as different chapters or acts, or even simply blocks of code. They provide a way to understand a story as composed of many parts.

Connecting one passage to another is done through using links. These are words or phrases surrounded by two sets of opening and closing square brackets.

`[[Link]]`

When used within the Twine 2 in this way, a link shows a connection between one passage and another. When a single word or phrase is included within the two sets of opening and closing square brackets, this "links" one passage to another of that exact word or phrase. The "link" is the name of that other passage.

Links can also come in different forms.

The pipe character, `|`, can be used to present a word or phrase as the link text that then "connects" to a different passage.

`[[Link to another passage|Different Passage Name]]`

Starting with Twine 2, it is also possible to "route" links to different passages. Arrows, `->` or `<-`, can be used to point to the destination of the link and "away" from the word or phrase used as the link text.

`[[Link to another passage->Different Passage Name]]`

`[[Different Passage Name<-Link to another passage]]`

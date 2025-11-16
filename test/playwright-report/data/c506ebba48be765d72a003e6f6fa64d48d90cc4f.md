# Page snapshot

```yaml
- generic [ref=e3]:
  - button "North" [ref=e4]
  - button "South" [ref=e5]
  - button "East" [ref=e6]
  - button "West" [ref=e7]
  - text: "&lt;% /* 0s are walls, 1 are spaces, 2 is the goal."
  - emphasis [ref=e8]: / var maze = [ [0,0,0,0,0,0,0,0,0,0,0], [0,1,1,1,0,1,1,1,1,1,0], [0,0,0,1,0,0,0,0,0,1,0], [0,1,0,1,1,1,1,1,0,1,0], [0,1,0,0,0,0,0,1,0,1,0], [0,1,1,1,1,1,1,1,0,1,0], [0,0,0,0,0,0,0,1,0,1,0], [0,1,0,1,1,1,1,1,1,1,0], [0,1,0,1,0,0,0,1,0,0,0], [0,1,1,1,0,1,1,1,1,2,0], [0,0,0,0,0,0,0,0,0,0,0] ]; /
  - text: Where the player starts. The top left is (0, 0).
  - emphasis [ref=e9]: "/ var positionX = 1, positionY = 1; function renderMaze() { /"
  - text: Transform the maze into ASCII art.
  - emphasis [ref=e10]: / /
  - text: What characters we use to display the maze.
  - emphasis [ref=e11]:
    - text: "/ var displayChars = ['#', '.', 'E']; $('.maze').html(maze.map(function(row, renderY) { return row.reduceRight(function(html, cell, renderX) { if (renderX === positionX &amp;&amp; renderY === positionY) { return 'P' + html; } return displayChars[cell] + html; }, '"
    - text: "'); })); } function updateMoves() { /"
  - text: Enable/disable buttons to move based on what's allowed. We take advantage of the fact that both 0 and undefined (outside the maze) are converted to false by JavaScript by the ! operator.
  - emphasis [ref=e12]: "/ $('[data-move=&quot;n&quot;]').attr('disabled', !maze[positionY - 1][positionX]); $('[data-move=&quot;s&quot;]').attr('disabled', !maze[positionY + 1][positionX]); $('[data-move=&quot;e&quot;]').attr('disabled', !maze[positionY][positionX + 1]); $('[data-move=&quot;w&quot;]').attr('disabled', !maze[positionY][positionX - 1]); } $(function() { renderMaze(); updateMoves(); /"
  - text: "Change position when the user clicks an appropriate link. We depend on updateMoves() to prevent the user from walking through a wall. */ $('[data-move]').click(function() { var direction = $(this).data('move'); switch (direction) { case 'n': positionY--; break; case 's': positionY++; break; case 'e': positionX++; break; case 'w': positionX--; break; default: throw new Error('Don't know how to move ' + direction); } if (maze[positionY][positionX] === 2) { story.show('Exit'); } else { renderMaze(); updateMoves(); } }); }); %&gt;"
```
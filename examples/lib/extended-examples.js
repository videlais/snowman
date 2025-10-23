/**
 * Extended example templates for Snowman interactive examples
 * These templates demonstrate advanced features and real-world usage patterns
 */

const SnowmanExamples = {
    // Advanced examples for different Snowman versions
    advanced: {
        'story-events': {
            name: 'Story Events',
            description: 'Handling story and passage events',
            format: 'All',
            content: `:: Start [startup]
# Story Events Demo

<% 
// Set up event listeners when the story starts
$(window).on('start.sm.story', function(event, eventObject) {
    console.log('Story started!', eventObject);
});

$(window).on('show.sm.passage', function(event, eventObject) {
    console.log('Showing passage:', eventObject.passage.name);
    $('#event-log').append('<div>📄 Showing: ' + eventObject.passage.name + '</div>');
});

$(window).on('hide.sm.passage', function(event, eventObject) {
    console.log('Hiding passage:', eventObject.passage.name);
    $('#event-log').prepend('<div>👁️ Hidden: ' + eventObject.passage.name + '</div>');
});
%>

<div id="event-log" style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 12px;">
    <div>🎬 Event log will appear here...</div>
</div>

Navigate between passages to see events in action!

[[Go to Second->Second]]
[[Go to Third->Third]]

:: Second
# Second Passage

You're now in the second passage. Check the event log above!

<% 
$('#event-log').append('<div>✨ Second passage content loaded</div>');
%>

[[Go to Third->Third]]
[[Back to Start->Start]]

:: Third  
# Third Passage

Events are firing as you navigate!

<% 
$('#event-log').append('<div>🎯 Third passage is active</div>');
%>

[[Back to Start->Start]]
[[Go to Second->Second]]`
        },

        'data-persistence': {
            name: 'Data Persistence',
            description: 'Saving and loading game state',
            format: 'All',
            content: `:: Start
# Data Persistence Demo

<%
// Initialize game state if it doesn't exist
if (typeof window.gameState === 'undefined') {
    window.gameState = {
        playerName: 'Anonymous',
        score: 0,
        inventory: [],
        visits: 0,
        lastSaved: null
    };
}

// Increment visit counter
window.gameState.visits++;

// Save to localStorage
function saveGame() {
    window.gameState.lastSaved = new Date().toLocaleString();
    localStorage.setItem('snowman-demo-save', JSON.stringify(window.gameState));
    $('#save-status').text('Game saved!').show().fadeOut(3000);
}

// Load from localStorage
function loadGame() {
    const saved = localStorage.getItem('snowman-demo-save');
    if (saved) {
        window.gameState = JSON.parse(saved);
        $('#save-status').text('Game loaded!').show().fadeOut(3000);
        window.story.show('Start'); // Refresh the passage
    } else {
        $('#save-status').text('No saved game found').show().fadeOut(3000);
    }
}
%>

# Welcome back, <%= window.gameState.playerName %>!

**Game Statistics:**
- Current score: **<%= window.gameState.score %>**
- Times visited Start: **<%= window.gameState.visits %>**
- Inventory: <%= window.gameState.inventory.length > 0 ? window.gameState.inventory.join(', ') : 'Empty' %>
<% if (window.gameState.lastSaved) { %>
- Last saved: <%= window.gameState.lastSaved %>
<% } %>

<div id="save-status" style="background: #d4edda; color: #155724; padding: 8px; border-radius: 4px; margin: 10px 0; display: none;"></div>

<button onclick="saveGame()" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin: 5px;">💾 Save Game</button>
<button onclick="loadGame()" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin: 5px;">📂 Load Game</button>

[[Change name->ChangeName]]
[[Increase score->Score]]
[[Find items->Inventory]]

:: ChangeName
# Change Player Name

<%
const newName = prompt('Enter your name:', window.gameState.playerName);
if (newName && newName.trim()) {
    window.gameState.playerName = newName.trim();
}
%>

Your name is now: **<%= window.gameState.playerName %>**

[[Back to start->Start]]

:: Score
# Score Challenge

<%
const points = Math.floor(Math.random() * 50) + 10;
window.gameState.score += points;
%>

You earned **<%= points %>** points!

Your total score is now: **<%= window.gameState.score %>**

[[Back to start->Start]]

:: Inventory
# Find Items

<%
const items = ['Magic Sword', 'Health Potion', 'Ancient Key', 'Gold Coin', 'Mystic Gem'];
const randomItem = items[Math.floor(Math.random() * items.length)];

if (!window.gameState.inventory.includes(randomItem)) {
    window.gameState.inventory.push(randomItem);
    print('<p>You found a <strong>' + randomItem + '</strong>!</p>');
} else {
    print('<p>You found a <strong>' + randomItem + '</strong>, but you already have one.</p>');
}
%>

[[Search again->Inventory]]
[[Back to start->Start]]`
        },

        'interactive-fiction': {
            name: 'Interactive Fiction',
            description: 'Complete IF game with stats and choices',
            format: 'All',
            content: `:: Start [startup]
# The Enchanted Forest

<%
// Initialize player stats
if (typeof window.player === 'undefined') {
    window.player = {
        name: 'Adventurer',
        health: 100,
        magic: 50,
        inventory: ['Basic Sword'],
        location: 'Forest Entrance'
    };
}

// Function to update stats display
function updateStats() {
    const statsHtml = 
        '<div style="background: #2c3e50; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; font-family: monospace;">' +
        '<strong>' + window.player.name + '</strong> | ' +
        'HP: ' + window.player.health + '/100 | ' +
        'MP: ' + window.player.magic + '/100 | ' +
        'Items: ' + window.player.inventory.length +
        '</div>';
    return statsHtml;
}
%>

<%- updateStats() %>

You stand at the entrance to an enchanted forest. Ancient trees tower above you, their leaves whispering secrets in an unknown tongue.

**What do you choose to do?**

[[Enter the forest cautiously->EnterForest]]
[[Search for a weapon first->SearchWeapon]]
[[Cast a detection spell->CastSpell]]

:: EnterForest
# Deep in the Forest

<%
window.player.location = 'Deep Forest';
const encounter = Math.random();
%>

<%- updateStats() %>

You venture deeper into the forest. The path winds between massive oak trees...

<% if (encounter < 0.3) { %>
Suddenly, a **wild goblin** leaps out from behind a tree!

[[Fight the goblin->FightGoblin]]
[[Try to negotiate->Negotiate]]
[[Run away->RunAway]]

<% } else if (encounter < 0.6) { %>
You discover a **magical spring** bubbling with crystal-clear water.

[[Drink from the spring->DrinkSpring]]
[[Fill a bottle with water->FillBottle]]
[[Continue walking->ContinueWalk]]

<% } else { %>
You find an **abandoned campsite** with the remains of a fire.

[[Investigate the campsite->Investigate]]
[[Rest at the campsite->Rest]]
[[Continue walking->ContinueWalk]]
<% } %>

:: SearchWeapon
# Searching for Weapons

<%
const weapons = ['Iron Dagger', 'Wooden Staff', 'Silver Bow'];
const foundWeapon = weapons[Math.floor(Math.random() * weapons.length)];
window.player.inventory.push(foundWeapon);
%>

<%- updateStats() %>

You search the area and find a **<%= foundWeapon %>**!

[[Now enter the forest->EnterForest]]

:: CastSpell
# Detection Spell

<%
if (window.player.magic >= 10) {
    window.player.magic -= 10;
    const detection = Math.random();
%>

<%- updateStats() %>

You cast a detection spell... Your magic reveals:

<% if (detection < 0.5) { %>
⚠️ **Danger ahead!** You sense hostile creatures in the forest.
<% } else { %>
✨ **Treasures nearby!** You sense valuable items hidden in the forest.
<% } %>

[[Enter the forest with this knowledge->EnterForest]]

<% } else { %>
<%- updateStats() %>

You don't have enough magic to cast the spell! (Need 10 MP)

[[Enter the forest anyway->EnterForest]]
[[Search for a weapon instead->SearchWeapon]]
<% } %>

:: FightGoblin
# Battle with the Goblin

<%
const playerAttack = Math.floor(Math.random() * 30) + 10;
const goblinAttack = Math.floor(Math.random() * 20) + 5;

window.player.health -= goblinAttack;
%>

<%- updateStats() %>

You swing your weapon dealing **<%= playerAttack %>** damage!
The goblin attacks back for **<%= goblinAttack %>** damage!

<% if (window.player.health <= 0) { %>
💀 **Game Over!** The goblin has defeated you.

[[Start over->Start]]

<% } else { %>
🏆 **Victory!** You defeated the goblin and found **20 gold pieces**!

<%
window.player.inventory.push('20 Gold Pieces');
%>

[[Continue deeper->ContinueWalk]]
<% } %>

:: DrinkSpring
# The Magical Spring

<%
const healing = Math.floor(Math.random() * 30) + 20;
window.player.health = Math.min(100, window.player.health + healing);
window.player.magic = Math.min(100, window.player.magic + 15);
%>

<%- updateStats() %>

The magical water heals you for **<%= healing %>** health and restores **15** magic!

You feel refreshed and energized.

[[Continue your journey->ContinueWalk]]

:: Rest
# Resting at the Campsite

<%
window.player.health = Math.min(100, window.player.health + 25);
window.player.magic = Math.min(100, window.player.magic + 25);
%>

<%- updateStats() %>

You rest by the old campfire, recovering **25 health** and **25 magic**.

[[Continue refreshed->ContinueWalk]]

:: ContinueWalk
# The Path Continues

<%- updateStats() %>

You continue walking through the enchanted forest. The adventure continues...

**Your journey through the forest has only just begun!**

[[Return to the entrance->Start]]
[[Explore a different path->EnterForest]]`
        }
    },

    // Version-specific examples
    version2x: {
        'utility-showcase': {
            name: 'Utility Functions Showcase',
            description: 'All Snowman 2.X utility functions',
            format: '2.X',
            content: `:: Start
# Snowman 2.X Utility Functions

<%
// Check if we're actually in 2.X
if (typeof either === 'undefined') {
    print('<div style="background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; margin: 10px 0;">');
    print('⚠️ <strong>Switch to Snowman 2.X</strong> to see utility functions in action!');
    print('</div>');
} else {
    print('<div style="background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0;">');
    print('✅ <strong>Snowman 2.X detected!</strong> All utility functions are available.');
    print('</div>');
}
%>

[[Test either() function->EitherFunction]]
[[Test hasVisited() function->HasVisitedFunction]]
[[Test visited() function->VisitedFunction]]
[[Test getStyles() function->GetStylesFunction]]
[[Test renderToSelector() function->RenderFunction]]

:: EitherFunction
# either() Function Demo

<%
if (typeof either !== 'undefined') {
    // Simple random choice
    const colors = either('red', 'blue', 'green', 'yellow', 'purple');
    print('<p>Random color: <strong style="color: ' + colors + '">' + colors + '</strong></p>');
    
    // Random character name
    const names = either('Aragorn', 'Gandalf', 'Legolas', 'Gimli', 'Frodo');
    print('<p>Your companion: <strong>' + names + '</strong></p>');
    
    // Random weather
    const weather = either(
        'sunny ☀️',
        'rainy 🌧️', 
        'cloudy ☁️',
        'snowy ❄️',
        'windy 💨'
    );
    print('<p>Today\'s weather: <strong>' + weather + '</strong></p>');
    
    // Random encounter
    const encounters = either(
        'You find a treasure chest!',
        'A friendly merchant approaches.',
        'You hear mysterious music in the distance.',
        'A wild animal crosses your path.',
        'You discover ancient ruins.'
    );
    print('<div style="background: #e7f3ff; padding: 10px; border-radius: 5px; margin: 10px 0;">');
    print('<strong>Random Encounter:</strong> ' + encounters);
    print('</div>');
}
%>

[[Try again->EitherFunction]]
[[Back to start->Start]]

:: HasVisitedFunction  
# hasVisited() Function Demo

<%
if (typeof hasVisited !== 'undefined') {
    print('<h3>Passage Visit Status:</h3>');
    print('<ul>');
    
    const passageList = ['Start', 'EitherFunction', 'HasVisitedFunction', 'VisitedFunction', 'GetStylesFunction', 'RenderFunction'];
    
    passageList.forEach(function(passageName) {
        const visited = hasVisited(passageName);
        const status = visited ? '✅ Visited' : '❌ Not visited';
        const style = visited ? 'color: green;' : 'color: red;';
        print('<li style="' + style + '"><strong>' + passageName + ':</strong> ' + status + '</li>');
    });
    
    print('</ul>');
    
    // Conditional content based on visits
    if (hasVisited('EitherFunction')) {
        print('<p>🎉 <strong>Great!</strong> You\'ve already tried the either() function.</p>');
    }
    
    if (hasVisited('VisitedFunction')) {
        print('<p>🔄 <strong>Nice!</strong> You\'ve explored the visited() function too.</p>');
    }
    
    // Count total visited passages
    let visitedCount = 0;
    passageList.forEach(function(name) {
        if (hasVisited(name)) visitedCount++;
    });
    
    print('<div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">');
    print('<strong>Progress:</strong> You\'ve visited ' + visitedCount + ' out of ' + passageList.length + ' passages (' + Math.round(visitedCount/passageList.length*100) + '%)');
    print('</div>');
}
%>

[[Back to start->Start]]

:: VisitedFunction
# visited() Function Demo

<%
if (typeof visited !== 'undefined') {
    print('<h3>Detailed Visit Information:</h3>');
    
    const passages = ['Start', 'EitherFunction', 'HasVisitedFunction', 'VisitedFunction'];
    
    passages.forEach(function(passageName) {
        const visitCount = visited(passageName);
        print('<div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px;">');
        print('<strong>' + passageName + ':</strong> ');
        
        if (visitCount === 0) {
            print('<span style="color: #dc3545;">Not visited</span>');
        } else if (visitCount === 1) {
            print('<span style="color: #28a745;">Visited once</span>');
        } else {
            print('<span style="color: #007bff;">Visited ' + visitCount + ' times</span>');
        }
        print('</div>');
    });
    
    // Special message for repeat visitors
    const thisVisitCount = visited('VisitedFunction');
    if (thisVisitCount > 1) {
        print('<div style="background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; margin: 10px 0;">');
        print('🔄 <strong>Welcome back!</strong> This is your visit #' + thisVisitCount + ' to this passage.');
        print('</div>');
    }
}
%>

[[Visit again->VisitedFunction]]
[[Back to start->Start]]

:: GetStylesFunction
# getStyles() Function Demo

<%
if (typeof getStyles !== 'undefined') {
    print('<h3>CSS Style Inspection:</h3>');
    
    // Create a test element with styles
    print('<div id="test-element" style="color: red; background-color: yellow; padding: 10px; border: 2px solid blue; border-radius: 5px; margin: 10px 0;">');
    print('This is a test element with inline styles.');
    print('</div>');
    
    // Get and display styles
    print('<h4>Inspected Styles:</h4>');
    print('<pre style="background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto;">');
    
    try {
        const styles = getStyles('#test-element');
        print(JSON.stringify(styles, null, 2));
    } catch (error) {
        print('Error getting styles: ' + error.message);
    }
    
    print('</pre>');
    
    print('<p><strong>Try it yourself:</strong> Open browser developer tools and inspect the test element above!</p>');
}
%>

[[Back to start->Start]]

:: RenderFunction
# renderToSelector() Function Demo

<%
if (typeof renderToSelector !== 'undefined') {
    print('<h3>Dynamic Content Rendering:</h3>');
    
    // Create target containers
    print('<div id="render-target-1" style="border: 2px dashed #007bff; padding: 20px; margin: 10px 0; text-align: center; color: #6c757d;">');
    print('Target Container 1 - Content will be rendered here');
    print('</div>');
    
    print('<div id="render-target-2" style="border: 2px dashed #28a745; padding: 20px; margin: 10px 0; text-align: center; color: #6c757d;">');
    print('Target Container 2 - Content will be rendered here');
    print('</div>');
    
    print('<div style="margin: 20px 0;">');
    print('<button onclick="renderContent1()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 5px;">Render to Container 1</button>');
    print('<button onclick="renderContent2()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 5px;">Render to Container 2</button>');
    print('<button onclick="clearContainers()" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 5px;">Clear All</button>');
    print('</div>');
    
    // JavaScript functions for the buttons
    print('<script>');
    print('function renderContent1() {');
    print('  renderToSelector("#render-target-1", "<h4 style=\\"color: #007bff; margin: 0;\\">✨ Dynamic Content!</h4><p>This was rendered at " + new Date().toLocaleTimeString() + "</p>");');
    print('}');
    
    print('function renderContent2() {');
    print('  const randomNum = Math.floor(Math.random() * 100);');
    print('  renderToSelector("#render-target-2", "<h4 style=\\"color: #28a745; margin: 0;\\">🎲 Random Number: " + randomNum + "</h4><p>Generated dynamically using renderToSelector()</p>");');
    print('}');
    
    print('function clearContainers() {');
    print('  renderToSelector("#render-target-1", "<em style=\\"color: #6c757d;\\">Container cleared</em>");');
    print('  renderToSelector("#render-target-2", "<em style=\\"color: #6c757d;\\">Container cleared</em>");');
    print('}');
    print('</script>');
}
%>

[[Back to start->Start]]`
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.SnowmanExamples = SnowmanExamples;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnowmanExamples;
}
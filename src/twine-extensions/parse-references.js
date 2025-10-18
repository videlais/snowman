export function parsePassageText(text) {
  const matchers = [
    // Twine links: [[Link Text->Passage Name]] or [[Passage Name]]
    /\[\[(?:[^\]]+->)?([^\]]+)\]\]/g,
    
    // Snowman Story.render calls: window.Story.render('passage-name')
    /window\.Story\.render\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    
    // Snowman Story.goTo calls: window.Story.goTo('passage-name')  
    /window\.Story\.goTo\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    
    // Story.render calls without window: Story.render('passage-name')
    /Story\.render\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    
    // Story.goTo calls without window: Story.goTo('passage-name')
    /Story\.goTo\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    
    // jQuery passage references: $('tw-passage[name="passage-name"]')
    /\$\(\s*['"`]tw-passage\[name\s*=\s*['"`]([^'"`]+)['"`]\][^'"`]*['"`]\s*\)/g
  ];

  const results = [];
  const uniquePassages = new Set();

  for (const matcher of matchers) {
    let match;
    matcher.lastIndex = 0; // Reset regex state
    
    while ((match = matcher.exec(text))) {
      const passageName = match[1];
      if (passageName && !uniquePassages.has(passageName)) {
        uniquePassages.add(passageName);
        results.push(passageName);
      }
    }
  }

  return results;
}
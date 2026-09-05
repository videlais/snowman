# Narrative Structures

Structures: Linear

Definition: Every player experiences the same sequence of events in the same order. The only "choice" is pacing (when to proceed), not content.

Examples: Half-Life, The Last of Us (main plot spine), most linear visual novels' "true route" once locked in. Included here as the baseline every other structure is a departure from.

Design note: Not a failure state. Linear structure protects pacing and authored dramatic shape completely. It's the right choice when the story's meaning depends on exact sequencing.

---

Structures: Gauntlet

Definition: A single path forward, but survival at each step is contingent on player skill or choice; failure sends the player back to retry (or to a fail-state ending), rather than to a different branch. There is only one "success" path, but the player's journey to it is nonlinear (retries, deaths, partial progress).

Examples: Most roguelikes' run structure (Hades, Slay the Spire); classic arcade games; QTE-heavy action sequences (God of War's boss fights); dating-sim "true ending" paths that gate on cumulative stat checks rather than branching choices.

Design note: Feels like agency (you can fail!) but the content is linear. Agency lives in execution, not in story divergence. Compare to Branch and Bottleneck, where failure isn't the mechanism forcing convergence. Authorial pacing is.

---


Structures: Loop and Grow

Definition: The player repeats the same base loop (a day, a location, a scenario), but each iteration adds knowledge, items, or unlocked options that change what's possible on the next pass. The structure is technically a loop, but it's experienced as forward progress.

Examples: Outer Wilds (each 22-minute loop adds knowledge, not items, but the effect is identical); The Legend of Zelda: Majora's Mask's three-day cycle; Twelve Minutes; roguelite meta-progression (Hades again. Its run structure is a Gauntlet, but its narrative structure across many runs is Loop and Grow).

Design note: Solves the "replayability vs. authored story" tension: repetition is the content, not a grind around the content. The craft skill is making the nth loop feel different enough to justify itself narratively, not just mechanically.

---

Structures: Branching

Definition: The player chooses; each choice leads to different content; branches diverge and never rejoin. Named "Time Cave" by Ashwell for its resemblance to a cave system that only ever splits, never reconnects.

Examples: Detroit: Become Human's flowchart-visible branches; short Twine pieces; the "multiple distinct endings" marketing promise of many narrative games (though few actually sustain pure branching all the way through).

Design note: Strongest, most honest agency and also the most expensive. Ten binary choices in a row imply 1,024 leaf states. Pure trees are rare beyond short-form work for exactly this reason.

---

Structures: Branch and Bottleneck (Foldback)

Definition [core term, "Foldback"]: The story branches locally, then re-converges at authored checkpoint beats (the "bottlenecks," or — in game-industry parlance — the "pearls" of a string of pearls), then branches again. This is the workhorse structure of commercial narrative games.

Examples: The Witcher 3, Mass Effect, Life is Strange, BioShock. Nearly every AAA narrative game with "meaningful choices" and a fixed number of major story beats.

Design note: Players feel choice moment-to-moment while the author guarantees load-bearing beats occur. The craft skill is hiding the re-convergence and being honest with yourself about which edges are true divergence versus foldback.

---

Structures: Gate / Quest

Definition: A specialization of Branch and Bottleneck common to RPGs: branches converge not at a story beat but at a gate. A checkpoint the player must clear (an item, a stat threshold, a completed sub-quest) regardless of which route they took to it.

Examples: Open-world RPG main-quest gating (The Elder Scrolls, Dragon Age); Baldur's Gate 3's act transitions.

Design note: Gives players freedom over order and completeness of optional content while guaranteeing the author a known world-state at the gate. Distinct from a bottleneck because the convergence condition is systemic (a count or flag), not a single authored scene.

---

Structures: Sorting Hat / Diamond

Definition: An early, often single, choice sends the player down one of several distinct opening paths (with real content differences), which then reconverge into one shared path for the bulk of the story. Named for the Hogwarts sorting scene: the early choice matters enormously for flavor, but the "main quest" is the same regardless.

Examples: Class/origin selection in many RPGs (Dragon Age: Origins' six origin stories funneling into one main plot); visual novels with a route-select prologue before a shared middle.

Design note: Cheaper than full branching because only the opening is multiplied, not the whole story — but can feel like a bait-and-switch if the shared middle doesn't keep honoring the earlier choice (references, unlocked dialogue, altered reactions).

---

Structures: Hub and Spoke

Definition: A central "hub" location or state from which the player can access several independent "spoke" branches (missions, chapters, characters); after each spoke, the player returns to the hub before selecting the next. Spokes are often order-independent and largely self-contained.

Examples: Mass Effect's Normandy/mission structure; Persona's school-life hub between dungeons; Disco Elysium's Martinaise as an explorable hub connecting quest threads; most "mission select" structures in licensed games.

Design note: Excellent for anthology-style or character-focused content (each spoke can have its own tone and stakes) and for player-controlled pacing. The craft risk is a hub that feels like a menu rather than a place.

---

Structures: Modular / Threaded

Definition: Story is delivered as discrete, mostly self-contained modules (vignettes, case files, logs, side-stories) that the player can encounter in almost any order; there is little or no forced sequence, and meaning is assembled by the player from the collection rather than handed to them in a fixed order. 

Examples: Return of the Obra Dinn's death-scene deck (solvable in almost any order); Elden Ring's optional NPC questlines discoverable in any sequence; procedurally-drawn event decks (Slay the Spire's event nodes, Reigns).

Design note: Maximizes player-controlled discovery order at the cost of guaranteed sequencing. You cannot assume the player has seen module B before module C, so each module must stand alone or degrade gracefully if encountered "out of order."

---

Structures: Systemic / Emergenct

Definition: There is no authored plot graph at all; story emerges from interacting systems and the player's actions. The author designs rules and possibility space, not scenes.

Examples: Dwarf Fortress, RimWorld, immersive sims (Dishonored), sandbox open-world RPGs.

Design note: Near-infinite, player-specific yield, but a sacrifice of control over dramatic shape.

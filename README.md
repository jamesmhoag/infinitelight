# infinitelight
a discovery based visual art experience

## Play
Served as a static site (GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/`).
`index.html` opens the title screen.

| File | Role |
|---|---|
| `index.html` | Redirects to the title screen |
| `TitleSplash.html` | Title screen: Continue / Start (New map) / Guide (discovered first), sound |
| `Surface_Map_HUB.html` | The Surface Map: a 3D scene (the hex grid drawn as its ground, a tilting, zooming camera, your ducks swimming round it), day clock, map save, Esc menu |
| `chromatic_nebula.html` | The surface (one level). Runs on its own, or inside the map / title screen with `?hub=1` |
| `join.html` | Play together: a friend's surface, shown as it plays there; your pointer shines and collects on it |
| `shared.js` | What the surface and the Surface Map draw the same way — the Dark Remnant's glow, the bow wake, and the rubber duck: its baked meshes and markings (`DUCK_MESH`) and its WebGL renderer (onto a 2D canvas, or straight into a 3D scene) |
| `shops/` | Shop signs (`sign_<shop>`, SVG). The buildings are 3D models (`SHOP_BLD` / `shopModel` in `shared.js`: walls with window and door openings, a 3D room inside them (walls, floor, shelves of goods, a counter, a lamp; in the shop's colour and lit when open), frames, roof, sign scaffolding, the sign mounted on it), drawn by the duck renderer with one texture of their colours and sign, lit by the time of day. The shops themselves, their hours and what they sell are `SHOPS` / `SHOP_ITEMS` in `shared.js` |
| `tools/build_duck_meshes.js` | Bakes the two 3D duck meshes (classic, Big Head) and the duck markings texture into `shared.js`, from `tools/Duck_Sheet.svg` (vector views: crisp markings, a lighter mesh, lines and eyes shaded by bump) or, with `DUCK_STRIP=tools/duck_strip.png`, the old pixel strip. First `cd tools && npm install` (SVG rendering), then `node tools/build_duck_meshes.js` after changing the drawing or the pipeline |

**New nebula versions must keep the name `chromatic_nebula.html`** — the map and title screen load it by that name. When you replace it, bump the `&v=` number on its `<iframe>` in `Surface_Map_HUB.html` and `TitleSplash.html` so browsers fetch the new copy instead of a cached one.

## The Guide
Every entry is a card in one format (name, a live demo, page and Tier I–V, then its details and live math, each behind its own discovery). Pages: **Discoveries** (how to play, how to clean up, and the events witnessed), **Taxonomy** (every kind of thing and what it becomes, drawn with the game's own glyphs; its cards below), Items, Shapes, Surface Map, **Shops** (How shops work on top: main street, pop-ups, buying; then each shop's card, only its sign's shape until it has opened, with what it does and a tab for each currency it takes), Ducks, Glossary, Status. A shop's first opening is an event (it is discovered then: the Corner Store and Gift Shop on the first morning, the others when they first open). Discoveries made together come as a hand: one card shown, the others below it to pick; closing it eases time back in slowly (`evResumeMs`).

## Play together
Esc on a surface → **Invite a friend** copies a link (`join.html?room=…`). The friend's page shows the host's surface as a live video (PeerJS / WebRTC, peer to peer; the PeerJS public server only makes the introduction) and sends their pointer. On the host it shines, wipes, mops and collects with the same shine cap (`maxActivePoints`) but its own heat; what the friend collects is added to the friend's own save. Add `&net=bc` to the surface's URL to play between two tabs of one browser (BroadcastChannel, no network).

## Performance
The Surface Map draws its ground on a 2D canvas and sends it to the GPU every frame, so its size is the main cost: `mapPlanePx` caps it, and its sharpness follows the zoom. While the map's window is not the one in use it draws `mapIdleFps` (8) frames a second. A hex's picture is built straight from the surface's particle map (only the cells it shows, its blur passes drawn into the picture, no full frame and no start snapshot): about 12 ms instead of 60, one a frame, so a whole map of new pictures eases in over a second or two. The light moves round to a new time of day over `mapSunMs` (4.5 s). The performance log keeps only the last 600 frames, 25 slowest and 400 events, so a map left open does not grow it.

## Saves (browser storage, per site)
- `chromaticNebulaInventory_v1` — items, resources, discoveries and the duck collection (kept by a new map)
- `nebula-config` — tuners, sound setting, hex-layer tuners
- `il_map_v1` — the Surface Map (pop-up shops live on their hexes)
- `il_letters_v1` — the letters you have found (the Guide's Letters book, in the order found)
- `il_souvenirs_v1` — Gift Shop souvenirs (kept through the Gift Shop's wipe)
- IndexedDB `infiniteLight` / `kv` / `session` — the unfinished surface, saved exactly when you leave it

## Keys
- **Esc** — pause menu (sound + volume, readouts, Guide, quit). On the map: sound, Guide, hex-layer tuners, quit.
- **~** (or H) — hide / show the panels, on a surface and on the Surface Map
- **Surface Map**: Modes (Telemetry: each hex's value, coverage and ring on the ground; Stats: fps, frame times and the hex grid; the Performance log) and Tune (every tuner, as on a surface). Lake ducks: brush one slowly and it spins, hit it fast and it putters off, click it and it is dunked. Now and then a message in a bottle floats in (`mapBottleMs`): a 3D clear, green or brown glass bottle (drawn by the duck renderer, `bottleModel` in `shared.js`), half under the water and reflected in it. It drifts like a duck; clicking it opens a letter (`LETTERS`), or, for one bottle in four (`mapBottleDuck`), a duck, which joins your collection (one you did not have bobs up onto the lake). A duck's bottle is gold for an exotic, opaque white for a classic, and shines when the duck is new to you. Bottles float upright, leaning, about half under; an empty one can be dunked like a duck. A brush or a hit counts once, until the cursor has come fully off; a dunk sinks it under the waterline and it bobs back up, and the empty bottle goes back on the water. Letters found are kept (`il_letters_v1`) and read in the Guide's **Letters** book
- **~** (or H) — hide / show everything but the time of day, the inventory (reduced) and its feed, on a surface and on the Surface Map: one setting for both
- **Rest** — at Midnight a Rest button under the time of day ends the day, so a last thing can be done first (a shop, an item); moving still ends it too
- **Surface Map dock**: pointing at an item names it and says what it does; with it in hand, the feed says what it would do on the hex under the cursor and what it costs. Its **▾** hides the feed and reduces the dock (as ~ does): the items have no backing (none in common either) and each stays down out of the way until you point at its own place, they are in hand, or were just used, changed or toggled (`mapDockLingerMs`)
- **Surface Map**: Modes (Telemetry: each hex's value, coverage and ring on the ground; Stats: fps, frame times and the hex grid; the Performance log) and Tune (every tuner, as on a surface). Lake ducks: brush one slowly and it spins, hit it fast and it putters off, click it and it is dunked. Now and then a message in a bottle floats in (`mapBottleMs`): it drifts like a duck, and clicking it opens a letter (`LETTERS` in `shared.js`)
- **Spindle** (armed on the map): a cleared hex back to a surface, or an open hex below 1.00 wound up to 1.00 and held there until cleared
- A bright clear collects everything left on the surface at once
- **Space** / click your hex — enter its surface
- Map: drag to look around (the source stays in view); right-click to come back to your hex

## Shops (Surface Map)
- **Main street** (round the source: two behind it, two in front; always there, lit only while open): Corner Store (24 hours), Clock smith (Morning – Dusk), XACT change (Dawn – Afternoon), Gift Shop (entering it wipes the save; souvenirs are bought from your last Bright and kept).
- **Pop-ups** open on a bright clear whose surface collected enough of one thing (rank 1–3 by the `mapShop<Kind>1..3` tuners). One of each: a better rank moves the shop to the new clear and the old one is torn down. A Dark Remnant clear that earns one opens it on the nearest open bright hex or free spot in the source hex. Every turn, each cleared surface that earned a pop-up and has none open tries again (a hex a shop moved out of, a dark clear that found no room, a holiday). Every shop is drawn at main street's scale (`mapStreetSize`). Which opens first: the DUCK SHOP, then the best-ranked exotic one (NEUTRINOS, MAGNETS, the PULSE; a tie at random), then BRiGHT IDEAS, last Dim's.
- **Dim's Carnival of Discovery** (its secrets), each once a day: a Card of Secrets (50 bright: pick one of three face-down cards; what it hides, an event or Guide entry you have not found, is discovered for good and its own card is shown; gone from the menu once nothing is left), Fortune Telling (200: a good fortune named for a duck, or a dim one, for the day), a Daily Wonder (2,000: keep one of three bonuses with a catch). The draw and the card picked are shown by the surface over the map, in the one card format: what it changes in play set apart (monospace, ruled) from what is said of it (the flavour), and a live demo — a good fortune's own duck on the lake, a dim fortune's Dim or Dark Remnants (or the map rule it bends), a wonder's item at work.
- A shop's menu lists everything at once (a long list makes it taller): a tab for each thing it takes, by its symbol (named in the feed), every purse in the dock with the open tab's lit, the item under the cursor described in the feed, and Status at the right.
- **DUCK SHOP** also sells Luck Charms (+5% duck chance today, +1% on the next drop, ×10 the price each one, back to 5,000 each day) and the Lucky Duck (1,000,000, for good: base duck chances ×2, each miss +4%).
- Today's fortune, wonder and charms, and the Keys a fortune took, are the run's state in the surface's save (`run`); the Guide's **Status** tab (and the panel beside a shop's menu) shows them with the wallet, its caps and the upgrades bought.
- Duck types (`DUCK_TYPES`, surface): colours (six, then ☆ Crystalize and Eclipse, then ★ Rainbow), sizes (Microscopic, Wee, Tiny, Small, Big, Huge, Massive, Mega, ★ Big Head), materials (Wood, Silhouette (a Dark Remnant's beating glow round its outline, as it turns), Paper, Glass, Metal, Dim, Bright, Shining, ★ Gold). A roll picks rare (`duckRareChance`), then mid (`duckMidChance`), then the other exotics.
- Ducks: every Dark Remnant that is not a duck adds `duckLuckStep` (1%) to Duck chance, every classic duck adds it to Exotic chance; a hit rebases it. The luck is saved with the inventory (`luck`), so it carries across surfaces and days.
- Every item is a discovery (`dc_si_<id>`, Discoveries tab). One-time upgrades are kept as the discovery `up:<id>`; purse-cap upgrades raise `invMaxFor`.

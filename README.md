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
| `shared.js` | What the surface and the Surface Map draw the same way — the Dark Remnant's glow, the bow wake, and the rubber duck: its baked meshes and markings (`DUCK_MESH`) and its WebGL renderer (onto a 2D canvas, or straight into a 3D scene) |
| `shops/` | Shop art (SVG): buildings (`bld_s` small / main street, `bld_s_dark` Gift Shop, `bld_m` medium, `bld_l` large, `bld_t` tall, unused), the glass behind their windows (`glass_*`, white so each shop tints it) and the signs (`sign_<shop>`). The shops themselves, their hours and what they sell are `SHOPS` / `SHOP_ITEMS` in `shared.js` |
| `tools/build_duck_meshes.js` | Bakes the two 3D duck meshes (classic, Big Head) and the duck markings texture into `shared.js`, from `tools/Duck_Sheet.svg` (vector views: crisp markings, a lighter mesh, lines and eyes shaded by bump) or, with `DUCK_STRIP=tools/duck_strip.png`, the old pixel strip. First `cd tools && npm install` (SVG rendering), then `node tools/build_duck_meshes.js` after changing the drawing or the pipeline |

**New nebula versions must keep the name `chromatic_nebula.html`** — the map and title screen load it by that name. When you replace it, bump the `&v=` number on its `<iframe>` in `Surface_Map_HUB.html` and `TitleSplash.html` so browsers fetch the new copy instead of a cached one.

## The Guide
Every entry is a card in one format (name, a live demo, page and Tier I–V, then its details and live math, each behind its own discovery). Pages: **Discoveries** (how to play, how to clean up, and the events witnessed), **Taxonomy** (every kind of thing and what it becomes, drawn with the game's own glyphs; its cards below), Items, Shapes, Surface Map, **Shops** (each shop's card, only its sign's shape until you have been in; what it sells behind each item's discovery), Ducks, Glossary, Status. Going into a shop for the first time is an event.

## Saves (browser storage, per site)
- `chromaticNebulaInventory_v1` — items, resources, discoveries and the duck collection (kept by a new map)
- `nebula-config` — tuners, sound setting, hex-layer tuners
- `il_map_v1` — the Surface Map (pop-up shops live on their hexes)
- `il_souvenirs_v1` — Gift Shop souvenirs (kept through the Gift Shop's wipe)
- IndexedDB `infiniteLight` / `kv` / `session` — the unfinished surface, saved exactly when you leave it

## Keys
- **Esc** — pause menu (sound + volume, readouts, Guide, quit). On the map: sound, Guide, hex-layer tuners, quit.
- **~** (or H) — hide / show the panels, on a surface and on the Surface Map
- **Surface Map**: Modes (Telemetry: each hex's value, coverage and ring on the ground; Stats: fps, frame times and the hex grid; the Performance log) and Tune (every tuner, as on a surface). Lake ducks: brush one slowly and it spins, hit it fast and it putters off, click it and it is dunked
- **Space** / click your hex — enter its surface
- Map: drag to look around (the source stays in view); right-click to come back to your hex

## Shops (Surface Map)
- **Main street** (round the source: two behind it, two in front; always there, lit only while open): Corner Store (24 hours), Clock smith (Morning – Dusk), XACT change (Dawn – Afternoon), Gift Shop (entering it wipes the save; souvenirs are bought from your last Bright and kept).
- **Pop-ups** open on a bright clear whose surface collected enough of one thing (rank 1–3 by the `mapShop<Kind>1..3` tuners). One of each: a better rank moves the shop to the new clear and the old one is torn down. A Dark Remnant clear that earns one opens it in one of two spots in the source hex instead (a new shop only, never a move up). Which opens first: the DUCK SHOP, then the best-ranked exotic one (NEUTRINOS, MAGNETS, the PULSE; a tie at random), then BRiGHT IDEAS, last Dim's.
- **Dim's Carnival of Discovery** (its secrets): a Card of Secrets (50 bright: pick one of three face-down cards, an event or Guide entry discovered for good), Fortune Telling (200: a good fortune named for a duck, or a dim one, for the day), a Daily Wonder (2,000, once a day: keep one of three bonuses with a catch).
- **DUCK SHOP** also sells Luck Charms (+5% duck chance today, +1% on the next drop, ×10 the price each one, back to 5,000 each day) and the Lucky Duck (1,000,000, for good: base duck chances ×2, each miss +4%).
- Today's fortune, wonder and charms, and the Keys a fortune took, are the run's state in the surface's save (`run`); the Guide's **Status** tab (and the panel beside a shop's menu) shows them with the wallet, its caps and the upgrades bought.
- Ducks: every Dark Remnant that is not a duck adds `duckLuckStep` (1%) to Duck chance, every classic duck adds it to Exotic chance; a hit rebases it. The luck is saved with the inventory (`luck`), so it carries across surfaces and days.
- Every item is a discovery (`dc_si_<id>`, Discoveries tab). One-time upgrades are kept as the discovery `up:<id>`; purse-cap upgrades raise `invMaxFor`.

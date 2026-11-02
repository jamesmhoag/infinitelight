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
| `tools/build_duck_meshes.js` | Bakes the two 3D duck meshes (classic, Big Head) and the duck markings texture into `shared.js`, from `tools/Duck_Sheet.svg` (vector views: crisp markings, a lighter mesh, lines and eyes shaded by bump) or, with `DUCK_STRIP=tools/duck_strip.png`, the old pixel strip. First `cd tools && npm install` (SVG rendering), then `node tools/build_duck_meshes.js` after changing the drawing or the pipeline |

**New nebula versions must keep the name `chromatic_nebula.html`** — the map and title screen load it by that name. When you replace it, bump the `&v=` number on its `<iframe>` in `Surface_Map_HUB.html` and `TitleSplash.html` so browsers fetch the new copy instead of a cached one.

## Saves (browser storage, per site)
- `chromaticNebulaInventory_v1` — items, resources, discoveries and the duck collection (kept by a new map)
- `nebula-config` — tuners, sound setting, hex-layer tuners
- `il_map_v1` — the Surface Map
- IndexedDB `infiniteLight` / `kv` / `session` — the unfinished surface, saved exactly when you leave it

## Keys
- **Esc** — pause menu (sound + volume, readouts, Guide, quit). On the map: sound, Guide, hex-layer tuners, quit.
- **~** (or H) — hide / show the panels on a surface
- **Space** / click your hex — enter its surface

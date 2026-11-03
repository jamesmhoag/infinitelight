# Content

The game's lists, prices, tuned values and text live in these CSV files. Edit them in a spreadsheet or a text editor, save, and reload the game. Every page reads them as it loads, so no code change and no version bump is needed.

## How the files work

- **Commas, quotes and line breaks.** Keep the header row. A cell with a comma, a quote or a line break is wrapped in `"…"`, and a quote inside it is doubled (`""`). Spreadsheets do this for you.
- **`{…}` in text.** Braces are filled in as the text shows:
  - `{0}`, `{1}`… are values the code passes in, such as a count or a name. Keep them, but you can move them around the sentence.
  - Anything else in braces is worked out from the game's state. For example, `{Math.round(T.duckChance*100)}` shows the current duck chance as a percentage.
- **Empty cells.** An empty cell means "none" or "not set".
- **Ids.** Ids (`id`, `key`) are how the code finds a row, so don't rename them. New rows of a kind the code already handles work straight away, for example a new shop item using an existing effect.

## The files

| File | What it holds | Columns |
|---|---|---|
| `tuners.csv` | Every tuned value and the Tune menu's sliders, in menu order. A new `section` or `tab` value starts a new section or tab. Rows with no `label` have no slider and set the value only. | `key`, `default`, `label`, `min`, `max`, `step`, `section`, `tab` (theme, gameplay, sounds, map, discoveries), `type` / `options` (a choice: options separated by `|`), `test` (a sound test button's code), `tip`, `note` |
| `discoveries.csv` | The interface elements that are discovered by holding Dim, and how much each needs. | `group`, `id`, `name`, `cost` |
| `shops.csv` | The shops: name, tagline and description, hours (main street) or pop-up ranks (`rank1`–`rank3`: how much of `currency` a surface must collect to open each rank). | `id`, `name`, `tag`, `about`, `street`, `open`, `close`, `col` (its glass colour), `angle`, `building`, `flip`, `currency`, `rank1`, `rank2`, `rank3` |
| `shop_items.csv` | What each shop sells, and for how much. | `id`, `shop`, `name`, `cost`, `currency` (empty: the shop's own), `rank` (the pop-up rank that first carries it), `effect` (JSON, see below), `requires` (an item to own first), `discover_dim`, `note` |
| `fortunes.csv` | Dim's Carnival. `good`: one row per duck, with its `effect` (JSON). `dim`: the dim fortunes. `wonder`: the Daily Wonders. | `kind`, `id`, `item`, `name`, `effect`, `telling` (the flavour line; `{0}` is the duck), `does` (the change to play), `scene` (a wonder card's live demo) |
| `events.csv` | Event cards: the discoveries witnessed. | `id`, `name`, `type`, `rarity` (c, u, r, m), `scene`, `icon`, `facts` (one per line), `flavor` |
| `guide.csv` | The Guide's entries. | `id`, `tab`, `name`, `icon`, `text`, `details` (one per line: `label | text`) |
| `ducks.csv` | Every duck. | `id`, `name`, `axis`, `detail`, `tex`, `mat`, `col` / `col2` (body and beak as `r g b`), `scale`, `head`, `body`, `rare`, `mid` |
| `letters.csv` | The messages in the bottles. Add new ones at the end: the letters you've found are saved by their position. | `n`, `text`, `from` |
| `strings.csv` | Every other piece of text: buttons, feed messages, hints, menus, card labels, Status. | `key`, `text`, `where` (which part of the game) |

## Shop item effects (`effect`)

Each effect is written as JSON. These are the kinds the code handles now:

- **Give items:** `{"give":{"leash":1}}`. The kinds are `leash` (Spindle), `dial` (String), `weave`, `prism`, `knot`, `gate`, `key`, `lens`, `bright`, `dim`, `neutron`, `magnetic` and `pulsing`.
- **Raise a purse cap:** `{"cap":{"pulsing":9999}}`.
- **Set the map's clock:** `{"clock":18}`.
- **Give a duck:** `{"duck":"roll"}`. The other values are `exotic` and `pick`.
- **Draw a Carnival card:** `{"draw":"fortune"}`. The other values are `secret` and `daily`.
- **Luck Charm:** `{"charm":1}`.
- **Gift Shop souvenir:** `{"souv":1}`.
- **Reveal an interface element:** `{"disc":"<id>"}`.
- **Upgrade still to be made:** `{"up":1}`. This marks an upgrade whose effect isn't built yet; it's bought once and kept.

A new kind of effect needs code before it does anything. Until then, use `{"up":1}` for it.

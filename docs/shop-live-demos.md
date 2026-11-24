# Shop item live demos

Each shop item's shelf card plays a live demo. Status: **ok** — its demo shows the benefit; **approx** — a related demo stands in for now; **new** — needs a new demo (proposed below). Totals: 16 ok, 58 approx, 175 new — 33 distinct new demos (one demo can serve many items: e.g. `hub:wreckhold` 24 items, `exchange` 24, `buoymodel` 21, `capacity` 16).

A card's demo is set in `content/shop_items.csv`, column `demo` (a scene name; `hub:` scenes play on the map). Proposed new scene names are grouped so one demo can serve many items (e.g. `buoymodel`, `capacity`, `exchange`).

## CORNER STORE

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Bottle of water (`water`) | ok | `hub:bottle` | Already shows the bottle. |
| Spindle (`spindle`) | ok | `unwind` | Already shows the item at work. |
| String (`string`) | ok | `stringhome` | Already shows the item at work. |
| Weave (`weave`) | ok | `weave` | Already shows the item at work. |
| Prism (`prism`) | ok | `prism` | Already shows the item at work. |
| Knot (`knot`) | ok | `knot` | Already shows the item at work. |
| Lens (`lens`) | ok | `lens` | Already shows the item at work. |
| Prisms on Sectors (`s_prism`) | approx | `prism` | A related demo (prism); a new one should show this upgrade's specific benefit. |
| Prisms on the Center (`c_prism`) | approx | `prism` | A related demo (prism); a new one should show this upgrade's specific benefit. |
| Barrel refill (`refill`) | new | `hub:water` | The dock's water counter: refilled to the top, a move drinking one. |
| Walkman (`walkman`) | new | `hub:walkman` | The Walkman playing a tape with the gramophone gone (music note in the dock). |
| Tape: Pocket Spill (`tape_1`) | new | `hub:walkman` | The Walkman playing a tape with the gramophone gone (music note in the dock). |
| Batteries (4) (`batt_corner`) | new | `hub:battery` | Morning: batteries paying for the Alarm clock and the Walkman; one short and its gear goes dark. |

## Clock smith.

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Twilight (`twilight`) | new | `hub:clockjump` | The day's clock dial spinning from now to Twilight on the map, the light changing with it. |
| Dawn (`dawn`) | new | `hub:clockjump` | The day's clock dial spinning from now to Dawn on the map, the light changing with it. |
| Morning (`morning`) | new | `hub:clockjump` | The day's clock dial spinning from now to Morning on the map, the light changing with it. |
| Midday (`noon`) | new | `hub:clockjump` | The day's clock dial spinning from now to Midday on the map, the light changing with it. |
| Afternoon (`afternoon`) | new | `hub:clockjump` | The day's clock dial spinning from now to Afternoon on the map, the light changing with it. |
| Dusk (`dusk`) | new | `hub:clockjump` | The day's clock dial spinning from now to Dusk on the map, the light changing with it. |
| Evening (`night`) | new | `hub:clockjump` | The day's clock dial spinning from now to Evening on the map, the light changing with it. |
| Midnight (`midnight`) | new | `hub:clockjump` | The day's clock dial spinning from now to Midnight on the map, the light changing with it. |
| Alarm clock (`alarm`) | new | `hub:alarm` | Resting at Dusk: the alarm rings and you wake two times of day later instead of sleeping through. |
| Wake-up call (`wakecall`) | new | `hub:wakecall` | Sleeping past Midnight: the wake-up call rings at Dawn instead of Morning. |
| Yesterday, this time (`yesterday`) | new | `hub:timetravel` | The map rewinding / skipping a whole day at the same time of day. |
| Tomorrow, this time (`tomorrow`) | new | `hub:timetravel` | The map rewinding / skipping a whole day at the same time of day. |

## INFINITE LINE

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Ink (`xb_dim_100`) | new | `exchange` | The purse counter: Bright going out, dim coming in, at the rate. |
| Ink (`xb_dim_10000`) | new | `exchange` | The purse counter: Bright going out, dim coming in, at the rate. |
| Ink (`xb_dim_1000000`) | new | `exchange` | The purse counter: Bright going out, dim coming in, at the rate. |
| Deeper Well (`p_dim`) | ok | `` | Already shows the pouch item's effect. |
| Nib shine 1>5 (`act5`) | ok | `cap` | Already shows the nib holding more shining things at once. |
| Nib shine 5>15 (`act15`) | ok | `cap` | Already shows the nib holding more shining things at once. |
| Nib shine 15>30 (`act30`) | ok | `cap` | Already shows the nib holding more shining things at once. |
| Light wipe (`wipe_up`) | new | `heat_wipe_up` | The gesture played twice side by side: the heat bar rising half as fast with the upgrade. |
| Quick double dab (`dbl_up`) | new | `heat_dbl_up` | The gesture played twice side by side: the heat bar rising half as fast with the upgrade. |
| Easy mop (`mop_up`) | new | `heat_mop_up` | The gesture played twice side by side: the heat bar rising half as fast with the upgrade. |
| Max Prisms 10>50 (`cap_prism50`) | new | `capacity` | The pouch slot for Prisms filling past its old cap (10 → 50). |
| Max Prisms 50>99 (`cap_prism99`) | new | `capacity` | The pouch slot for Prisms filling past its old cap (50 → 99). |
| Max Knots 10>50 (`cap_knot50`) | new | `capacity` | The pouch slot for Knots filling past its old cap (10 → 50). |
| Max Knots 50>99 (`cap_knot99`) | new | `capacity` | The pouch slot for Knots filling past its old cap (50 → 99). |
| Max Lens 10>50 (`cap_lens50`) | new | `capacity` | The pouch slot for Lens filling past its old cap (10 → 50). |
| Max Lens 50>99 (`cap_lens99`) | new | `capacity` | The pouch slot for Lens filling past its old cap (50 → 99). |
| Max Keys 10>50 (`cap_key50`) | new | `capacity` | The pouch slot for Keys filling past its old cap (10 → 50). |
| Max Keys 50>99 (`cap_key99`) | new | `capacity` | The pouch slot for Keys filling past its old cap (50 → 99). |
| Max Gates 10>50 (`cap_gate50`) | new | `capacity` | The pouch slot for Gates filling past its old cap (10 → 50). |
| Max Gates 50>99 (`cap_gate99`) | new | `capacity` | The pouch slot for Gates filling past its old cap (50 → 99). |

## XACT change

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Magnetic (`xb_magnetic_100`) | new | `exchange` | The purse counter: Bright going out, magnetic coming in, at the rate. |
| Magnetic (`xb_magnetic_10000`) | new | `exchange` | The purse counter: Bright going out, magnetic coming in, at the rate. |
| Magnetic (`xb_magnetic_1000000`) | new | `exchange` | The purse counter: Bright going out, magnetic coming in, at the rate. |
| Neutron (`xb_neutron_100`) | new | `exchange` | The purse counter: Bright going out, neutron coming in, at the rate. |
| Neutron (`xb_neutron_10000`) | new | `exchange` | The purse counter: Bright going out, neutron coming in, at the rate. |
| Neutron (`xb_neutron_1000000`) | new | `exchange` | The purse counter: Bright going out, neutron coming in, at the rate. |
| Pulsing (`xb_pulsing_100`) | new | `exchange` | The purse counter: Bright going out, pulsing coming in, at the rate. |
| Pulsing (`xb_pulsing_10000`) | new | `exchange` | The purse counter: Bright going out, pulsing coming in, at the rate. |
| Pulsing (`xb_pulsing_1000000`) | new | `exchange` | The purse counter: Bright going out, pulsing coming in, at the rate. |
| Bright (`xs_dim_100`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_dim_10000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_dim_1000000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_magnetic_100`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_magnetic_10000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_magnetic_1000000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_neutron_100`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_neutron_10000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_neutron_1000000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_pulsing_100`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_pulsing_10000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |
| Bright (`xs_pulsing_1000000`) | new | `exchange` | The purse counter: Bright going out, Bright coming in, at the rate. |

## GIFT SHOP

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Postcard (`postcard`) | new | `souvenir` | The souvenir itself, turning (kept through the Gift Shop's wipe). |
| Key Chain (`keychain`) | new | `souvenir` | The souvenir itself, turning (kept through the Gift Shop's wipe). |
| Hat (`hat`) | new | `souvenir` | The souvenir itself, turning (kept through the Gift Shop's wipe). |
| Stuffy (`stuffy`) | new | `souvenir` | The souvenir itself, turning (kept through the Gift Shop's wipe). |
| T-shirt (`tshirt`) | new | `souvenir` | The souvenir itself, turning (kept through the Gift Shop's wipe). |
| Souvenir vinyl: Strobe Lake (`vinyl_e`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Souvenir vinyl: Lantern Waltz (`vinyl_s`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |

## BRiGHT IDEAS

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Constellation light limit 3>4 (`cl4`) | approx | `weave` | A related demo (weave); a new one should show this upgrade's specific benefit. |
| Item shape light limit 3>4 (`sh4`) | approx | `barrier` | A related demo (barrier); a new one should show this upgrade's specific benefit. |
| Gates on the Center (`c_gate`) | approx | `gate` | A related demo (gate); a new one should show this upgrade's specific benefit. |
| Freeze frame (`p_bright`) | ok | `` | Already shows the pouch item's effect. |
| Constellation light limit 4>5 (`cl5`) | approx | `weave` | A related demo (weave); a new one should show this upgrade's specific benefit. |
| Item shape light limit 4>5 (`sh5`) | approx | `barrier` | A related demo (barrier); a new one should show this upgrade's specific benefit. |
| 0.5 × game speed (`spd05`) | new | `speed` | The same surface running at 0.5× beside 1×. |
| 2.0 × game speed (`spd2`) | new | `speed` | The same surface running at 2.0× beside 1×. |
| Keys on the Center (`c_key`) | approx | `itemcache` | A related demo (itemcache); a new one should show this upgrade's specific benefit. |
| Fill constellations with Lens (`cl_lens`) | approx | `weave` | A related demo (weave); a new one should show this upgrade's specific benefit. |
| Fill constellations with Gates (`cl_gate`) | approx | `weave` | A related demo (weave); a new one should show this upgrade's specific benefit. |
| Fill item shapes with Lens (`sh_lens`) | approx | `barrier` | A related demo (barrier); a new one should show this upgrade's specific benefit. |
| Fill item shapes with Gates (`sh_gate`) | approx | `barrier` | A related demo (barrier); a new one should show this upgrade's specific benefit. |
| A Lens on a dialing orbit (`orbit_lens`) | approx | `lens` | A related demo (lens); a new one should show this upgrade's specific benefit. |
| 0.0 × game speed (`spd0`) | new | `speed` | The same surface running at 0.0× beside 1×. |
| 8.0 × game speed (`spd8`) | new | `speed` | The same surface running at 8.0× beside 1×. |
| Item shape rectangles from 2 lights (`rect2`) | approx | `barrier` | A related demo (barrier); a new one should show this upgrade's specific benefit. |
| Wrap Lens with constellations (`w_lens_c`) | approx | `weave` | A related demo (weave); a new one should show this upgrade's specific benefit. |
| Wrap Gates with constellations (`w_gate_c`) | approx | `weave` | A related demo (weave); a new one should show this upgrade's specific benefit. |
| Wrap Gates with item shapes (`w_gate_s`) | approx | `barrier` | A related demo (barrier); a new one should show this upgrade's specific benefit. |
| Use Faint Remnants (`u_dim`) | approx | `depth` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Use Bright Remnants (`u_bright`) | approx | `balance` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Use Neutron Remnants (`u_neu`) | approx | `dynamism` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Use Magnetic Remnants (`u_mag`) | approx | `harmony` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Use Pulsing Remnants (`u_pul`) | approx | `rhythm` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Random Duck (`d_bright`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Pure Brightness (`pure_bright`) | approx | `balance` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Mast mount strength I (`hold_top1`) | new | `hub:wreckhold` | A wreck at Midnight: the mast mount's item rattling but holding (I). |
| Mast mount strength II (`hold_top2`) | new | `hub:wreckhold` | A wreck at Midnight: the mast mount's item rattling but holding (II). |
| Mast mount strength III (`hold_top3`) | new | `hub:wreckhold` | A wreck at Midnight: the mast mount's item rattling but holding (III). |
| Riser mounts strength I (`hold_mast1`) | new | `hub:wreckhold` | A wreck at Midnight: the riser mounts's item rattling but holding (I). |
| Riser mounts strength II (`hold_mast2`) | new | `hub:wreckhold` | A wreck at Midnight: the riser mounts's item rattling but holding (II). |
| Riser mounts strength III (`hold_mast3`) | new | `hub:wreckhold` | A wreck at Midnight: the riser mounts's item rattling but holding (III). |
| Deck mount strength I (`hold_deck1`) | new | `hub:wreckhold` | A wreck at Midnight: the deck mount's item rattling but holding (I). |
| Deck mount strength II (`hold_deck2`) | new | `hub:wreckhold` | A wreck at Midnight: the deck mount's item rattling but holding (II). |
| Deck mount strength III (`hold_deck3`) | new | `hub:wreckhold` | A wreck at Midnight: the deck mount's item rattling but holding (III). |
| Hull mount strength I (`hold_hull1`) | new | `hub:wreckhold` | A wreck at Midnight: the hull mount's item rattling but holding (I). |
| Hull mount strength II (`hold_hull2`) | new | `hub:wreckhold` | A wreck at Midnight: the hull mount's item rattling but holding (II). |
| Hull mount strength III (`hold_hull3`) | new | `hub:wreckhold` | A wreck at Midnight: the hull mount's item rattling but holding (III). |
| Swoop net (`swoop`) | new | `net_swoop` | Hold-and-sweep: the net swept across, taking every remnant of the first kind it touched. |
| Big hoop (`hoop1`) | new | `net_hoop1` | A double dab: the big hoop swelling out and taking every remnant of that kind in reach. |
| Really big hoop (`hoop2`) | new | `net_hoop2` | The same double dab with the really big hoop: a wider reach. |
| Metal strainer (`strainer`) | new | `net_exotic` | The net dabbing an exotic remnant: without the gear it passes through; with it, it is caught. |
| Vast mesh (`mesh`) | new | `net_exotic` | The net dabbing an exotic remnant: without the gear it passes through; with it, it is caught. |
| Electric fence (`fence`) | new | `net_exotic` | The net dabbing an exotic remnant: without the gear it passes through; with it, it is caught. |
| Trolling net (`troll`) | new | `hub:troll` | The buoy sailing across bright clears, the net trailing, +Bright counting up per clear crossed. |
| Bright processing (`proc_bright`) | new | `processing` | A collected remnant's value ticking up: 1 → 10 × energy (or its stacked statuses added; a relic × more). |
| Magnetic processing (`proc_magnetic`) | new | `processing` | A collected remnant's value ticking up: 1 → 10 × energy (or its stacked statuses added; a relic × more). |
| Neutron processing (`proc_neutron`) | new | `processing` | A collected remnant's value ticking up: 1 → 10 × energy (or its stacked statuses added; a relic × more). |
| Pulsing processing (`proc_pulsing`) | new | `processing` | A collected remnant's value ticking up: 1 → 10 × energy (or its stacked statuses added; a relic × more). |
| Relic refinery (`proc_relic`) | new | `processing` | A collected remnant's value ticking up: 1 → 10 × energy (or its stacked statuses added; a relic × more). |
| Bright compartment (`chest_bright`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Bright compartment 99,999 (`chest_bright2`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Bright compartment 9,999,999 (`chest_bright3`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Dim compartment (`chest_dim`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Dim compartment 99,999 (`chest_dim2`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Dim compartment 9,999,999 (`chest_dim3`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Magnetic compartment (`chest_magnetic`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Magnetic compartment 9,999 (`chest_magnetic2`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Neutron compartment (`chest_neutron`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Neutron compartment 9,999 (`chest_neutron2`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Pulsing compartment (`chest_pulsing`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Pulsing compartment 9,999 (`chest_pulsing2`) | new | `chest` | The treasure chest opening: a new compartment for this remnant, its counter running up to the new size. |
| Max Spindles 10>50 (`cap_leash50`) | new | `capacity` | The pouch slot for Spindles filling past its old cap (10 → 50). |
| Max Spindles 50>99 (`cap_leash99`) | new | `capacity` | The pouch slot for Spindles filling past its old cap (50 → 99). |
| Max Strings 10>50 (`cap_dial50`) | new | `capacity` | The pouch slot for Strings filling past its old cap (10 → 50). |
| Max Strings 50>99 (`cap_dial99`) | new | `capacity` | The pouch slot for Strings filling past its old cap (50 → 99). |
| Max Weaves 10>50 (`cap_weave50`) | new | `capacity` | The pouch slot for Weaves filling past its old cap (10 → 50). |
| Max Weaves 50>99 (`cap_weave99`) | new | `capacity` | The pouch slot for Weaves filling past its old cap (50 → 99). |
| Trash can (`trashcan`) | new | `net_trash` | The net scooping a piece of non-paper trash into the bag. |
| Metal scoop (`tr_metal`) | new | `net_trash` | The net scooping a piece of metal trash into the bag. |
| Plastic scoop (`tr_plastic`) | new | `net_trash` | The net scooping a piece of plastic trash into the bag. |
| Glass scoop (`tr_glass`) | new | `net_trash` | The net scooping a piece of glass trash into the bag. |
| Fabric scoop (`tr_fabric`) | new | `net_trash` | The net scooping a piece of fabric trash into the bag. |
| Recycling plant seed (`seed`) | new | `hub:plant` | A seed planted on a Dark Remnant, fed trash, growing stage by stage to a bud, blooming at Midnight. |
| Batteries (4) (`batt_bright`) | new | `hub:battery` | Morning: batteries paying for the Alarm clock and the Walkman; one short and its gear goes dark. |

## Dim’s: Carnival of Discovery

| Item | Status | Demo | What it should show |
|---|---|---|---|
| A Card of Secrets (`secret`) | new | `dimdraw` | Dim's draw: cards dealt face down and one turned. |
| Fortune Telling (`fortune`) | new | `dimdraw` | Dim's draw: cards dealt face down and one turned. |
| A Daily Wonder (`wonder`) | new | `dimdraw` | Dim's draw: cards dealt face down and one turned. |
| Carnival prize: a record (`recprize`) | new | `dimdraw` | Dim's draw: cards dealt face down and one turned. |
| Dark Remnant takes the predominant hue (`dk_hue`) | approx | `dark` | The Dark Remnant demo; a new one should show its hue / rainbow change. |
| Rainbow Dark Remnant when the balance is bright (`dk_rainbow`) | approx | `dark` | The Dark Remnant demo; a new one should show its hue / rainbow change. |
| Admission (`admission`) | new | `hub:dimgate` | Dim's gate opening: a ticket torn, the carnival lit. |
| Kaleidoscope (`kaleido`) | new | `singdraw_kaleido` | The new day's singularity draw dealing a 4th card. |
| Pinwheel (`pinwheel`) | new | `singdraw_pinwheel` | A dealt singularity flipping to the next tier up. |
| Yo-yo (`yoyo`) | new | `singdraw_yoyo` | The draw with a Pass button taken. |
| Snow globe (`snowglobe`) | new | `singdraw_snowglobe` | An empty deck shuffled back full from the discards. |

## premium NEUTRINOS

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Knots on Sectors (`s_knot`) | approx | `knot` | A related demo (knot); a new one should show this upgrade's specific benefit. |
| Lens on Sectors (`s_lens`) | approx | `lens` | A related demo (lens); a new one should show this upgrade's specific benefit. |
| Knots on the Center (`c_knot`) | approx | `knot` | A related demo (knot); a new one should show this upgrade's specific benefit. |
| Neutron as an item from the pouch (`p_neu`) | ok | `` | Already shows the pouch item's effect. |
| Lens on the Center (`c_lens`) | approx | `lens` | A related demo (lens); a new one should show this upgrade's specific benefit. |
| Wrap Lens with item shapes (`w_lens_s`) | approx | `barrier` | A related demo (barrier); a new one should show this upgrade's specific benefit. |
| Protractor (`radii`) | approx | `readouts` | The readouts demo; a new one should show just this gadget's readout. |
| Spectrometer (`spectro`) | approx | `readouts` | The readouts demo; a new one should show just this gadget's readout. |
| Camera (`camera`) | approx | `readouts` | The readouts demo; a new one should show just this gadget's readout. |
| Needle (`needle`) | approx | `unwind` | A related demo (unwind); a new one should show this upgrade's specific benefit. |
| Spool of chromatic yarn (`spool`) | approx | `stringhome` | A related demo (stringhome); a new one should show this upgrade's specific benefit. |
| Weaving Loom (`loom`) | approx | `weave` | A related demo (weave); a new one should show this upgrade's specific benefit. |
| Pure Density (`pure_neu`) | approx | `dynamism` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Random Duck Variant (`d_neu`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Telescope (`telem`) | approx | `readouts` | The readouts demo; a new one should show just this gadget's readout. |
| Batteries (4) (`batt_neutron`) | new | `hub:battery` | Morning: batteries paying for the Alarm clock and the Walkman; one short and its gear goes dark. |

## MAGNETS & STUFF

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Magnetic as an item from the pouch (`p_mag`) | ok | `` | Already shows the pouch item's effect. |
| Pure Harmony (`pure_mag`) | approx | `harmony` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Anchor (`anchor`) | new | `buoymodel` | The buoy turning with this fitted on its hull mount, then the item doing its job: Hull mount. Down, the tide cannot carry you when you rest (moving raises it; the |
| Mini fridge (`fridge`) | ok | `hub:bottle` | Already shows the bottle. |
| Rudder (`rudder`) | new | `buoymodel` | The buoy turning with this fitted on its hull mount, then the item doing its job: Hull mount. At the helm (awake), it steers you through the wreck a Rift you tear |
| Motor (`motor`) | new | `buoymodel` | The buoy turning with this fitted on its hull mount, then the item doing its job: Hull mount. Keeps your buoy from wrecking, at Midnight and in a Rift |
| Horseshoe magnet (`magnet`) | new | `buoymodel` | The buoy turning with this fitted on its hull mount, then the item doing its job: Hull mount. Goods floating on the lake are drawn your way, and do not drift off  |
| Fresh water barrel (`barrel`) | new | `hub:water` | The dock's water counter: 3 drinks, a move drinking one. |
| Water cooler (`cooler`) | new | `hub:water` | The dock's water counter: 6 drinks, a move drinking one. |
| Batteries (4) (`batt_magnetic`) | new | `hub:battery` | Morning: batteries paying for the Alarm clock and the Walkman; one short and its gear goes dark. |

## DUCK SHOP

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Random Duck Variant (`d_mag`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Flip a Duck (`flip`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Exotic Duck (`exotic`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Pick a Duck (`pickduck`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Luck Charm (`charm`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Lucky Duck (`lucky`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |

## the PULSE

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Strings on Sectors (`s_dial`) | approx | `stringhome` | A related demo (stringhome); a new one should show this upgrade's specific benefit. |
| Spindles on Sectors (`s_leash`) | approx | `unwind` | A related demo (unwind); a new one should show this upgrade's specific benefit. |
| Strings on the Center (`c_dial`) | approx | `stringhome` | A related demo (stringhome); a new one should show this upgrade's specific benefit. |
| Pulsing as an item from the pouch (`p_pul`) | ok | `` | Already shows the pouch item's effect. |
| Gates on Sectors (`s_gate`) | approx | `gate` | A related demo (gate); a new one should show this upgrade's specific benefit. |
| Spindles on the Center (`c_leash`) | approx | `unwind` | A related demo (unwind); a new one should show this upgrade's specific benefit. |
| Keys on Sectors (`s_key`) | approx | `itemcache` | A related demo (itemcache); a new one should show this upgrade's specific benefit. |
| String auto-fire (`autofire`) | approx | `stringhome` | A related demo (stringhome); a new one should show this upgrade's specific benefit. |
| String rapid fire rate (`rapid`) | approx | `stringhome` | A related demo (stringhome); a new one should show this upgrade's specific benefit. |
| String double-click blast (`blast`) | approx | `stringhome` | A related demo (stringhome); a new one should show this upgrade's specific benefit. |
| Pure Rhythm (`pure_pul`) | approx | `rhythm` | The effect's own demo; a new one should show what the upgrade changes about it. |
| Random Duck Variant (`d_pul`) | approx | `duck` | The duck demo; a new one should show this item's duck effect. |
| Gramophone (`record`) | new | `buoymodel` | The buoy turning with this fitted on its deck mount, then the item doing its job: Deck mount. Plays your records (the dock's ♪) through its great horn, starting w |
| Record: Pulse Width (`rec_e1`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Neutron Drop (`rec_e2`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Magnetic North (`rec_e3`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Strobe Lake (`rec_e4`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Duck Bass (`rec_e5`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Diamond-soled shoes (`shoes`) | new | `hub:cross` | The buoy crossing a bright clear to the open hex past it (blocked without the gear). |
| Black Heart bow tie (`bowtie`) | new | `hub:cross` | The buoy crossing a Dark Remnant to the open hex past it (blocked without the gear). |
| Rift waders (`waders`) | new | `hub:cross` | The buoy crossing a Rift to the open hex past it (blocked without the gear). |
| Tape: Tide on Side B (`tape_2`) | new | `hub:walkman` | The Walkman playing a tape with the gramophone gone (music note in the dock). |
| Tape: Overture, Dubbed (`tape_3`) | new | `hub:walkman` | The Walkman playing a tape with the gramophone gone (music note in the dock). |
| Batteries (4) (`batt_pulsing`) | new | `hub:battery` | Morning: batteries paying for the Alarm clock and the Walkman; one short and its gear goes dark. |

## CUSTOM HULLS

| Item | Status | Demo | What it should show |
|---|---|---|---|
| Wooden float (`f_wood`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Metal float (`f_metal`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Glass float (`f_glass`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Ice float (`f_ice`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Gold float (`f_gold`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Dim float (`f_dim`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Bright float (`f_bright`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Chromatic float (`f_chromatic`) | new | `buoymodel` | The buoy turning on the water with this float fitted. |
| Four-mount mast (`m_four`) | new | `buoymodel` | The buoy turning, its mast/light with the new mounts fitted (empty mounts marked). |
| Twin-hook mast (`m_twin`) | new | `buoymodel` | The buoy turning, its mast/light with the new mounts fitted (empty mounts marked). |
| Triple twin-hook mast (`m_triple`) | new | `buoymodel` | The buoy turning, its mast/light with the new mounts fitted (empty mounts marked). |
| Six-mount mast (`m_six`) | new | `buoymodel` | The buoy turning, its mast/light with the new mounts fitted (empty mounts marked). |
| Twin-hook spotlight (`l_twin`) | new | `buoymodel` | The buoy turning, its mast/light with the new mounts fitted (empty mounts marked). |
| Pennant (`pennant`) | new | `buoymodel` | The buoy turning with this fitted on its top mount, then the item doing its job: Flown from the mast mount |
| Wind chime (`chime`) | new | `buoymodel` | The buoy turning with this fitted on its mast mount, then the item doing its job: Hung from a riser mount |
| Drone (`drone`) | new | `buoymodel` | The buoy turning with this fitted on its top mount, then the item doing its job: Mast mount. Click a shop you are not beside: it flies there and you shop as if y |
| Record: Nocturne for a Buoy (`rec_s1`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Lantern Waltz (`rec_s2`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Adagio of the Spill (`rec_s3`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Hull Overture (`rec_s4`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Record: Dim Carnival Suite (`rec_s5`) | new | `hub:gramophone` | The gramophone on the deck, horn up, a record turning and its music playing. |
| Mast mount strength IV (`hold_top4`) | new | `hub:wreckhold` | A wreck at Midnight: the mast mount's item rattling but holding (IV). |
| Mast mount strength V (`hold_top5`) | new | `hub:wreckhold` | A wreck at Midnight: the mast mount's item rattling but holding (V). |
| Mast mount strength VI (`hold_top6`) | new | `hub:wreckhold` | A wreck at Midnight: the mast mount's item rattling but holding (VI). |
| Riser mounts strength IV (`hold_mast4`) | new | `hub:wreckhold` | A wreck at Midnight: the riser mounts's item rattling but holding (IV). |
| Riser mounts strength V (`hold_mast5`) | new | `hub:wreckhold` | A wreck at Midnight: the riser mounts's item rattling but holding (V). |
| Riser mounts strength VI (`hold_mast6`) | new | `hub:wreckhold` | A wreck at Midnight: the riser mounts's item rattling but holding (VI). |
| Deck mount strength IV (`hold_deck4`) | new | `hub:wreckhold` | A wreck at Midnight: the deck mount's item rattling but holding (IV). |
| Deck mount strength V (`hold_deck5`) | new | `hub:wreckhold` | A wreck at Midnight: the deck mount's item rattling but holding (V). |
| Deck mount strength VI (`hold_deck6`) | new | `hub:wreckhold` | A wreck at Midnight: the deck mount's item rattling but holding (VI). |
| Hull mount strength IV (`hold_hull4`) | new | `hub:wreckhold` | A wreck at Midnight: the hull mount's item rattling but holding (IV). |
| Hull mount strength V (`hold_hull5`) | new | `hub:wreckhold` | A wreck at Midnight: the hull mount's item rattling but holding (V). |
| Hull mount strength VI (`hold_hull6`) | new | `hub:wreckhold` | A wreck at Midnight: the hull mount's item rattling but holding (VI). |

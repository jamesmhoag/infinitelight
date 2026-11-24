# Shop item cards: model and live demo

Each shelf card shows **the item itself, turning slowly** (`itemModel`: a collectable model by its form, `itemForm`; a duck item shows a duck), and **pointed at, its live demo** of what it does. Where the item has one, that demo is a **drawing** (`ITEM_DRAW`, chosen by `itemDraw`): white ink and glowing pigment on black, the way the Journal draws, looping on the card itself — e.g. the pen nib with the number of glowing pigments it now holds round it, the net's swoop or hoop taking what it reaches, a constellation or item shape drawn edge by edge, a prism/knot/lens set on the centre or the sectors. Otherwise the surface's live scene plays (`itemScene`).

Set by hand in `content/shop_items.csv`: `demo` (a scene name: plays that live scene instead of the drawing) and `model` (a form name for its turning model).

Totals: 201 items drawn, 48 on a live scene.

## CORNER STORE

| Item | Model | Pointed at |
|---|---|---|
| Bottle of water (`water`) | bottle | drawing `water` (1) |
| Spindle (`spindle`) | spindle | drawing `give` (leash/1) |
| String (`string`) | coil | drawing `give` (dial/1) |
| Weave (`weave`) | weave | drawing `give` (weave/1) |
| Prism (`prism`) | prism | drawing `give` (prism/1) |
| Knot (`knot`) | knot | drawing `give` (knot/1) |
| Lens (`lens`) | lens | drawing `give` (lens/1) |
| Prisms on Sectors (`s_prism`) | shape | drawing `place` (prism/s) |
| Prisms on the Center (`c_prism`) | constel | drawing `place` (prism/c) |
| Barrel refill (`refill`) | barrel | drawing `water` (3) |
| Walkman (`walkman`) | walkman | drawing `music` |
| Tape: Pocket Spill (`tape_1`) | tape | drawing `music` |
| Batteries (4) (`batt_corner`) | battery | drawing `batt` |

## Clock smith.

| Item | Model | Pointed at |
|---|---|---|
| Twilight (`twilight`) | clock | drawing `clock` (3) |
| Dawn (`dawn`) | clock | drawing `clock` (6) |
| Morning (`morning`) | clock | drawing `clock` (9) |
| Midday (`noon`) | clock | drawing `clock` (12) |
| Afternoon (`afternoon`) | clock | drawing `clock` (15) |
| Dusk (`dusk`) | clock | drawing `clock` (18) |
| Evening (`night`) | clock | drawing `clock` (21) |
| Midnight (`midnight`) | clock | drawing `clock` (24) |
| Alarm clock (`alarm`) | alarmclock | drawing `alarm` |
| Wake-up call (`wakecall`) | bell | drawing `alarm` |
| Yesterday, this time (`yesterday`) | clock | drawing `clock` (yesterday) |
| Tomorrow, this time (`tomorrow`) | clock | drawing `clock` (tomorrow) |

## INFINITE LINE

| Item | Model | Pointed at |
|---|---|---|
| Ink (`xb_dim_100`) | ink | drawing `xchg` (bright/dim) |
| Ink (`xb_dim_10000`) | ink | drawing `xchg` (bright/dim) |
| Ink (`xb_dim_1000000`) | ink | drawing `xchg` (bright/dim) |
| Deeper Well (`p_dim`) | orb | live scene `depth` |
| Nib shine 1>5 (`act5`) | pen | drawing `shine` (5) |
| Nib shine 5>15 (`act15`) | pen | drawing `shine` (15) |
| Nib shine 15>30 (`act30`) | pen | drawing `shine` (30) |
| Light wipe (`wipe_up`) | pen | drawing `heat` (wipe) |
| Quick double dab (`dbl_up`) | pen | drawing `heat` (dbl) |
| Easy mop (`mop_up`) | pen | drawing `heat` (mop) |
| Max Prisms 10>50 (`cap_prism50`) | pouch | drawing `cap` (prism/10/50) |
| Max Prisms 50>99 (`cap_prism99`) | pouch | drawing `cap` (prism/50/99) |
| Max Knots 10>50 (`cap_knot50`) | pouch | drawing `cap` (knot/10/50) |
| Max Knots 50>99 (`cap_knot99`) | pouch | drawing `cap` (knot/50/99) |
| Max Lens 10>50 (`cap_lens50`) | pouch | drawing `cap` (lens/10/50) |
| Max Lens 50>99 (`cap_lens99`) | pouch | drawing `cap` (lens/50/99) |
| Max Keys 10>50 (`cap_key50`) | pouch | drawing `cap` (key/10/50) |
| Max Keys 50>99 (`cap_key99`) | pouch | drawing `cap` (key/50/99) |
| Max Gates 10>50 (`cap_gate50`) | pouch | drawing `cap` (gate/10/50) |
| Max Gates 50>99 (`cap_gate99`) | pouch | drawing `cap` (gate/50/99) |

## XACT change

| Item | Model | Pointed at |
|---|---|---|
| Magnetic (`xb_magnetic_100`) | jar | drawing `xchg` (bright/magnetic) |
| Magnetic (`xb_magnetic_10000`) | jar | drawing `xchg` (bright/magnetic) |
| Magnetic (`xb_magnetic_1000000`) | jar | drawing `xchg` (bright/magnetic) |
| Neutron (`xb_neutron_100`) | jar | drawing `xchg` (bright/neutron) |
| Neutron (`xb_neutron_10000`) | jar | drawing `xchg` (bright/neutron) |
| Neutron (`xb_neutron_1000000`) | jar | drawing `xchg` (bright/neutron) |
| Pulsing (`xb_pulsing_100`) | jar | drawing `xchg` (bright/pulsing) |
| Pulsing (`xb_pulsing_10000`) | jar | drawing `xchg` (bright/pulsing) |
| Pulsing (`xb_pulsing_1000000`) | jar | drawing `xchg` (bright/pulsing) |
| Bright (`xs_dim_100`) | jar | drawing `xchg` (dim/bright) |
| Bright (`xs_dim_10000`) | jar | drawing `xchg` (dim/bright) |
| Bright (`xs_dim_1000000`) | jar | drawing `xchg` (dim/bright) |
| Bright (`xs_magnetic_100`) | jar | drawing `xchg` (magnetic/bright) |
| Bright (`xs_magnetic_10000`) | jar | drawing `xchg` (magnetic/bright) |
| Bright (`xs_magnetic_1000000`) | jar | drawing `xchg` (magnetic/bright) |
| Bright (`xs_neutron_100`) | jar | drawing `xchg` (neutron/bright) |
| Bright (`xs_neutron_10000`) | jar | drawing `xchg` (neutron/bright) |
| Bright (`xs_neutron_1000000`) | jar | drawing `xchg` (neutron/bright) |
| Bright (`xs_pulsing_100`) | jar | drawing `xchg` (pulsing/bright) |
| Bright (`xs_pulsing_10000`) | jar | drawing `xchg` (pulsing/bright) |
| Bright (`xs_pulsing_1000000`) | jar | drawing `xchg` (pulsing/bright) |

## GIFT SHOP

| Item | Model | Pointed at |
|---|---|---|
| Postcard (`postcard`) | postcard | live scene `hub:shop:gift` |
| Key Chain (`keychain`) | keychain | live scene `hub:shop:gift` |
| Hat (`hat`) | hat | live scene `hub:shop:gift` |
| Stuffy (`stuffy`) | stuffy | live scene `hub:shop:gift` |
| T-shirt (`tshirt`) | tshirt | live scene `hub:shop:gift` |
| Souvenir vinyl: Strobe Lake (`vinyl_e`) | record | drawing `music` |
| Souvenir vinyl: Lantern Waltz (`vinyl_s`) | record | drawing `music` |

## BRiGHT IDEAS

| Item | Model | Pointed at |
|---|---|---|
| Constellation light limit 3>4 (`cl4`) | constel | drawing `constel` (prism) |
| Item shape light limit 3>4 (`sh4`) | shape | drawing `shape` (lens) |
| Gates on the Center (`c_gate`) | constel | drawing `place` (gate/c) |
| Freeze frame (`p_bright`) | orb | live scene `balance` |
| Constellation light limit 4>5 (`cl5`) | constel | drawing `constel` (prism) |
| Item shape light limit 4>5 (`sh5`) | shape | drawing `shape` (lens) |
| 0.5 × game speed (`spd05`) | hourglass | drawing `speed` (0.5) |
| 2.0 × game speed (`spd2`) | hourglass | drawing `speed` (2) |
| Keys on the Center (`c_key`) | constel | drawing `place` (key/c) |
| Fill constellations with Lens (`cl_lens`) | constel | drawing `constel` (lens) |
| Fill constellations with Gates (`cl_gate`) | constel | drawing `constel` (gate) |
| Fill item shapes with Lens (`sh_lens`) | shape | drawing `shape` (lens) |
| Fill item shapes with Gates (`sh_gate`) | shape | drawing `shape` (gate) |
| A Lens on a dialing orbit (`orbit_lens`) | constel | drawing `constel` (lens) |
| 0.0 × game speed (`spd0`) | hourglass | drawing `speed` (0) |
| 8.0 × game speed (`spd8`) | hourglass | drawing `speed` (8) |
| Item shape rectangles from 2 lights (`rect2`) | shape | drawing `shape` (lens) |
| Wrap Lens with constellations (`w_lens_c`) | constel | drawing `constel` (lens) |
| Wrap Gates with constellations (`w_gate_c`) | constel | drawing `constel` (gate) |
| Wrap Gates with item shapes (`w_gate_s`) | shape | drawing `shape` (gate) |
| Use Faint Remnants (`u_dim`) | orb | live scene `hub:shop:bright` |
| Use Bright Remnants (`u_bright`) | orb | live scene `hub:shop:bright` |
| Use Neutron Remnants (`u_neu`) | orb | live scene `hub:shop:bright` |
| Use Magnetic Remnants (`u_mag`) | orb | live scene `hub:shop:bright` |
| Use Pulsing Remnants (`u_pul`) | orb | live scene `hub:shop:bright` |
| Random Duck (`d_bright`) | a duck | drawing `xchg` (duck/duck) |
| Pure Brightness (`pure_bright`) | crystal | live scene `hub:shop:bright` |
| Mast mount strength I (`hold_top1`) | fitting | drawing `hold` (top/25) |
| Mast mount strength II (`hold_top2`) | fitting | drawing `hold` (top/40) |
| Mast mount strength III (`hold_top3`) | fitting | drawing `hold` (top/55) |
| Riser mounts strength I (`hold_mast1`) | fitting | drawing `hold` (mast/25) |
| Riser mounts strength II (`hold_mast2`) | fitting | drawing `hold` (mast/40) |
| Riser mounts strength III (`hold_mast3`) | fitting | drawing `hold` (mast/55) |
| Deck mount strength I (`hold_deck1`) | fitting | drawing `hold` (deck/25) |
| Deck mount strength II (`hold_deck2`) | fitting | drawing `hold` (deck/40) |
| Deck mount strength III (`hold_deck3`) | fitting | drawing `hold` (deck/55) |
| Hull mount strength I (`hold_hull1`) | fitting | drawing `hold` (hull/25) |
| Hull mount strength II (`hold_hull2`) | fitting | drawing `hold` (hull/40) |
| Hull mount strength III (`hold_hull3`) | fitting | drawing `hold` (hull/55) |
| Swoop net (`swoop`) | hoop | drawing `net` (swoop) |
| Big hoop (`hoop1`) | hoop | drawing `net` (hoop1) |
| Really big hoop (`hoop2`) | hoop | drawing `net` (hoop2) |
| Metal strainer (`strainer`) | strainer | drawing `netx` (magnetic) |
| Vast mesh (`mesh`) | mesh | drawing `netx` (neutron) |
| Electric fence (`fence`) | fence | drawing `netx` (pulsing) |
| Trolling net (`troll`) | mount | drawing `troll` |
| Bright processing (`proc_bright`) | crucible | drawing `proc` (bright) |
| Magnetic processing (`proc_magnetic`) | crucible | drawing `proc` (magnetic) |
| Neutron processing (`proc_neutron`) | crucible | drawing `proc` (neutron) |
| Pulsing processing (`proc_pulsing`) | crucible | drawing `proc` (pulsing) |
| Relic refinery (`proc_relic`) | crucible | drawing `proc` (relic) |
| Bright compartment (`chest_bright`) | chest | drawing `chest` (bright/999) |
| Bright compartment 99,999 (`chest_bright2`) | chest | drawing `chest` (bright/99999) |
| Bright compartment 9,999,999 (`chest_bright3`) | chest | drawing `chest` (bright/9999999) |
| Dim compartment (`chest_dim`) | chest | drawing `chest` (dim/999) |
| Dim compartment 99,999 (`chest_dim2`) | chest | drawing `chest` (dim/99999) |
| Dim compartment 9,999,999 (`chest_dim3`) | chest | drawing `chest` (dim/9999999) |
| Magnetic compartment (`chest_magnetic`) | chest | drawing `chest` (magnetic/999) |
| Magnetic compartment 9,999 (`chest_magnetic2`) | chest | drawing `chest` (magnetic/9999) |
| Neutron compartment (`chest_neutron`) | chest | drawing `chest` (neutron/999) |
| Neutron compartment 9,999 (`chest_neutron2`) | chest | drawing `chest` (neutron/9999) |
| Pulsing compartment (`chest_pulsing`) | chest | drawing `chest` (pulsing/999) |
| Pulsing compartment 9,999 (`chest_pulsing2`) | chest | drawing `chest` (pulsing/9999) |
| Max Spindles 10>50 (`cap_leash50`) | pouch | drawing `cap` (leash/10/50) |
| Max Spindles 50>99 (`cap_leash99`) | pouch | drawing `cap` (leash/50/99) |
| Max Strings 10>50 (`cap_dial50`) | pouch | drawing `cap` (dial/10/50) |
| Max Strings 50>99 (`cap_dial99`) | pouch | drawing `cap` (dial/50/99) |
| Max Weaves 10>50 (`cap_weave50`) | pouch | drawing `cap` (weave/10/50) |
| Max Weaves 50>99 (`cap_weave99`) | pouch | drawing `cap` (weave/50/99) |
| Trash can (`trashcan`) | bin | drawing `trash` (paper) |
| Metal scoop (`tr_metal`) | scoop | drawing `trash` (metal) |
| Plastic scoop (`tr_plastic`) | scoop | drawing `trash` (plastic) |
| Glass scoop (`tr_glass`) | scoop | drawing `trash` (glass) |
| Fabric scoop (`tr_fabric`) | scoop | drawing `trash` (fabric) |
| Recycling plant seed (`seed`) | seedpack | drawing `plant` |
| Batteries (4) (`batt_bright`) | battery | drawing `batt` |

## Dim’s: Carnival of Discovery

| Item | Model | Pointed at |
|---|---|---|
| A Card of Secrets (`secret`) | deck | drawing `cards` (3) |
| Fortune Telling (`fortune`) | deck | drawing `cards` (3) |
| A Daily Wonder (`wonder`) | deck | drawing `cards` (3) |
| Carnival prize: a record (`recprize`) | record | live scene `hub:shop:dim` |
| Dark Remnant takes the predominant hue (`dk_hue`) | orb | live scene `hub:shop:dim` |
| Rainbow Dark Remnant when the balance is bright (`dk_rainbow`) | orb | live scene `hub:shop:dim` |
| Admission (`admission`) | ticket | drawing `cross` (dark) |
| Kaleidoscope (`kaleido`) | mount | drawing `cards` (4) |
| Pinwheel (`pinwheel`) | mount | drawing `cards` (3) |
| Yo-yo (`yoyo`) | mount | drawing `cards` (3) |
| Snow globe (`snowglobe`) | mount | drawing `cards` (3) |

## premium NEUTRINOS

| Item | Model | Pointed at |
|---|---|---|
| Knots on Sectors (`s_knot`) | shape | drawing `place` (knot/s) |
| Lens on Sectors (`s_lens`) | shape | drawing `place` (lens/s) |
| Knots on the Center (`c_knot`) | constel | drawing `place` (knot/c) |
| Neutron as an item from the pouch (`p_neu`) | orb | live scene `dynamism` |
| Lens on the Center (`c_lens`) | constel | drawing `place` (lens/c) |
| Wrap Lens with item shapes (`w_lens_s`) | shape | drawing `shape` (lens) |
| Protractor (`radii`) | protractor | live scene `hub:shop:neutron` |
| Spectrometer (`spectro`) | spectro | live scene `hub:shop:neutron` |
| Camera (`camera`) | camera | live scene `hub:shop:neutron` |
| Needle (`needle`) | needle | live scene `hub:shop:neutron` |
| Spool of chromatic yarn (`spool`) | spool | live scene `hub:shop:neutron` |
| Weaving Loom (`loom`) | loom | live scene `hub:shop:neutron` |
| Pure Density (`pure_neu`) | crystal | live scene `hub:shop:neutron` |
| Random Duck Variant (`d_neu`) | a duck | drawing `xchg` (duck/duck) |
| Telescope (`telem`) | telescope | live scene `hub:shop:neutron` |
| Batteries (4) (`batt_neutron`) | battery | drawing `batt` |

## MAGNETS & STUFF

| Item | Model | Pointed at |
|---|---|---|
| Magnetic as an item from the pouch (`p_mag`) | orb | live scene `harmony` |
| Pure Harmony (`pure_mag`) | crystal | live scene `hub:shop:magnetic` |
| Anchor (`anchor`) | mount | drawing `hold` (hull/100) |
| Mini fridge (`fridge`) | fridge | drawing `water` (3) |
| Rudder (`rudder`) | mount | drawing `cross` (rift) |
| Motor (`motor`) | mount | drawing `cross` (rift) |
| Horseshoe magnet (`magnet`) | mount | drawing `pull` |
| Fresh water barrel (`barrel`) | barrel | drawing `water` (3) |
| Water cooler (`cooler`) | barrel | drawing `water` (6) |
| Batteries (4) (`batt_magnetic`) | battery | drawing `batt` |

## DUCK SHOP

| Item | Model | Pointed at |
|---|---|---|
| Random Duck Variant (`d_mag`) | a duck | drawing `xchg` (duck/duck) |
| Flip a Duck (`flip`) | a duck | drawing `xchg` (duck/duck) |
| Exotic Duck (`exotic`) | a duck | drawing `xchg` (duck/duck) |
| Pick a Duck (`pickduck`) | a duck | drawing `xchg` (duck/duck) |
| Luck Charm (`charm`) | clover | drawing `luck` (+5%) |
| Lucky Duck (`lucky`) | a duck | drawing `luck` (×2) |

## the PULSE

| Item | Model | Pointed at |
|---|---|---|
| Strings on Sectors (`s_dial`) | shape | drawing `place` (dial/s) |
| Spindles on Sectors (`s_leash`) | shape | drawing `place` (leash/s) |
| Strings on the Center (`c_dial`) | constel | drawing `place` (dial/c) |
| Pulsing as an item from the pouch (`p_pul`) | orb | live scene `rhythm` |
| Gates on Sectors (`s_gate`) | shape | drawing `place` (gate/s) |
| Spindles on the Center (`c_leash`) | constel | drawing `place` (leash/c) |
| Keys on Sectors (`s_key`) | shape | drawing `place` (key/s) |
| String auto-fire (`autofire`) | coil | live scene `hub:shop:pulsing` |
| String rapid fire rate (`rapid`) | coil | live scene `hub:shop:pulsing` |
| String double-click blast (`blast`) | coil | live scene `hub:shop:pulsing` |
| Pure Rhythm (`pure_pul`) | crystal | live scene `hub:shop:pulsing` |
| Random Duck Variant (`d_pul`) | a duck | drawing `xchg` (duck/duck) |
| Gramophone (`record`) | mount | drawing `music` |
| Record: Pulse Width (`rec_e1`) | record | drawing `music` |
| Record: Neutron Drop (`rec_e2`) | record | drawing `music` |
| Record: Magnetic North (`rec_e3`) | record | drawing `music` |
| Record: Strobe Lake (`rec_e4`) | record | drawing `music` |
| Record: Duck Bass (`rec_e5`) | record | drawing `music` |
| Diamond-soled shoes (`shoes`) | mount | drawing `cross` (bright) |
| Black Heart bow tie (`bowtie`) | mount | drawing `cross` (dark) |
| Rift waders (`waders`) | mount | drawing `cross` (rift) |
| Tape: Tide on Side B (`tape_2`) | tape | drawing `music` |
| Tape: Overture, Dubbed (`tape_3`) | tape | drawing `music` |
| Batteries (4) (`batt_pulsing`) | battery | drawing `batt` |

## CUSTOM HULLS

| Item | Model | Pointed at |
|---|---|---|
| Wooden float (`f_wood`) | float | live scene `hub:move` |
| Metal float (`f_metal`) | float | live scene `hub:move` |
| Glass float (`f_glass`) | float | live scene `hub:move` |
| Ice float (`f_ice`) | float | live scene `hub:move` |
| Gold float (`f_gold`) | float | live scene `hub:move` |
| Dim float (`f_dim`) | float | live scene `hub:move` |
| Bright float (`f_bright`) | float | live scene `hub:move` |
| Chromatic float (`f_chromatic`) | float | live scene `hub:move` |
| Four-mount mast (`m_four`) | mast | live scene `hub:move` |
| Twin-hook mast (`m_twin`) | mast | live scene `hub:move` |
| Triple twin-hook mast (`m_triple`) | mast | live scene `hub:move` |
| Six-mount mast (`m_six`) | mast | live scene `hub:move` |
| Twin-hook spotlight (`l_twin`) | light | live scene `hub:move` |
| Pennant (`pennant`) | mount | live scene `hub:move` |
| Wind chime (`chime`) | mount | live scene `hub:move` |
| Drone (`drone`) | mount | live scene `hub:move` |
| Record: Nocturne for a Buoy (`rec_s1`) | record | drawing `music` |
| Record: Lantern Waltz (`rec_s2`) | record | drawing `music` |
| Record: Adagio of the Spill (`rec_s3`) | record | drawing `music` |
| Record: Hull Overture (`rec_s4`) | record | drawing `music` |
| Record: Dim Carnival Suite (`rec_s5`) | record | drawing `music` |
| Mast mount strength IV (`hold_top4`) | fitting | drawing `hold` (top/70) |
| Mast mount strength V (`hold_top5`) | fitting | drawing `hold` (top/85) |
| Mast mount strength VI (`hold_top6`) | fitting | drawing `hold` (top/100) |
| Riser mounts strength IV (`hold_mast4`) | fitting | drawing `hold` (mast/70) |
| Riser mounts strength V (`hold_mast5`) | fitting | drawing `hold` (mast/85) |
| Riser mounts strength VI (`hold_mast6`) | fitting | drawing `hold` (mast/100) |
| Deck mount strength IV (`hold_deck4`) | fitting | drawing `hold` (deck/70) |
| Deck mount strength V (`hold_deck5`) | fitting | drawing `hold` (deck/85) |
| Deck mount strength VI (`hold_deck6`) | fitting | drawing `hold` (deck/100) |
| Hull mount strength IV (`hold_hull4`) | fitting | drawing `hold` (hull/70) |
| Hull mount strength V (`hold_hull5`) | fitting | drawing `hold` (hull/85) |
| Hull mount strength VI (`hold_hull6`) | fitting | drawing `hold` (hull/100) |

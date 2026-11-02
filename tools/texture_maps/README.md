# Duck texture maps

Written by `node tools/build_duck_meshes.js` on every bake, so they always match what is in `shared.js`.

| File | What it is |
|---|---|
| `1_shape_labels.png` | What the **mesh** is built from: `duck_strip.png`'s four views (side-right, front, side-left, back). Yellow = head, darker yellow = body, orange = bill, white = eye, dark grey = drawn line. |
| `2_marking_labels_svg.png` | `Duck_Sheet.svg` read into the same labels at 8× detail, each view scaled and placed onto the strip's view. The **markings** come from this. |
| `3_texture_R_bill.png` … `3_texture_A_mouth.png` | The markings texture the game samples, one picture per channel (bill, eye, line, mouth). Each is a distance field: mid-grey is the edge, brighter is inside. The left panel is the side view, the right panel the front view. In the front view's G and B channels, the panel is blank on purpose. |
| `4_bill_side_mask.png` | Where the side view counts as bill (orange) over the silhouette (green). |
| `5_widths_with_and_without_bill.png` | Red is the half-width the mesh has at each side-view pixel; green is the head's own width without a bill. Red alone means the bill stands proud of the face there. |

## How a vertex gets its look

- **Position and markings.** Every vertex keeps the side-view pixel it came from (x, y) and its depth across (z).
- **Side faces** read the side view at (x, y).
- **Faces looking ahead** read the front view at (z, y).
- **Bill colour.** It comes from a per-vertex bill weight, not the drawings. A vertex is bill when it is inside the side view's bill (map 4) and outside the head as it would be without one, either beyond its outline or standing proud of its sides (map 5). The front drawing's bill also colours faces looking ahead.
- **The mouth.** It is drawn from the front drawing across the bill's front, and from the side drawing round the bill's sides, on the bill only.
- **Carving.** Lines are cut into the mesh, except in the eyes and on the bill. Only the mouth is carved there, and the eyes stand proud.

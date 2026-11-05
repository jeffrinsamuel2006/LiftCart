# LiftCart — Apartment Delivery Simulation (Phase 9)

A Three.js/Vite concept simulation of an internal apartment goods-lift and detachable multipurpose trolley.

## Run
1. Install Node.js 18 or later.
2. Open this folder in VS Code or a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Demonstration workflow
Choose Building A, B, or C; select a dummy cylinder or grocery tray; select destination floor 1–3; then use **Start delivery**. The sequence demonstrates worker loading, trolley approach, docking, latch engagement, platform travel, arrival, release, resident delivery, unloading, doorway parking, autonomous trolley return, automatic re-docking, and empty-platform descent. **Run this stage** advances the currently displayed stage; **Pause/Continue** controls automatic playback.

## Controls
- Building selector: switch between the three apartment blocks.
- Floor selector: choose the destination for a delivery.
- Load configuration: choose the dummy cylinder or grocery tray.
- Camera presets: colony, building, front elevation, and interior cutaway.
- Cutaway: reduce the front facade opacity to inspect the shaft.
- Engineering labels: reveal component callouts.
- Manual platform control: test platform travel separately from the delivery sequence.
- Orbit: left-drag; pan: right-drag; zoom: scroll.

## Model assumptions and limitations
- Four visible levels: ground plus three upper floors.
- The goods platform is represented as a guided, cable/pulley-driven conceptual mechanism.
- The trolley is detachable and uses wheel stops plus a docking latch. The post-delivery return is animated as a conceptual autonomous drive: after the resident parks the empty trolley at the apartment doorway, it retraces the delivery path to the lift and automatically aligns with the platform. This simulation does not model a real return motor, localization sensors, obstacle detection, wireless control, or safety-rated autonomy.
- The cylinder is a dummy visual prop; do not use a live or filled LPG cylinder in a physical prototype.
- The simulation is not a certified lift design. It does not validate load capacity, structural anchorage, braking, overspeed protection, door locks, fire strategy, electrical safety, or building-code compliance. It must never transport people. Any real installation requires qualified lift/mechanical/structural engineering and applicable approvals.

## Technical
- Vanilla JavaScript + Three.js 0.169 + Vite 5.
- Source files are under `src/`.


## Metric scale and architectural detail (Phase 11)
The scene uses **1 Three.js world unit = 1 metre**. The apartment block is approximately 13 m wide × 8 m deep with 3.15 m floor-to-floor height and four levels (ground + three upper floors). The trolley is approximately 1.18 m × 1.12 m at its base and the human figures are approximately 1.9 m tall. These are conceptual nominal dimensions, not a surveyed building or fabrication drawing.

The residential environment now includes furnished lounge, dining, kitchen and bedroom zones on each level, window frames and glazing, balconies, corridor lighting, floor plaques, entry canopy and steps, landscaped tree islands, shrubs, benches, streetlights, parking bays, cars, a security kiosk and boundary walls. The colony roads and street furniture are proportioned in metres for visual scale.


## Phase 12 changes
- The delivered dummy cylinder is transferred to a separate resident-apartment object at the selected floor. It remains visible after the empty trolley autonomously returns and the lift descends, including after sequence reset/replay and building switching.
- The lift platform deck and trolley have been reduced to provide clearer clearance within the internal shaft. The trolley is scaled to 86% of its previous size; platform dimensions are reduced proportionally.
- The persistent cylinder is a visual demonstration prop only, not a real LPG container.


## Phase 13 — apartment partition and stairway
- Added a partition separating the private apartment area from the shared LiftCart landing zone, with an open access doorway aligned to each landing.
- Added a compact two-flight stairway with intermediate landings and handrails beside/behind the goods-lift shaft.
- Stair and partition geometry are conceptual layout elements; verify clear widths, headroom, fire egress, accessibility, and structural requirements before any physical design.


## Phase 14 – Open Ground Floor and Right-Side Staircase
- Ground floor cleared of residential room partitions, furniture, and balcony fit-out; it remains an open shared entrance/service level.
- Internal LiftCart shaft, ground landing, main entrance, and shared circulation retained.
- Staircase moved to the right-hand side of the lift shaft, with 16 modeled treads per storey and handrails.
- Upper floors retain their furnished apartment layouts.
- Stair dimensions are conceptual; verify code-compliant rise/going, width, headroom, landings, handrails, fire egress, and structure before physical implementation.


## Phase 15 – Compact Vertical Conveyor Redesign
- Replaced the traditional-looking cable/pulley lift mechanism with a compact twin-chain vertical conveyor concept.
- Added visible chain tracks, repeated cross rollers, a compact top drive motor, and a small moving carrier cradle.
- Reduced the trolley scale from 86% to 72% of its previous model size and reduced the carrier deck and guide components.
- Preserved the existing floor-selection, landing-door, trolley docking/detaching, delivery, autonomous-return, and engineering-view interfaces.
- This is a visual concept only. A real vertical conveyor needs engineered carrier retention, redundant braking, overspeed protection, guarding, interlocks, load limits, emergency stops, and building/fire-safety approvals.

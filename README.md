# Midtown Dispatch

Play: https://hellomarcog.github.io/midtown-dispatch/

A self-contained fixed-gear bike messenger game. **Living Streets / 10** opens directly in the city, with the rider standing beside the bike. Hold W to walk forward, mount, and pedal.

## Build 10

- Quicker effort ramp and stronger launch; releasing W eases effort down while wheel-driven fixed-gear pedaling continues until the bike stops.
- Walk-and-mount opening animation with articulated limbs. Free city riding starts immediately; T starts the timed delivery.
- One-way local streets and avenue, with wider two-way streets and a four-lane two-way avenue. Route and merge rules respect direction.
- Most pedestrians use sidewalk corridors. Others use controlled crossings; a small group jaywalks midblock.
- 24 other cyclists with animated cranks, legs, and wheels, integrated into signals and collision checks.
- Compacts, sedans, SUVs, minivans, and box trucks with size-matched collision footprints.
- Sidewalk trees and planters, plus three construction sites with barriers and traffic yielding/merging.
- High graphics selected by default for modern computers; lower settings remain available in the menu.

The city contains 288 motor vehicles (including parked vehicles), 24 cyclists, and 320 pedestrians. Traffic uses simplified IDM following plus custom path and footprint collision checks; it is not a calibrated city simulator or full ORCA implementation.

## Controls

W pedal · A/D steer · S brake · Shift sprint · Space skid · E deliver.
V side view · P restart free ride · C center camera · R recover · T timed delivery · Escape pause.

## Run and test

Open `index.html` in a WebGL-enabled browser. No build step or external assets are required.

Run `node tests/build10.cjs` (or `node tests/collisions.cjs`). The harness loads the full application and real Three.js geometry, replacing only browser DOM/canvas and GPU rendering. It checks city startup, mount limb lengths, acceleration, continued pedal rotation after W release, eventual stopping, sidewalk placement, and all NPC/fixture collision classes over at least 180 simulated seconds. `SIM_SECONDS` overrides the final city-test duration.

The test does not measure GPU performance or replace visual playtesting. GitHub Pages deploys `main` from the repository root. The embedded Three.js MIT license is retained.

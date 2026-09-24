# Midtown Dispatch

A self-contained browser game about riding a fixed-gear delivery bike through busy city traffic.

Play: https://hellomarcog.github.io/midtown-dispatch/

## Living Streets / 09

- Oriented vehicle collision footprints cover truck mirrors and bumpers, including during turns and merges.
- Pedestrian discs cannot overlap each other or vehicle footprints. Blocked walkers wait or take small safe sidesteps.
- Vehicle and pedestrian spawns are placed into clear space; recycled traffic checks its destination before re-entry.
- Each proposed movement is checked along its path before being committed. Blocked vehicles retain their previous route state and stop.
- Spatial cells and lane buckets limit collision and traffic queries to relevant neighbors.
- Traffic density remains 288 vehicles (including parked vehicles) and 320 pedestrians.

Traffic uses simplified IDM-style following, signals, junction clearance, and a custom geometric safety layer. Pedestrian avoidance is custom, not a full ORCA implementation or a calibrated city simulator.

## Controls

W pedal · A/D steer · S brake · Shift sprint · Space skid · E deliver.
V side view · P practice · C center camera · R recover · T retry.

## Run and test

Open `index.html` in a browser with WebGL enabled. No build step or external assets are required.

Run `node tests/collisions.cjs` for a seeded 180-second simulation with mixed timesteps. It checks initial placement and all three NPC overlap classes at every step, and requires ongoing movement and completed turns. The harness uses the game's actual simulation code with simplified rendering objects; it does not measure GPU rendering or visual performance.

GitHub Pages deploys `main` from the repository root. Three.js retains its MIT license in `index.html`.

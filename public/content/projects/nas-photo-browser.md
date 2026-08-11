# NAS Photo Browser

A self-hosted photo library for a NAS, used from a phone.

## The problem

Twenty years of family photos had accumulated on a NAS: 22,700 files across 975
folders, about 132 GB, dated 1990 through 2026. The files were reachable over
SMB but there was no way to browse them. Finding a photo meant opening folders
by name on a laptop.

Cloud services solve this by taking custody of the files. I wanted to leave the
library where it was and put an interface on top of it.

## What it does

The server mounts the share read-only, walks it in the background, and builds an
index in SQLite: EXIF, GPS, camera, dimensions, and hashes for duplicate
detection. Thumbnails are generated once as WebP in two sizes, 300px for the
grid and 1600px for the viewer, and cached on disk.

On top of the index sit a date-grouped grid with a timeline scrubber, albums
derived from the folder structure, a map for the 20% of photos with GPS, a
full-screen viewer with pinch-to-zoom, and duplicate detection. Videos get an
extracted frame for a thumbnail and transcoding for formats browsers will not
play. It installs as a PWA and caches thumbnails cache-first.

## Finding people

Faces are detected with SCRFD and embedded with ArcFace, both from InsightFace's
`buffalo_l` pack. Each face becomes a 512-dimensional vector where the same
person's faces land close together. Clustering groups a person's photos without
labelling, and naming a cluster names every photo in it.

The first implementation used facenet-pytorch, which dates from 2016-17 and was
trained on adult celebrities. It handled profiles, ageing, poor light, film
scans, and children badly enough that tuning the threshold traded duplicate
groups for merged ones.

To measure whether changing models helped, I scored both on 2,000 photos from
the library, using pairs of faces appearing in the same photo as known
negatives:

```
                   faces/group   errors   false-merge rate
    facenet @0.26      2.33        12         0.120%
    ArcFace @0.45      2.27         3         0.023%
```

Four times fewer errors at the same consolidation, or 47% more consolidation at
the same error rate.

The headroom between the two classes explains the difference. Measuring the 1st
percentile of definitely-different distances against the operating threshold:
0.353 against 0.30 for facenet, 0.649 against 0.45 for ArcFace. facenet left
little separation between same-person and different-person distances.

Two things mattered as much as the model:

- Alignment. ArcFace expects each face warped onto a canonical 112x112 using the
  detector's five landmarks. A plain crop loses much of the gain.
- Filtering. Unfiltered, the detector returns 64% more faces, but a third are
  small or low-confidence background people, which is where false merges come
  from. Requiring 0.60 confidence and 40 pixels cut errors from 5 to 1 while
  keeping 68% of detections.

## Search by description

CLIP embeddings, via `open_clip`, allow searching the library in plain language
rather than by filename or date. Face recognition and semantic search are both
optional; without the ML dependencies installed the app runs without them.

## Auditing the library first

Measuring the library before building against it changed what got built. 26% of
photos were dated exactly January 1, because dates had been inferred from folder
names and stored as though they were exact. 1,399 files were redundant copies.
975 folders were being rendered as a single flat grid.

## Stack

Python 3.12 with FastAPI and SQLite via aiosqlite, Pillow for imaging, OpenCV
for face processing. React 18, TypeScript, Vite, Tailwind, and SWR on the
frontend. Runs under Docker or directly.

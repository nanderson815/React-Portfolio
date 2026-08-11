# NAS Photo Browser

A self-hosted photo library for a NAS, built to be used from a phone.

## The problem

Twenty years of family photos had accumulated on a NAS: 22,700 files across 975
folders, about 132 GB, dated 1990 through 2026. All of it was reachable over SMB
and none of it was browsable. Finding one picture meant opening folders by name
on a laptop and guessing.

Cloud services solve this by taking custody of the files. I wanted the library to
stay where it was and get a good interface on top of it.

## What it does

The server mounts the share read-only, walks it in the background, and builds an
index in SQLite: EXIF, GPS, camera, dimensions, and hashes for spotting
duplicates. Thumbnails are generated once as WebP in two sizes, 300px for the
grid and 1600px for the viewer, and cached on disk.

On top of that index sit a date-grouped grid with a timeline scrubber, albums
derived from the folder structure, a map for the 20% of photos carrying GPS, a
full-screen viewer with pinch-to-zoom, and duplicate detection. Videos get an
extracted frame for their thumbnail and transcoding for the formats browsers
refuse to play. It installs as a PWA and caches thumbnails cache-first, so
scrolling stays smooth on a phone over LAN.

## Finding people

The part worth writing about is face recognition, because the first version of it
did not work well enough to use.

Faces are detected with SCRFD and embedded with ArcFace, both from InsightFace's
`buffalo_l` pack. Each face becomes a 512-dimensional vector positioned so that
the same person's faces land near each other. Clustering those vectors groups a
person's photos with no labelling, and naming a cluster once names every photo in
it.

The first implementation used facenet-pytorch, which is from 2016-17 and trained
on adult celebrities. A family library is mostly not that. It is profiles,
ageing, bad light, film scans, and children, and facenet handled those badly
enough that tuning the threshold only ever traded duplicate groups for merged
blobs.

To find out whether swapping models actually helped, I scored both on 2,000
photos from the library, using pairs of faces appearing in the same photo as
known negatives, since one person cannot be two faces in one frame:

```
                   faces/group   errors   false-merge rate
    facenet @0.26      2.33        12         0.120%
    ArcFace @0.45      2.27         3         0.023%
```

Four times fewer errors at the same consolidation, or 47% more consolidation at
the same error rate.

The number that explained why is the headroom between the two classes. Measuring
the 1st percentile of definitely-different distances against the operating
threshold: 0.353 against 0.30 for facenet, 0.649 against 0.45 for ArcFace.
facenet left almost no gap between "same person" and "different person", so no
threshold was ever going to be right.

Two things mattered as much as the model:

- Alignment. ArcFace expects each face warped onto a canonical 112x112 using the
  five landmarks from the detector. A plain crop gives up much of the benefit.
- Filtering. Unfiltered, the detector returns 64% more faces, but a third are
  tiny or low-confidence people in the background, and those are where false
  merges come from. Requiring 0.60 confidence and 40 pixels cut errors from 5 to
  1 while keeping 68% of detections.

## Searching by description

CLIP embeddings, via `open_clip`, let the library be searched in plain language
rather than by filename or date. Both this and face recognition are optional; if
the ML dependencies are not installed the app runs without those features instead
of failing to start.

## What the data turned out to be

Auditing the library before building against it changed what got built. 26% of
photos were dated exactly January 1, because their dates had been inferred from
folder names and then presented as though they were exact. 1,399 files were
redundant copies. 975 folders were being rendered as one flat, unnavigable grid.
Each of those is a feature that only exists because the data was measured first.

## Stack

Python 3.12 with FastAPI and SQLite via aiosqlite on the backend, Pillow for
imaging, OpenCV for face processing. React 18, TypeScript, Vite, Tailwind, and
SWR on the frontend. Runs under Docker or directly, on a machine on the LAN.

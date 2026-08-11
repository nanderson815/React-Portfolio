# Frame Art

Museum art on a Samsung Frame TV, selected to match the room.

## The problem

The Samsung Frame displays artwork when the TV is idle. Samsung sells that
artwork through a subscription of about six dollars a month.

The Art Institute of Chicago, the Met, the Rijksmuseum, and the Smithsonian
publish their public-domain collections through open APIs, at full resolution,
for free. The harder problem is deciding which pieces suit a particular wall.

## What it does

A React Native app talks to a Python service on the same network. The service
searches the four museum collections, scores results against previous likes and
a profile of the room, and pushes selected pieces to the TV over its WebSocket
art API, including matte settings.

Everything runs on the LAN. There is no account and no hosted server.

## Matching art to a room

You photograph the wall. Claude returns a structured assessment of the photo:
wall color as hex, lighting, interior style, dominant palette, mood, and which
art styles and palettes would complement it. That becomes a room profile used
for scoring.

The call is slow and metered, so it runs once per room rather than once per
artwork.

## Local scoring

The browsing feed shows a match percentage on every card, which through the API
would mean one request per artwork.

Scoring is therefore split. Claude handles room analysis and assembling themed
collections. The per-artwork score is a local weighted sum:

```
    artist match     0.25
    style match      0.20
    color harmony    0.20
    keyword match    0.15
    not disliked     0.10
    room match       0.10
```

Each component falls back to 0.5 rather than 0 when there is no data, so a new
user with no history gets a mid-range score rather than a low one. Keyword
matching is implicit: tags that appear often in liked art count for more,
normalized against the amount of history rather than a fixed threshold.

## Color

Palette extraction runs KMeans over the pixels of a 150x150 thumbnail and
returns five cluster centers ordered by cluster size.

Harmony between two palettes is scored in HSV. Complementary hues near 180
degrees apart and analogous hues within 30 degrees score highest; hues near 60
and 120 degrees apart score lowest. Colors with very low saturation are treated
as compatible with anything, which covers most wall colors. Every cross-pair is
scored and weighted by each color's dominance in its palette.

Matte selection uses a different rule: a hue analogous to the wall, separated in
lightness so the matte stays visible against it.

## Talking to the TV

Connection, upload, matte configuration, selecting the active piece, deletion,
and slideshow scheduling go over the Frame's WebSocket art API. The integration
is optional and lazily imported, so the backend and its 40 tests run without a
TV present.

A scheduler rotates art by season and time of day, producing search keywords and
matte recommendations that feed back into scoring.

## Stack

Python with FastAPI and Pydantic, scikit-learn and Pillow for the color work,
the Anthropic SDK for curation. React Native on Expo with react-query and
zustand.

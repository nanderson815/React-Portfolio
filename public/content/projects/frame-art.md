# Frame Art

Museum art on a Samsung Frame TV, curated for the room it hangs in.

## The problem

The Frame is a television that pretends to be a painting when you are not
watching it. Samsung sells the art for it through a subscription, about six
dollars a month, on top of the cost of the set.

Meanwhile the Art Institute of Chicago, the Met, the Rijksmuseum, and the
Smithsonian all publish their public-domain collections through open APIs, at
full resolution, for free. The art was never the hard part. Choosing which
pieces belong on a particular wall is.

## What it does

A React Native app talks to a small Python service running on the same network.
The service searches the four museum collections, scores results against what
you have liked before and what your room looks like, and pushes the ones you
pick to the TV over its WebSocket art API, matte and all.

Nothing runs in the cloud. There is no account and no server of mine in the
middle.

## Matching art to a room

You photograph the wall. Claude reads the photo and returns a structured
assessment: wall color as hex, lighting, interior style, dominant palette, mood,
and which art styles and palettes would complement it. That becomes a room
profile the rest of the system scores against.

That call is slow and costs money, so it happens once per room rather than once
per artwork.

## Why most of it never calls Claude

The browsing feed shows a match percentage on every card. Doing that through an
API would mean a request per artwork, which is both too slow to scroll and
absurd to pay for.

So scoring is split in two. Claude handles the infrequent, genuinely hard
judgment: reading a room, assembling a themed collection. Everything per-item
runs locally as a weighted sum:

```
    artist match     0.25
    style match      0.20
    color harmony    0.20
    keyword match    0.15
    not disliked     0.10
    room match       0.10
```

Each component degrades to a neutral 0.5 rather than zero when there is nothing
to go on, so a new user with no history gets a middling score instead of a
uniformly bad one. Keyword matching is implicit: the more often a tag shows up
in art you liked, the more it counts, normalized against how much history exists
rather than against a fixed threshold.

The result is that swiping is instant and free, and the expensive model is
reserved for the two places where it is actually better than arithmetic.

## Color

Palette extraction runs KMeans over the pixels of a 150x150 thumbnail and
returns the five cluster centers ordered by cluster size, so the dominant color
comes first.

Harmony between two palettes is scored in HSV using color theory rather than
distance. Complementary hues, roughly 180 degrees apart, and analogous hues
within 30 degrees both score well. Hues around 60 and 120 degrees apart clash.
Colors with very low saturation are treated as compatible with everything, which
is the correct answer for the grays and creams most walls actually are. Every
cross-pair is scored and weighted by how dominant each color is in its palette.

Matte color is a related but different problem. The right matte is analogous to
the wall in hue but separated from it in lightness, because a matte that matches
the wall too closely stops reading as a frame at all.

## Talking to the TV

Connection, upload, matte configuration, selecting the active piece, deleting,
and slideshow scheduling all go over the Frame's WebSocket art API. The
integration is optional and lazily imported, so the backend and its 40 tests run
fine on a machine with no television attached.

A scheduler rotates art by season and time of day, producing search keywords and
matte recommendations that feed back into the same scoring path.

## Stack

Python with FastAPI and Pydantic, scikit-learn and Pillow for the color work,
the Anthropic SDK for curation. React Native on Expo with react-query and
zustand. Runs on a machine on the LAN.

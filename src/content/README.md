# Content

Page content lives in two places, split by when it is needed.

`about.json` and `projects.json` are imported at build time, so the About and
Projects pages render with the bundle and never wait on a request. Project
detail pages are fetched at runtime from `public/content/projects/`, since they
are larger and only one is ever needed at a time.

Both require a deploy to take effect, which happens on every push to `master`.

## `about.json`

`content` is either a string, or an array of `{ heading, text }` sections.
Set it to `null` to fall back to the "coming soon" state.

```json
{
  "title": "about",
  "content": [
    { "heading": "currently", "text": "..." }
  ]
}
```

## `projects.json`

`title` is required. `description`, `link` (live site), and `github` are optional.
Set `projects` to `null` for the "coming soon" state.

```json
{
  "projects": [
    {
      "title": "Project Name",
      "description": "One or two sentences.",
      "slug": "project-name",
      "link": "https://example.com",
      "github": "https://github.com/nanderson815/project-name"
    }
  ]
}
```

## Detail pages

Adding a `slug` makes the title link to `/projects/<slug>`, which fetches and
renders `public/content/projects/<slug>.md`. Without a slug the project is
list-only.

Markdown is parsed as CommonMark, without `remark-gfm`. Tables will not render;
use a fenced code block for anything that needs alignment.

Images go in `public/content/projects/images/` and are referenced from the site
root: `![Alt](/content/projects/images/shot.png)`

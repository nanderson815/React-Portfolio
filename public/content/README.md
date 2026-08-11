# Content

These files are served as static assets and fetched at runtime, so editing them
and pushing is enough — no rebuild required.

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

Adding a `slug` makes the title link to `/projects/<slug>`, which renders
`projects/<slug>.md` as Markdown. Without a slug the project is list-only.

Images go in `projects/images/` and are referenced from the site root:
`![Alt](/content/projects/images/shot.png)`

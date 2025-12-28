# Content Management

This directory contains JSON files that control the dynamic content on your portfolio pages.

## How to Update Content

Simply edit the JSON files in this directory and commit them to GitHub. **No rebuild or deployment needed** - changes will reflect immediately on your live site!

---

## About Page (`about.json`)

### Schema:
```json
{
  "title": "about",
  "content": null | string | array
}
```

### Example 1: Simple Text
```json
{
  "title": "about",
  "content": "I'm a software engineer passionate about building beautiful web experiences. I love working with React, Node.js, and exploring new technologies."
}
```

### Example 2: Structured Sections
```json
{
  "title": "about",
  "content": [
    {
      "heading": "who i am",
      "text": "I'm a full-stack developer with a passion for clean code and great UX."
    },
    {
      "heading": "what i do",
      "text": "I build web applications using React, Node.js, and modern JavaScript."
    },
    {
      "heading": "get in touch",
      "text": "Feel free to reach out at hello@example.com"
    }
  ]
}
```

### Example 3: Show "Coming Soon"
```json
{
  "title": "about",
  "content": null
}
```

---

## Projects Page (`projects.json`)

### Schema:
```json
{
  "projects": null | array
}
```

Each project can have:
- **title** (required): Project name
- **description** (optional): Short summary shown on the projects list page
- **slug** (optional): URL-friendly identifier for the project detail page (e.g., "my-cool-project")
- **link** (optional): External link to live demo/deployed app
- **github** (optional): GitHub repository URL

### Example 1: Projects with Full Detail Pages (RECOMMENDED)
```json
{
  "projects": [
    {
      "title": "Portfolio Website",
      "description": "A minimalist portfolio built with React and Firebase",
      "slug": "portfolio-website",
      "link": "https://yoursite.com",
      "github": "https://github.com/username/portfolio"
    },
    {
      "title": "Todo App",
      "description": "A simple task management app with local storage",
      "slug": "todo-app",
      "github": "https://github.com/username/todo-app"
    }
  ]
}
```

When you add a `slug`, create a corresponding markdown file at:
`/content/projects/{slug}.md`

For example, `portfolio-website` would need:
`/content/projects/portfolio-website.md`

### Example 2: Simple Projects (No Detail Pages)
```json
{
  "projects": [
    {
      "title": "Quick Project",
      "description": "Simple project with just external links",
      "link": "https://example.com",
      "github": "https://github.com/username/repo"
    }
  ]
}
```

### Example 3: Show "Coming Soon"
```json
{
  "projects": null
}
```

---

## Creating Project Detail Pages

Project detail pages use **Markdown** format, which gives you rich formatting options.

### File Structure:
```
public/content/
  projects/
    my-project.md          ← Your project page
    another-project.md     ← Another project
    images/
      screenshot1.png      ← Project images
      demo.gif
```

### Markdown Example:

```markdown
# My Awesome Project

A brief introduction to your project.

## Overview

Describe what the project does and why you built it.

## Features

- Feature 1
- Feature 2
- Feature 3

## Technology Stack

- React
- Node.js
- MongoDB

## Screenshots

![App Screenshot](/content/projects/images/screenshot.png)

## Code Example

```javascript
const example = () => {
  console.log('Code blocks work!');
};
```

## Links

- [Live Demo](https://example.com)
- [GitHub](https://github.com/username/project)
```

### Adding Images:

1. Place images in `/content/projects/images/`
2. Reference them in markdown: `![Alt text](/content/projects/images/your-image.png)`
3. Supported formats: PNG, JPG, GIF, SVG

### Markdown Syntax:

- **Bold**: `**text**`
- *Italic*: `*text*`
- Headings: `# H1`, `## H2`, `### H3`
- Links: `[text](url)`
- Images: `![alt](url)`
- Code: `` `inline` `` or ` ```language ` for blocks
- Lists: `- item` or `1. item`
- Quotes: `> quote`
- Horizontal rule: `---`

---

## Tips

- **Validation**: Use a JSON validator (like jsonlint.com) before committing to avoid syntax errors
- **Preview**: Test locally by running `npm start` before pushing to GitHub
- **Cache**: If changes don't appear immediately, try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- **Links**: Both `link` and `github` fields are optional in projects
- **Formatting**: Keep descriptions concise for best mobile display

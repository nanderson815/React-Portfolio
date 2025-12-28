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

### Example 1: Project List
```json
{
  "projects": [
    {
      "title": "Portfolio Website",
      "description": "A minimalist portfolio built with React and Firebase",
      "link": "https://yoursite.com",
      "github": "https://github.com/username/repo"
    },
    {
      "title": "Todo App",
      "description": "A simple task management app with local storage",
      "github": "https://github.com/username/todo-app"
    },
    {
      "title": "Weather Dashboard",
      "description": "Real-time weather app using OpenWeather API",
      "link": "https://weather.example.com"
    }
  ]
}
```

### Example 2: Show "Coming Soon"
```json
{
  "projects": null
}
```

---

## Tips

- **Validation**: Use a JSON validator (like jsonlint.com) before committing to avoid syntax errors
- **Preview**: Test locally by running `npm start` before pushing to GitHub
- **Cache**: If changes don't appear immediately, try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- **Links**: Both `link` and `github` fields are optional in projects
- **Formatting**: Keep descriptions concise for best mobile display

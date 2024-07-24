# score.dev

This repo holds the source of the <https://score.dev> website which holds the Score landing page, blog, and associated content. This is compiled through the Hugo static page compiler and uploaded as static pages to Github Pages.

## Requirements

- [Git](https://git-scm.com/) — latest source release
- [Node.js](https://nodejs.org/) — latest LTS version or newer

### 1. Get started

Download the repo.

```bash
git clone https://github.com/score-spec/score.dev.git
```

### 2. Install dependencies

```bash
npm ci
```

### 4. Start development server

```bash
node_modules/.bin/hugo/hugo serve
```

While the running server blocks your terminal, it is recommended to use it like that to see live log output. Just open another terminal to continue.

Check the line saying `Web Server is available at //localhost:1313/ (bind address 127.0.0.1)` to find the URL to access the site on your system, hosted by your local server.

The server will observe the local file system and dynamically rebuild the site on any changes.

## Documentation

- [Hugo](https://gohugo.io/documentation/)

# Sit

Sit is a tiny GraphQL API for serving static blog posts/pages. It was made in just under
an hour.

### ✨Getting Started

```
$ git clone https://github.com/chickencoder/sit
$ cd sit
$ yarn
```

### 🛠 Development
```
$ yarn dev
```

### ✍️Writing
Sit looks for *.md files in the `pages` and `posts` directory. Write your markdown to include
front matter that corresponds to the GraphQL schema in the `index.js` file.

### ☁️ Deployment
```
$ now
```
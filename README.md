# Harkawal Framework

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)

A blazing-fast, zero-dependency Static Site Generator designed for building beautiful, component-based Bootstrap websites without the bloat of massive JavaScript frameworks.

## 💡 Why Harkawal Framework?

We built this tool completely from scratch in Node.js because we wanted to solve a simple problem: **How do we achieve a modern, component-based architecture (like reusable Navbars and Footers) while maintaining the pure speed and simplicity of raw HTML?**

Harkawal Framework v1.1.0 gives you the power of modern architecture (Global Layouts, Clean URLs, Auto-SEO) using 100% pure HTML string manipulation.

## 🚀 Features

- **🧩 Global Layouts:** Never write `<html>` or `<body>` tags again. Write pure content, and the compiler automatically wraps your `src/layout.html` around it!
- **🎨 Built-in Premium Themes**: Instantly switch between glassmorphism `emerald`, `oceanic`, or `crimson` themes.
- 🚨 **Custom 404 Pages**: Auto-scaffolded, premium error pages that inherit your layout and themes.
- 🚀 **Zero Dependencies**: Pure Node.js. No `node_modules` weighing down your project.
- **🔗 Clean URLs & Auto-Routing:** Filenames automatically lose the `.html` extension (e.g., `/about`), and your internal `<a href="about.html">` links are magically rewritten for you.
- **⚡ Zero-Dependency Minification:** Our built-in Regex engine crushes your HTML to remove whitespace and drastically improve load times.
- **🔍 Client-Side Search Engine:** Automatically indexes all your pages and generates a `search-data.js` database.
- **🗺️ Auto-SEO & Sitemaps:** Automatically injects Open Graph `<meta>` tags and builds Google-ready `sitemap.xml`.
- **📁 Static Asset Copying:** Drop images and a `favicon.ico` into the `public/` folder, and they are magically injected and copied to your final build.

---

## 📂 Folder Structure

When you create a project, your folder will look like this:

```
my-website/
├── harkawal.config.json     # The brain of the framework
├── public/                  # Put your images & favicon here
├── src/
│   ├── layout.html          # Your global HTML shell wrapper
│   ├── components/          # Reusable snippets (navbar.html)
│   ├── styles/themes/       # The pre-built CSS themes
│   └── pages/               # Your actual pages (index.html)
```

## ⚙️ Configuration

Control the entire framework using simple `true`/`false` flags in your `harkawal.config.json`:

```json
{
  "baseUrl": "https://www.example.com",
  "sitemap": true,
  "search": true,
  "cleanUrls": true,
  "minify": true,
  "theme": "emerald"
}
```

## 💻 Usage (Quick Start)

To build and test a brand new website from scratch, run these 3 exact commands in an empty folder:

**1. Scaffold the Project:**
```bash
harkawal init
```
*(Automatically generates your folder structure, config, layout wrapper, and themes).*

**2. Compile the Website:**
```bash
harkawal
```
*(Crushes your HTML, generates your sitemap, handles Clean URLs, and outputs to the `dist/` folder).*

**3. Test the Website Locally:**
Because Harkawal Framework features automatic **Clean URLs**, you need a server to test your links locally. Fortunately, the framework ships with a zero-dependency native web server!
```bash
harkawal serve
```
Your professional website will instantly be available at `http://localhost:3000`. You can also specify a custom port using `harkawal serve -p 8080`.

## 🖥️ Terminal Output Example

The framework provides beautiful, native console output so you know exactly what is happening during compilation.

```text
🚀 Harkawal Framework v1.1.0: Starting build...
📁 Copying public assets...
🎨 Theme injected: emerald
🏗️  Global layout loaded.
✅ Sitemap created.
✅ Search index created.
🎉 v1.1.0 Build complete! Check dist/ folder.
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

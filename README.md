# 🚀 Harkawal Static Site Generator (v1.2.1)

![Version](https://img.shields.io/badge/version-1.2.1-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)

A blazing-fast, zero-dependency Static Site Generator designed for building beautiful, component-based Bootstrap websites without the bloat of massive JavaScript frameworks.

## 💡 Why Harkawal Framework?

We built this tool completely from scratch in Node.js because we wanted to solve a simple problem: **How do we achieve a modern, component-based architecture (like reusable Navbars and Footers) while maintaining the pure speed and simplicity of raw HTML?**

The V1.2.0 compiler supports **Structural Themes**. The layout and components are loaded based on your theme selection:

1. **`harkawal.config.json`**: Holds project configuration (like `sitemap`, `search`, `cleanUrls`, and `theme`).
2. **`src/themes/emerald/layout.html`**: The HTML wrapper. 
3. **`src/pages/`**: Your actual content pages.
4. **`src/themes/emerald/components/`**: Reusable bits like navbars. No `node_modules` weighing down your project.

## 🚀 Features

- **🧩 Global Layouts:** Never write `<html>` or `<body>` tags again. Write pure content, and the compiler automatically wraps your `src/layout.html` around it!
- **🎨 Built-in Premium Themes**: Instantly switch between `emerald`, `resort`, or `docs` themes.
- 🚨 **Custom 404 Pages**: Auto-scaffolded, premium error pages that inherit your layout and themes.
- 🚀 **Zero Dependencies**: Pure Node.js. No `node_modules` weighing down your project.
- **🔗 Clean URLs & Auto-Routing:** Filenames automatically lose the `.html` extension (e.g., `/about`), and your internal `<a href="about.html">` links are magically rewritten for you.
- **⚡ Zero-Dependency Minification:** Our built-in Regex engine crushes your HTML to remove whitespace and drastically improve load times.
- **🔍 Client-Side Search Engine:** Automatically indexes all your pages and generates a `search-data.js` database.
- **🗺️ Auto-SEO (Sitemaps & Robots.txt):** Automatically injects Open Graph `<meta>` tags and builds a Google-ready `sitemap.xml` and `robots.txt`.
- **🛡️ Full SEO Control:** Use the new `disallow` array to effortlessly hide private pages from search engines and internal search.
- **📁 Static Asset Copying:** Drop images and a `favicon.ico` into the `public/` folder, and they are magically injected and copied to your final build.

---

## 🚀 Usage (Quick Start)

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
🚀 Harkawal Framework v1.2.0: Starting build...
📁 Copying public assets...
🎨 Structural Theme injected: emerald
🏗️  Structural layout loaded for theme: emerald
✅ Sitemap created.
✅ Search index created.
🎉 v1.2.0 Build complete! Check dist/ folder.
```

---

## 📂 Folder Structure

When you create a project, your folder will look like this:

```
my-website/
├── harkawal.config.json     # The brain of the framework
├── public/                  # Put your images & favicon here
├── src/
│   ├── themes/emerald/
│   │   ├── layout.html      # Theme-specific structural HTML wrapper
│   │   ├── components/      # Theme-specific reusable snippets (navbar.html)
│   │   └── theme.css        # Theme-specific styles
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
  "theme": "emerald",
  "disallow": []
}
```

## 🎨 Theming & Custom Layouts

Harkawal Framework v1.2.0 introduces a powerful **Structural Theme Architecture**. The framework doesn't just inject CSS; it completely manages your HTML layouts and components!

### 1. Using Built-in Themes
You can instantly scaffold your project with different structural themes by passing the theme name to the `init` command:
```bash
# Initializes the default glassmorphism theme (automatically uses 'emerald')
harkawal init

# Or explicitly pass the theme name:
harkawal init emerald

# Initializes the elegant Resort/Apartment booking theme
harkawal init resort

# Initializes the official Documentation theme
harkawal init docs
```
This automatically copies the theme's specific `layout.html`, `theme.css`, and `components/` into your local `src/themes/[themename]/` folder and updates your `harkawal.config.json`.

### 2. Building Your Own Custom Themes
Because the compiler strictly reads from your local `src/themes/` folder, you have 100% control over the architecture.

To build a completely custom theme from scratch:
1. Create a new folder: `src/themes/my-custom-theme/`
2. Drop your custom `layout.html` and `theme.css` inside it.
3. Open `harkawal.config.json` and change `"theme": "my-custom-theme"`.

The compiler will automatically detect your folder and use your custom layout for the entire build!

## 📝 License

MIT

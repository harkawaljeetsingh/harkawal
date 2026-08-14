# Harkawal Framework - Comprehensive User Manual

Welcome to the official User Manual for **Harkawal Framework v1.0.0**. 
This guide will take you from installation to deploying a blazing-fast, zero-dependency, component-based Bootstrap website using pure HTML string manipulation.

---

## 📖 1. Introduction
Harkawal Framework is a custom Static Site Generator (SSG) built in Node.js. It solves a specific problem: **Building blazing-fast, modern websites with reusable components (like Navbars and Footers) using pure HTML and a zero-dependency architecture.**

The framework supports Global Layouts, Clean URLs, Auto-SEO, Client-Side Search, and Built-in Premium Themes—all driven by a single CLI command.

---

## 📦 2. Installation

Because Harkawal Framework is a globally available NPM package, you can install it on any machine using Node.js.

Open your terminal and run:
```bash
npm install -g harkawal
```
*(Note: Until published, you can run the tool locally using `node bin/cli.js` from within the framework folder).*

---

## ⚡ 3. Quick Start (The 3 Core Commands)

To build and test a brand new website from scratch, open an empty folder in your terminal and run these 3 exact commands in order:

**1. Scaffold the Project:**
```bash
harkawal init
```
*(This automatically generates all your folders, layout files, and CSS themes).*

**2. Compile the Website:**
```bash
harkawal
```
*(This crushes your HTML, injects the themes, and generates your final `dist/` folder).*

**3. Test the Website Locally:**
```bash
harkawal serve
```
*(This launches the native server so you can view your site at `http://localhost:3000`).*

## 📂 4. Project Structure

When setting up a new website, your folder structure should look exactly like this:

```text
my-website/
├── harkawal.config.json     # Configuration file
├── public/                  # Static assets (images, favicon)
├── src/
│   ├── layout.html          # Global HTML wrapper
│   ├── components/          # Reusable HTML snippets
│   ├── styles/themes/       # Custom CSS themes (optional)
│   └── pages/               # Your actual pages
```

---

## ⚙️ 5. Configuration (`harkawal.config.json`)

The entire framework is controlled by simple boolean flags. Create a `harkawal.config.json` in the root of your project:

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

### Feature Flags Explained:
- **`baseUrl`**: Your live domain. Used for the Sitemap.
- **`sitemap`**: Generates a Google-ready `sitemap.xml` automatically.
- **`search`**: Parses your HTML and creates a searchable `search-data.js` database.
- **`cleanUrls`**: Strips `.html` from your files (e.g., `/about.html` becomes `/about/index.html`) and auto-rewrites all internal links to look professional.
- **`minify`**: A zero-dependency engine that crushes your HTML, removing all whitespace for extreme performance.
- **`theme`**: Selects a premium built-in CSS theme. (Available: `emerald`, `oceanic`, `crimson`).

---

## 🧩 6. The Global Layouts & Pages

Harkawal Framework uses a **Global Layout System**. You never have to write repetitive HTML (`<html>`, `<head>`, `<body>`) inside your actual pages.

### Step 1: Create `src/layout.html`
This is your master wrapper. Use the `<slot></slot>` tag to tell the compiler where to inject your pages:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Site</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <include src="navbar.html"></include>
    
    <main>
        <slot></slot> <!-- Pages are injected here -->
    </main>

    <include src="footer.html"></include>
</body>
</html>
```

### Step 2: Write your Pages
Inside `src/pages/index.html`, write pure HTML content. You can override the SEO `<title>` by adding an HTML comment at the very top:
```html
<!-- title: Home Page -->
<div class="container">
    <h1>Welcome to my site!</h1>
</div>
```

---

## 🧱 7. The Component System

To reuse pieces of code across your site (like a Navbar, Footer, or Searchbar), put them inside the `src/components/` folder.

You can inject them into any page or layout using the custom `<include>` tag:
```html
<include src="navbar.html"></include>
```
The compiler will instantly replace that tag with the actual contents of the component during build time.

---

## 🎨 8. Theming System

Harkawal Framework ships with three premium Glassmorphism themes (`emerald`, `oceanic`, `crimson`). By defining `"theme": "emerald"` in your config, the compiler will automatically copy that theme and inject a `<link rel="stylesheet">` into the `<head>` of your layout.

You do not need to manually link CSS files. Just write standard Bootstrap classes, and the active theme will automatically apply dark-mode, glowing borders, and glass effects.

### Creating Custom Themes
The beauty of this framework is its infinite extensibility. If you want a custom theme (like `"theme": "peach"`), all you have to do is create a new file named `peach.css` inside your `src/styles/themes/` folder. 

As soon as you put a file there and update your config, the framework will automatically detect it, copy it, and apply it to your entire website seamlessly! If you specify a theme that doesn't exist, the compiler is smart enough not to crash; it will simply fall back to the default Bootstrap styling.

---

## 🖼️ 9. Static Assets & Images (The `public/` folder)

Anything placed in the `public/` folder will be copied directly to the root of your final website.

### How to use Images
If you want to use an image, simply drop it into the `public/` folder (for example, `logo.png`). Because the compiler copies everything to the root, you can reference the image in any of your HTML pages using a simple forward slash `/` like this:
```html
<img src="/logo.png" alt="My Logo" class="img-fluid rounded">
```

**Pro-Tip for Image Sizing & Alignment:**
Because your framework natively supports Bootstrap 5, you can use built-in classes to make your images look perfect on any screen:
- **`img-fluid`**: Makes the image perfectly responsive. It will automatically shrink to fit inside small mobile screens without breaking the layout.
- **`rounded`**: Adds soft rounded corners for a modern look.
- **Center an Image**: If you want the image perfectly centered on the page, simply add the classes `mx-auto d-block` to your `<img>` tag, or wrap the image in a `<div class="text-center">`.

### Auto-Favicon
If you put a file named `favicon.ico` into the `public/` folder, the framework will automatically detect it and instantly inject the `<link rel="icon">` code into the `<head>` of every single page for you!

---

## 🧭 10. Managing the Navigation Bar

When you run `harkawal init`, a default Navigation Bar is generated for you at **`src/components/navbar.html`**. 

Because this framework automatically injects the full Bootstrap 5 engine (including its Javascript), you have access to powerful components like Dropdowns right out of the box.

If you have many pages and want to organize them into a Dropdown Menu, simply open `src/components/navbar.html` and paste in this standard Bootstrap dropdown code:

```html
<div class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
    More Pages
  </a>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="/services">Services</a></li>
    <li><a class="dropdown-item" href="/contact">Contact Us</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="/faq">FAQ</a></li>
  </ul>
</div>
```
When you run `harkawal`, this fully animated dropdown will instantly appear across every page on your website!

---

## 🚀 11. Building and Testing

When your code is ready, open your terminal in the project directory and run the build command:

```bash
harkawal
```
*(Or `node bin/cli.js` if running locally)*

This will generate a `dist/` folder containing your completely optimized, production-ready website.

### Testing Locally (Important!)
Because your framework utilizes **Clean URLs**, you cannot test your website by simply double-clicking the files in Windows. You must use a local web server so your browser knows how to route paths like `/about` to `/about/index.html`.

Fortunately, Harkawal Framework comes with a **Native Zero-Dependency Web Server** built right in!

To launch your website, simply run:
```bash
harkawal serve
```
Open your browser to `http://localhost:3000`, and your incredibly fast, professional website will be live!

*(Note: You can easily change the port by using the `-p` flag, for example: `harkawal serve -p 8080`).*

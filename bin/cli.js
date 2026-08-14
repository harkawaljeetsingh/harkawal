#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcPagesDir = path.join(process.cwd(), 'src', 'pages');
const srcComponentsDir = path.join(process.cwd(), 'src', 'components');
const srcStylesDir = path.join(process.cwd(), 'src', 'styles');
const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');
const configPath = path.join(process.cwd(), 'harkawal.config.json');
const layoutPath = path.join(process.cwd(), 'src', 'layout.html');

function ensureDirectories() {
    [distDir, srcPagesDir, srcComponentsDir, path.join(srcStylesDir, 'themes'), publicDir].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
}

// --- SERVE COMMAND ---
if (process.argv[2] === 'serve') {
    const http = require('http');
    const PORT = process.argv[3] === '-l' || process.argv[3] === '-p' ? parseInt(process.argv[4]) : 3000;
    
    if (!fs.existsSync(distDir)) {
        console.error('❌ Error: The dist/ directory does not exist. Run the compiler first.');
        process.exit(1);
    }

    const mimeTypes = {
        '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
        '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml'
    };

    const server = http.createServer((req, res) => {
        let reqPath = req.url === '/' ? '/index.html' : req.url;
        reqPath = reqPath.split('?')[0]; // Remove query strings

        // Clean URLs: If no extension, serve the index.html from that folder
        if (!path.extname(reqPath)) {
            reqPath = reqPath + '/index.html';
        }

        const filePath = path.join(distDir, reqPath);
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    const errorPagePath = path.join(distDir, '404.html');
                    if (fs.existsSync(errorPagePath)) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(fs.readFileSync(errorPagePath, 'utf-8'), 'utf-8');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 Not Found</h1><p>Harkawal Framework Native Server</p>', 'utf-8');
                    }
                } else {
                    res.writeHead(500);
                    res.end('Internal Server Error: ' + error.code, 'utf-8');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });

    server.listen(PORT, () => {
        console.log(`🌐 Harkawal Framework Native Server running at http://localhost:${PORT}/`);
        console.log('Press Ctrl+C to stop.');
    });

    return;
}

// --- INIT COMMAND ---
if (process.argv[2] === 'init') {
    console.log('🚀 Initializing new Harkawal Framework project...');
    ensureDirectories();
    
    // Config
    const configData = {
        baseUrl: "https://www.example.com",
        sitemap: true,
        search: true,
        cleanUrls: true,
        minify: true,
        theme: "emerald"
    };
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');
    }

    // Layout
    const layoutContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harkawal Framework</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <include src="navbar.html"></include>
    <div class="container mt-3">
        <include src="searchbar.html"></include>
    </div>
    <main style="flex: 1 0 auto;">
        <slot></slot>
    </main>
    <include src="footer.html"></include>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
    fs.writeFileSync(layoutPath, layoutContent, 'utf8');

    // Index Page
    const indexContent = `<!-- title: Welcome to Harkawal Framework -->
<div class="container mt-5" style="min-height: 60vh;">
    <div class="tt-glass-panel p-5 mb-4 text-center">
        <h1 class="display-4 fw-bold">Welcome to Harkawal Framework</h1>
        <p class="fs-4">You have successfully initialized a new project.</p>
        <a href="about.html" class="btn btn-custom btn-lg mt-3">Learn More</a>
    </div>
</div>`;
    fs.writeFileSync(path.join(srcPagesDir, 'index.html'), indexContent, 'utf8');
    fs.writeFileSync(path.join(srcPagesDir, 'about.html'), `<!-- title: About Us -->\n<div class="container mt-5"><h1>About Us</h1><p>This is a generated about page.</p></div>`, 'utf8');

    // 404 Error Page
    const errorPageContent = `<!-- title: 404 - Page Not Found -->
<div class="container mt-5 text-center" style="min-height: 60vh; display: flex; align-items: center; justify-content: center;">
    <div class="tt-glass-panel p-5 w-100">
        <h1 class="display-1 fw-bold text-danger">404</h1>
        <h2 class="display-6 fw-bold">Page Not Found</h2>
        <p class="fs-5 mt-3">The page you are looking for does not exist or has been moved.</p>
        <a href="index.html" class="btn btn-custom btn-lg mt-4">Return Home</a>
    </div>
</div>`;
    fs.writeFileSync(path.join(srcPagesDir, '404.html'), errorPageContent, 'utf8');

    // Components
    const navbarContent = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="index.html">Harkawal</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <div class="navbar-nav ms-auto">
        <a class="nav-link" href="index.html">Home</a>
        <a class="nav-link" href="about.html">About</a>
      </div>
    </div>
  </div>
</nav>`;
    fs.writeFileSync(path.join(srcComponentsDir, 'navbar.html'), navbarContent, 'utf8');
    fs.writeFileSync(path.join(srcComponentsDir, 'footer.html'), `<footer class="bg-dark text-white text-center py-3 mt-auto"><p class="mb-0">&copy; 2026 Harkawal Framework</p></footer>`, 'utf8');
    
    const searchContent = `<div class="harkawal-search-wrapper position-relative">
    <input type="text" id="hk-search-input" class="form-control" placeholder="Search..." autocomplete="off">
    <div id="hk-search-results" class="list-group position-absolute w-100" style="z-index: 1000; display: none;"></div>
</div>
<script src="/search-data.js"></script>
<script>
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('hk-search-input');
    const results = document.getElementById('hk-search-results');
    if(input) {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            results.innerHTML = '';
            if (query.length < 2) { results.style.display = 'none'; return; }
            if(window.hkSearchData) {
                const filtered = window.hkSearchData.filter(i => i.title.toLowerCase().includes(query) || i.content.toLowerCase().includes(query));
                if (filtered.length > 0) {
                    results.style.display = 'block';
                    filtered.slice(0, 5).forEach(item => {
                        const a = document.createElement('a'); a.href = item.url; a.className = 'list-group-item list-group-item-action'; a.innerHTML = \`<strong>\${item.title}</strong>\`; results.appendChild(a);
                    });
                } else {
                    results.style.display = 'block'; results.innerHTML = '<div class="list-group-item text-muted">No results found</div>';
                }
            }
        });
        document.addEventListener('click', (e) => { if (!e.target.closest('.harkawal-search-wrapper')) results.style.display = 'none'; });
    }
});
</script>`;
    fs.writeFileSync(path.join(srcComponentsDir, 'searchbar.html'), searchContent, 'utf8');

    // CSS Themes
    const baseCss = `
:root { --bg-color: #121212; --text-color: #ffffff; --glass-bg: rgba(255, 255, 255, 0.05); --glass-border: rgba(255, 255, 255, 0.1); --primary-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%); }
body { background-color: var(--bg-color); color: var(--text-color); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
.bg-light { background-color: transparent !important; }
.tt-glass-panel { background: var(--glass-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 2rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
.btn-custom { background: var(--primary-gradient); border: none; color: white; padding: 10px 24px; border-radius: 8px; transition: all 0.3s ease; }
.btn-custom:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); color: white; }
.harkawal-search-wrapper { max-width: 600px; margin: 0 auto; position: relative; }
#hk-search-input { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); color: white; border-radius: 50px; padding: 0.8rem 1.5rem; backdrop-filter: blur(10px); transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
#hk-search-input:focus { background: rgba(255, 255, 255, 0.1); box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4), 0 8px 30px rgba(0,0,0,0.4); border-color: #10b981; color: white; outline: none; }
#hk-search-results { background: rgba(20, 20, 20, 0.95); backdrop-filter: blur(15px); border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; margin-top: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
#hk-search-results .list-group-item { background: transparent; color: var(--text-color); border-color: rgba(255,255,255,0.05); padding: 1rem 1.5rem; transition: all 0.2s ease; border-left: 4px solid transparent; }
#hk-search-results .list-group-item:hover { background: rgba(16, 185, 129, 0.1); padding-left: 2rem; border-left: 4px solid #10b981; }
    `;
    
    fs.writeFileSync(path.join(srcStylesDir, 'themes', 'emerald.css'), baseCss, 'utf8');
    
    let oceanicCss = baseCss.replace(/#10b981/g, '#3b82f6').replace(/059669/g, '2563eb');
    oceanicCss = oceanicCss.replace('--bg-color: #121212', '--bg-color: #0a1128');
    fs.writeFileSync(path.join(srcStylesDir, 'themes', 'oceanic.css'), oceanicCss, 'utf8');
    
    let crimsonCss = baseCss.replace(/#10b981/g, '#ef4444').replace(/059669/g, 'dc2626');
    crimsonCss = crimsonCss.replace('--bg-color: #121212', '--bg-color: #240b0f');
    fs.writeFileSync(path.join(srcStylesDir, 'themes', 'crimson.css'), crimsonCss, 'utf8');

    console.log('✅ Project scaffolded successfully! Run `harkawal` to compile it.');
    process.exit(0);
}

// --- COMPILER CODE ---

ensureDirectories();

const includeRegex = /<include\s+src=["'](.*?)["']\s*><\/include>/g;

function getConfig() {
    const def = { baseUrl: 'https://example.com', sitemap: false, search: false, cleanUrls: false, minify: false, theme: 'emerald' };
    if (fs.existsSync(configPath)) {
        try {
            return { ...def, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
        } catch (e) { console.error('⚠️ Config parse error.'); }
    }
    return def;
}

function copyFolderRecursiveSync(source, target) {
    if (!fs.existsSync(source)) return;
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
    
    fs.readdirSync(source).forEach(file => {
        const curSource = path.join(source, file);
        const curTarget = path.join(target, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            copyFolderRecursiveSync(curSource, curTarget);
        } else {
            fs.copyFileSync(curSource, curTarget);
        }
    });
}

function extractTitle(html, defaultTitle) {
    const titleMatch = html.match(/<!--\s*title:\s*(.*?)\s*-->/i);
    if (titleMatch) return titleMatch[1];
    const tagMatch = html.match(/<title>(.*?)<\/title>/i);
    return tagMatch ? tagMatch[1] : defaultTitle;
}

function minifyHtml(html) {
    return html
        .replace(/\n/g, '')
        .replace(/[\t ]+\</g, '<')
        .replace(/\>[\t ]+\</g, '><')
        .replace(/\>[\t ]+$/g, '>');
}

function build() {
    console.log('🚀 Harkawal Framework v1.1.1: Starting build...');
    const config = getConfig();
    
    console.log('📁 Copying public assets...');
    copyFolderRecursiveSync(publicDir, distDir);
    
    const themeName = config.theme || 'emerald';
    const themePath = path.join(srcStylesDir, 'themes', `${themeName}.css`);
    let hasTheme = false;
    if (fs.existsSync(themePath)) {
        fs.copyFileSync(themePath, path.join(distDir, 'theme.css'));
        console.log(`🎨 Theme injected: ${themeName}`);
        hasTheme = true;
    }

    let layoutHtml = '<slot></slot>';
    if (fs.existsSync(layoutPath)) {
        layoutHtml = fs.readFileSync(layoutPath, 'utf8');
        console.log('🏗️  Global layout loaded.');
    }

    const pages = fs.readdirSync(srcPagesDir).filter(f => f.endsWith('.html'));
    const compiledPages = [];
    const searchDatabase = [];

    pages.forEach(page => {
        const pageContentRaw = fs.readFileSync(path.join(srcPagesDir, page), 'utf8');
        const pageTitle = extractTitle(pageContentRaw, page);
        
        let fullHtml = layoutHtml.replace('<slot></slot>', pageContentRaw);
        
        fullHtml = fullHtml.replace(includeRegex, (m, compFile) => {
            const cPath = path.join(srcComponentsDir, compFile);
            return fs.existsSync(cPath) ? fs.readFileSync(cPath, 'utf8') : `<!-- Component missing: ${compFile} -->`;
        });

        let seoTags = `<meta property="og:title" content="${pageTitle}">\n`;
        if (fs.existsSync(path.join(publicDir, 'favicon.ico'))) {
            seoTags += `    <link rel="icon" href="/favicon.ico">\n`;
        }
        fullHtml = fullHtml.replace('</head>', `    ${seoTags}</head>`);
        fullHtml = fullHtml.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);

        if (hasTheme && fullHtml.includes('</head>')) {
            const cssPath = config.cleanUrls ? '/theme.css' : 'theme.css';
            fullHtml = fullHtml.replace('</head>', `    <link rel="stylesheet" href="${cssPath}">\n</head>`);
        }

        if (config.cleanUrls) {
            fullHtml = fullHtml.replace(/href=["'](.*?)["']/g, (match, url) => {
                if (url.endsWith('.html') && !url.startsWith('http')) {
                    if (url === 'index.html') return `href="/"`;
                    return `href="/${url.replace('.html', '')}"`;
                }
                return match;
            });
            fullHtml = fullHtml.replace('src="search-data.js"', 'src="/search-data.js"');
        }

        if (config.minify) {
            fullHtml = minifyHtml(fullHtml);
        }

        let finalUrlPath = page;
        if (config.cleanUrls && page !== 'index.html' && page !== '404.html') {
            const folderName = page.replace('.html', '');
            const folderPath = path.join(distDir, folderName);
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
            fs.writeFileSync(path.join(folderPath, 'index.html'), fullHtml, 'utf8');
            finalUrlPath = `/${folderName}`;
        } else {
            fs.writeFileSync(path.join(distDir, page), fullHtml, 'utf8');
            finalUrlPath = page === 'index.html' && config.cleanUrls ? '/' : page;
        }
        
        compiledPages.push(finalUrlPath);

        if (config.search) {
            const cleanText = fullHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
            searchDatabase.push({ url: finalUrlPath, title: pageTitle, content: cleanText });
        }
    });

    if (config.sitemap) {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            compiledPages.map(p => `  <url><loc>${config.baseUrl}/${p.startsWith('/') ? p.slice(1) : p}</loc></url>`).join('\n') +
            `\n</urlset>`;
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
        console.log('✅ Sitemap created.');
    }

    if (config.search) {
        fs.writeFileSync(path.join(distDir, 'search-data.js'), `window.hkSearchData = ${JSON.stringify(searchDatabase)};`, 'utf8');
        console.log('✅ Search index created.');
    }

    console.log('🎉 v1.1.1 Build complete! Check dist/ folder.');
}

build();

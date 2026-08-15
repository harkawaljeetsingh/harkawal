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
    [distDir, srcPagesDir, srcComponentsDir, path.join(srcStylesDir, 'themes'), path.join(process.cwd(), 'src', 'themes'), publicDir].forEach(dir => {
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
        '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml',
        '.txt': 'text/plain'
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
    const targetThemeName = process.argv[3] || 'emerald';
    console.log(`🚀 Initializing new Harkawal Framework project (v1.2.0) with theme: ${targetThemeName}...`);
    
    const templateDir = path.join(__dirname, '..', 'templates', targetThemeName);
    if (!fs.existsSync(templateDir)) {
        console.error(`❌ Error: Theme template '${targetThemeName}' not found in framework templates folder.`);
        process.exit(1);
    }

    ensureDirectories();
    
    let configData = {
        baseUrl: "https://www.example.com",
        sitemap: true,
        search: true,
        cleanUrls: true,
        minify: true,
        theme: targetThemeName,
        disallow: []
    };
    if (fs.existsSync(configPath)) {
        try {
            configData = { ...configData, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
        } catch(e) {}
    }
    configData.theme = targetThemeName;
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

    const defaultThemeDir = path.join(process.cwd(), 'src', 'themes', targetThemeName);
    fs.mkdirSync(defaultThemeDir, { recursive: true });

    // 1. Copy Layout and CSS
    if (fs.existsSync(path.join(templateDir, 'layout.html'))) {
        fs.copyFileSync(path.join(templateDir, 'layout.html'), path.join(defaultThemeDir, 'layout.html'));
    }
    if (fs.existsSync(path.join(templateDir, 'theme.css'))) {
        fs.copyFileSync(path.join(templateDir, 'theme.css'), path.join(defaultThemeDir, 'theme.css'));
    }
    
    // 2. Copy Components
    // We must define copyFolderRecursiveSync early for init to use it
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

    if (fs.existsSync(path.join(templateDir, 'components'))) {
        copyFolderRecursiveSync(path.join(templateDir, 'components'), path.join(defaultThemeDir, 'components'));
    }

    // 3. Copy Pages
    if (fs.existsSync(path.join(templateDir, 'index.html'))) {
        fs.copyFileSync(path.join(templateDir, 'index.html'), path.join(srcPagesDir, 'index.html'));
    }
    if (fs.existsSync(path.join(templateDir, 'about.html'))) {
        fs.copyFileSync(path.join(templateDir, 'about.html'), path.join(srcPagesDir, 'about.html'));
    } else {
        fs.writeFileSync(path.join(srcPagesDir, 'about.html'), `<!-- title: About Us -->\n<div class="container mt-5"><h1>About Us</h1><p>This is a generated about page.</p></div>`, 'utf8');
    }

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

    console.log(`✅ Project scaffolded successfully! Run \`harkawal\` to compile it.`);
    process.exit(0);
}

// --- COMPILER CODE ---

ensureDirectories();

const includeRegex = /<include\s+src=["'](.*?)["']\s*><\/include>/g;

function getConfig() {
    const def = { baseUrl: 'https://example.com', sitemap: false, search: false, cleanUrls: false, minify: false, theme: 'emerald', disallow: [] };
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
    console.log('🚀 Harkawal Framework v1.2.0: Starting build...');
    
    // Clean old dist folder to prevent stale files
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    ensureDirectories();

    const config = getConfig();
    
    console.log('📁 Copying public assets...');
    copyFolderRecursiveSync(publicDir, distDir);
    
    const themeName = config.theme || 'emerald';
    const themeDir = path.join(process.cwd(), 'src', 'themes', themeName);
    
    // 1. Resolve Theme CSS (v1.2.0 Structural Theme vs Legacy CSS Theme)
    const themeCssPath = path.join(themeDir, 'theme.css');
    const legacyCssPath = path.join(srcStylesDir, 'themes', `${themeName}.css`);
    let hasTheme = false;
    
    if (fs.existsSync(themeCssPath)) {
        fs.copyFileSync(themeCssPath, path.join(distDir, 'theme.css'));
        console.log(`🎨 Structural Theme injected: ${themeName}`);
        hasTheme = true;
    } else if (fs.existsSync(legacyCssPath)) {
        fs.copyFileSync(legacyCssPath, path.join(distDir, 'theme.css'));
        console.log(`🎨 Legacy Theme injected: ${themeName}`);
        hasTheme = true;
    }

    // 2. Resolve Layout (Structural Theme fallback to Global)
    const themeLayoutPath = path.join(themeDir, 'layout.html');
    let layoutHtml = '<slot></slot>';
    if (fs.existsSync(themeLayoutPath)) {
        layoutHtml = fs.readFileSync(themeLayoutPath, 'utf8');
        console.log(`🏗️  Structural layout loaded for theme: ${themeName}`);
    } else if (fs.existsSync(layoutPath)) {
        layoutHtml = fs.readFileSync(layoutPath, 'utf8');
        console.log('🏗️  Global fallback layout loaded.');
    }

    const pages = fs.readdirSync(srcPagesDir).filter(f => f.endsWith('.html'));
    const compiledPages = [];
    const searchDatabase = [];

    pages.forEach(page => {
        const pageContentRaw = fs.readFileSync(path.join(srcPagesDir, page), 'utf8');
        const pageTitle = extractTitle(pageContentRaw, page);
        
        let fullHtml = layoutHtml.replace('<slot></slot>', pageContentRaw);
        
        if (!config.search) {
            fullHtml = fullHtml.replace(/<include\s+src=["']searchbar\.html["']\s*><\/include>/g, '');
        }
        
        // 3. Resolve Includes (Theme Component fallback to Global Component)
        fullHtml = fullHtml.replace(includeRegex, (m, compFile) => {
            const themeCompPath = path.join(themeDir, 'components', compFile);
            const globalCompPath = path.join(srcComponentsDir, compFile);
            
            if (fs.existsSync(themeCompPath)) {
                return fs.readFileSync(themeCompPath, 'utf8');
            } else if (fs.existsSync(globalCompPath)) {
                return fs.readFileSync(globalCompPath, 'utf8');
            }
            return `<!-- Component missing: ${compFile} -->`;
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
        
        const checkPath = finalUrlPath.startsWith('/') ? finalUrlPath : '/' + finalUrlPath;
        let isDisallowed = false;
        if (config.disallow && Array.isArray(config.disallow)) {
            isDisallowed = config.disallow.some(rule => checkPath.startsWith(rule.startsWith('/') ? rule : '/' + rule));
        }
        
        if (page !== '404.html' && !isDisallowed) {
            compiledPages.push(finalUrlPath);
        }

        if (config.search && page !== '404.html' && !isDisallowed) {
            const cleanText = fullHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
            // Prevent exact duplicates just in case
            if (!searchDatabase.find(item => item.url === finalUrlPath)) {
                searchDatabase.push({ url: finalUrlPath, title: pageTitle, content: cleanText });
            }
        }
    });

    if (config.sitemap) {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            compiledPages.map(p => `  <url><loc>${config.baseUrl}/${p.startsWith('/') ? p.slice(1) : p}</loc></url>`).join('\n') +
            `\n</urlset>`;
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
        console.log('✅ Sitemap created.');
        
        let robotsTxt = `User-agent: *\nAllow: /\n`;
        if (config.disallow && Array.isArray(config.disallow)) {
            config.disallow.forEach(rule => {
                robotsTxt += `Disallow: ${rule.startsWith('/') ? rule : '/' + rule}\n`;
            });
        }
        robotsTxt += `\nSitemap: ${config.baseUrl}/sitemap.xml\n`;
        fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
        console.log('✅ robots.txt created.');
    } else {
        const sitemapPath = path.join(distDir, 'sitemap.xml');
        if (fs.existsSync(sitemapPath)) fs.unlinkSync(sitemapPath);
        
        const robotsPath = path.join(distDir, 'robots.txt');
        if (fs.existsSync(robotsPath)) fs.unlinkSync(robotsPath);
    }

    if (config.search) {
        fs.writeFileSync(path.join(distDir, 'search-data.js'), `window.hkSearchData = ${JSON.stringify(searchDatabase)};`, 'utf8');
        console.log('✅ Search index created.');
    }

    console.log('🎉 v1.2.0 Build complete! Check dist/ folder.');
}

build();

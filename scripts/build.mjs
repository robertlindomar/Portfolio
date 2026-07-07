#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import Handlebars from 'handlebars';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}

function renderV1Projects(items) {
  return items.map(function (item) {
    const thumbClass = item.thumbIcon
      ? 'h-32 w-32 object-contain transform group-hover:scale-110 transition duration-500'
      : 'w-full h-48 object-cover transform group-hover:scale-110 transition duration-500';
    const thumbWrap = item.thumbIcon
      ? '<div class="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 h-48 flex items-center justify-center">'
      : '<div class="relative overflow-hidden">';
    const tags = item.tags.map(function (t) {
      return '<span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">' + t + '</span>';
    }).join('\n                            ');
    return `
                <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300 group flex flex-col">
                    ${thumbWrap}
                        <picture>
                            <source srcset="/${item.thumbWebp}" type="image/webp">
                            <img src="/${item.thumbPng}" alt="${item.thumbAlt}" class="${thumbClass}" width="512" height="512" loading="lazy" decoding="async">
                        </picture>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="text-xl font-semibold mb-2">${item.title}</h3>
                        <p class="text-gray-600 mb-4 flex-grow">${item.description}</p>
                        <p class="text-sm text-gray-500 mb-4"><strong>O que resolve:</strong> ${item.resolve}</p>
                        <div class="flex flex-wrap gap-2 mb-4">${tags}</div>
                        <a href="${item.linkUrl}" class="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center" target="_blank" rel="noopener noreferrer">${item.linkLabel}</a>
                    </div>
                </div>`;
  }).join('\n');
}

function enrichData(raw) {
  const data = structuredClone(raw);
  const wa = data.contact.whatsapp;
  data.urls = {
    whatsapp: 'https://api.whatsapp.com/send?phone=' + wa.phone + '&text=' + encodeURIComponent(wa.message),
  };
  data.hero.headlineV1 = stripHtml(data.hero.headline);
  data.partials = {
    v1Projects: renderV1Projects(data.projects.items),
  };
  return data;
}

function renderTemplate(templatePath, data) {
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(source, { noEscape: false });
  return template(data);
}

function buildV1Css() {
  const input = path.join(root, 'versions/v1/assets/css/tailwind-input.css');
  const output = path.join(root, 'versions/v1/assets/css/tailwind-built.css');
  const config = path.join(root, 'versions/v1/tailwind.config.js');
  execSync(
    'npx tailwindcss -i "' + input + '" -o "' + output + '" -c "' + config + '" --minify',
    { cwd: root, stdio: 'inherit' }
  );
}

function main() {
  const data = enrichData(readJson(path.join(root, 'content/site.json')));

  console.log('Building v1 CSS (Tailwind)...');
  buildV1Css();

  console.log('Rendering v2 → index.html');
  const v2Html = renderTemplate(path.join(root, 'versions/v2/template.html'), data);
  fs.writeFileSync(path.join(root, 'index.html'), v2Html);

  console.log('Rendering v1 → v1/index.html');
  const v1Html = renderTemplate(path.join(root, 'versions/v1/template.html'), data);
  ensureDir(path.join(root, 'v1'));
  fs.writeFileSync(path.join(root, 'v1/index.html'), v1Html);

  console.log('Copying v2 assets...');
  copyDir(path.join(root, 'versions/v2/assets/css'), path.join(root, 'css'));
  copyDir(path.join(root, 'versions/v2/assets/js'), path.join(root, 'js'));

  console.log('Copying v1 assets...');
  copyDir(path.join(root, 'versions/v1/assets/css'), path.join(root, 'v1/css'));
  copyDir(path.join(root, 'versions/v1/assets/js'), path.join(root, 'v1/js'));

  console.log('Build complete.');
}

main();

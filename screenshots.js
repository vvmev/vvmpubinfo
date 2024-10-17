#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');

const pages = [
  { url: 'https://www.vvm-museumsbahn.de', file: 'homepage.png' },
  { url: 'https://www.vvm-museumsbahn.de/wordpress/', file: 'blog.png' },
  // { url: 'https://twitter.com/vvmev', file: 'twitter.png' },
  // { url: 'https://www.facebook.com/lokschuppenaumuehle/', file: 'facebook.png' },
];

const path = process.env.SCREENSHOTDIR || './screenshots';

fs.mkdirSync(path, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024});
  await page.setCookie({
    name: 'eu_cn',
    value: '1',
    path: '/',
    domain: '.twitter.com',
    secure: true,
  });
  for (const item of pages) {
    await page.goto(item.url, { waitUntil: 'networkidle2' });
    await page.screenshot({path: path + "/" + item.file});
  }

  await browser.close();
})();

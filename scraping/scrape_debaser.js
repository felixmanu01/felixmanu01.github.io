const fs = require('fs/promises');
const path = require('path');
const cheerio = require('cheerio');

const SOURCE_URL = 'https://debaser.se/konserter';
const OUTPUT_FILE = path.join(__dirname, 'scraped_data.txt');
const SCRIPT_TEXT_FILE = path.join(__dirname, 'script.txt');

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function titleFromSlug(href) {
  const slug = href.split('/events/')[1] || '';
  return slug
    .split(/[?#]/)[0]
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function findContext($, link) {
  let node = link;

  for (let depth = 0; depth < 7; depth += 1) {
    node = node.parent();
    if (!node.length) break;

    const text = clean(node.text());

    const hasYear = /\b20\d{2}\b/.test(text);
    const hasVenue = /Debaser\s+(Nova|Strand|Pontonen)/i.test(text);
    const hasConcert = /\bCONCERT\b/i.test(text);

    if (hasYear && hasVenue && hasConcert) {
      return text;
    }
  }

  return clean(link.parent().text());
}

function parseDate(text) {
  const match = text.match(
    /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+20\d{2}\b/i
  );
  return match ? match[0] : 'Datum saknas';
}

function parseVenue(text) {
  const match = text.match(/Debaser\s+(Nova|Strand|Pontonen)/i);
  return match ? match[0] : 'Plats saknas';
}

async function main() {
  if (typeof fetch !== 'function') {
    throw new Error('Du behöver Node.js version 18 eller senare.');
  }

  console.log('Hämtar konserter från Debaser...');

  const response = await fetch(SOURCE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 Felix Manu student project'
    }
  });

  if (!response.ok) {
    throw new Error(`Debaser svarade med status ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const events = [];
  const seen = new Set();

  $('a[href^="/events/"]').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');

    if (!href || seen.has(href)) return;

    const context = findContext($, link);
    const title = clean(link.text()) || titleFromSlug(href);
    const date = parseDate(context);
    const venue = parseVenue(context);

    if (!title) return;

    seen.add(href);

    events.push({
      title,
      date,
      venue,
      url: new URL(href, SOURCE_URL).href
    });
  });

  if (events.length === 0) {
    throw new Error(
      'Inga event hittades. Debaser kan ha ändrat sin HTML struktur. Kontrollera sidan och uppdatera selektorn i scriptet.'
    );
  }

  const timestamp = new Date().toISOString();

  const lines = [
    'DEBASER KONSERTER',
    '',
    `Källa: ${SOURCE_URL}`,
    `Insamlad: ${timestamp}`,
    `Antal event: ${events.length}`,
    '',
    ...events.flatMap((event, index) => [
      `${index + 1}. ${event.title}`,
      `Datum: ${event.date}`,
      `Plats: ${event.venue}`,
      `URL: ${event.url}`,
      ''
    ])
  ];

  await fs.writeFile(OUTPUT_FILE, lines.join('\n'), 'utf8');

  const currentScript = await fs.readFile(__filename, 'utf8');
  await fs.writeFile(SCRIPT_TEXT_FILE, currentScript, 'utf8');

  console.log(`Klart. ${events.length} event sparades.`);
  console.log(`Data: ${OUTPUT_FILE}`);
  console.log(`Script: ${SCRIPT_TEXT_FILE}`);
}

main().catch(error => {
  console.error('Fel:', error.message);
  process.exitCode = 1;
});

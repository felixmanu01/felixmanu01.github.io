FELIX MANU
DEBASER WEB SCRAPING

PLACERING

Lägg hela mappen scraping bredvid din index.html.

Din struktur ska då se ut så här:

index.html
data.html
gigradar.html
scraping
  index.html
  scrape_debaser.js
  script.txt
  scraped_data.txt
  package.json

KÖR I VS CODE

Öppna terminalen i VS Code.

Gå in i mappen:

cd scraping

Installera Cheerio:

npm install

Kör scrapingen:

npm run scrape

När scriptet är klart uppdateras automatiskt:

scraped_data.txt
script.txt

PUBLICERA

Ladda sedan upp ändringarna till GitHub.

På GitHub Pages kan läraren öppna:

din adress /scraping/
din adress /scraping/script.txt
din adress /scraping/scraped_data.txt

SEPARATION AV UPPGIFTER

Debaser web scraping är grunduppgiften.

Gig Radar Stockholm är det separata VG caset där scraped data kombineras med API data.

VIKTIGT

Kör scriptet själv före inlämning.
Då blir scraped_data.txt resultatet från din egen körning.

# DESIGN.md: felixmanu01.github.io

Personal portfolio for Felix Manu, growth marketer in Stockholm focused on
performance marketing. Readers: recruiters and marketing leads at agencies
and in-house teams. Feeling: calm, confident, editorial. The work and the
portrait carry the page; the interface stays quiet.

Compared with: kevin-indig.com (ex Shopify, G2, Atlassian), rauno.me
(Vercel), emilkowal.ski (Linear, Vercel), stephsmith.io (Nvidia, a16z).
What they share: one sentence that says who the person is, proof early,
work shown as a short list, few sections, one way to make contact.
No skills grids.

All values live as CSS variables in `assets/site.css`. Pages use the
names, never raw values.

## Color

Taken from the portrait: the grey studio wall, the denim sweater, the
near black of the hair. No dark mode.

| Token | Value | Role |
|---|---|---|
| `--paper` | #E6E2E4 | Page background. Matches the photo wall so the portrait has no edge |
| `--paper-2` | #EFECEE | Raised surfaces: case cards, panels |
| `--paper-3` | #F8F6F7 | Tables, charts, text on dark |
| `--ink` | #121621 | Text, primary buttons |
| `--ink-2` | ink at 74% | Body copy, secondary text |
| `--ink-3` | ink at 58% | Labels, meta. Never for body text |
| `--denim` | #21546F | The only accent: links on hover, highlighted data, focus ring |
| `--denim-deep` | #15344A | Contact band background |
| `--denim-tint` | denim at 10% | Hover fill on rows |
| `--line` / `--line-2` | ink at 14% / 28% | Dividers / stronger dividers and outlines |

Contrast: ink on paper 15:1, ink-2 on paper 8:1, paper-3 on denim-deep 11:1.
Error color (Gig Radar only): #8A2E1C on a 7% tint.

## Typography

One family, Archivo (Google Fonts, variable width and weight).

* Display: Archivo at 125% width, weight 800, tracking -0.02em to -0.04em,
  sentence case. Headings, numbers, the logo.
* Text: Archivo at 100% width, weight 400 to 700, 17px (16px on phones),
  line height 1.55, lines under 65 characters.

Scale: 0.8rem labels, 0.9rem small, 1rem body, 1.2rem lede,
1.6rem h3, 2.6 to 3.3rem h2, 4.6 to 5rem hero, up to 9rem contact.
Tabular numbers everywhere.

## Spacing and layout

8px based. Content width 1240px, side padding 20 to 64px.
Sections 80 to 140px apart, separated by a 1px line.
Text is left aligned. Nothing is centered except the portrait.

## Shape and depth

Radius: 999px for buttons and tags, 6 to 10px for small surfaces, 0 for
cards, images and tables. No shadows, except the paper prototype sheet.

## Components

* Buttons: primary (ink fill, turns denim on hover), ghost (ink outline,
  fills on hover). Height 52px, 42px in the nav. Visible focus ring in denim.
* Text link: underline that retracts on hover.
* Tag: pill with outline, used for tools and case type.
* Case row: type tag, title, one line, "Open" link. Hover: denim top
  line draws in, row tints.
* Case feature: text plus real campaign images, no numbers unless approved.
* Case page: back link, title, lede, meta row, blocks, "Next case" link.
* Nav: logo, three links, one contact button. Burger under 760px.
* Footer: copyright, LinkedIn, back link.

## Imagery

Real photos only: the portrait and the campaign images. Images are never
rounded or framed. No icons, no emoji, no illustrations.

## Motion

One entrance per page (hero lines rise, portrait reveals, a line draws).
Everything else responds to the visitor: hover, filter, menu.
All of it turns off with prefers-reduced-motion.

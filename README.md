# American Women's Fashion (1938–1975)

An interactive [TimelineJS](https://timeline.knight.lab.northwestern.edu/) timeline. It asks how changing social roles for American women between 1938 and 1975 shaped women's fashion, across 13 entries in four eras.

- [Original Google Sheets embed](https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vSZwW_uMHT_H850iKbjTQ_zjHXvvk5Aqi0NZTcZTq3gUGGXa-OK5RBlXaGWwtiSNj4h_Zqt1vIGgT_n&font=Default&lang=en&initial_zoom=2&width=100%25&height=650)
- Source and citation review: [SOURCES.md](SOURCES.md)

## Project structure

| File | Purpose |
|---|---|
| `data/timeline.csv` | Timeline content in the TimelineJS Google Sheets template format. This is the file to edit. It can be pasted back into the Google Sheet. |
| `data/timeline.json` | Generated from the CSV. `index.html` loads this file. |
| `data/original/timeline-original.csv` | Untouched export of the original Google Sheet, kept as a backup. |
| `index.html` | Self-hosted timeline page with the same options as the original embed. |
| `scripts/build.ps1` | Rebuilds `timeline.json` from `timeline.csv`. |

## Editing

1. Edit `data/timeline.csv`.
2. Run `powershell -ExecutionPolicy Bypass -File scripts/build.ps1`.
3. Preview through a local web server, for example `npx serve .` or `python -m http.server`. Opening `index.html` directly as a file blocks the JSON from loading.

## Design and accessibility

- **Palette:** army green (Part I), parchment white (Part II), oxblood red (Part III), and navy blue (Part IV). The late-1960s slide uses a dusty blue as the bridge into Part IV. Slide backgrounds are set in the `Background` column of `data/timeline.csv`.
- **Contrast:** every slide's text meets WCAG AA (4.5:1 or higher), and most meet AAA (7:1). Light backgrounds use dark ink text and dark backgrounds use cream text. The ratios are listed at the top of the `<style>` block in `index.html`.
- **Not by color alone:** each slide shows a text label naming its era, such as "Part II: The Return to Femininity". The era bands on the time bar keep their text names.
- **Images:** all images are shown in black and white with a CSS filter. The original files are unchanged.
- **Chapter dividers:** TimelineJS normally shows the four era rows only as bands on the time bar. `scripts/build.ps1` also turns each era row into a chapter-divider slide at the start of its period, using the same title, dates, and description. Each era row's `Background` column in the CSV sets its divider's color.

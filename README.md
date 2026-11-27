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

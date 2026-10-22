# Ukraine War Crimes Map

An interactive map of 40 well-documented attacks, killings and abuses in Russia's war against Ukraine, as recorded by the UN Human Rights Monitoring Mission, the UN Commission of Inquiry, the OSCE, the ICC and Ukrainian authorities. Each event lists its figures, its geolocation, who is responsible according to the cited body, and its sources.

**View the map:** https://jacopoottaviani.github.io/ukraine-war-crimes-map/

This is a selection, not a complete record. Figures and sources were checked on 22 October 2026; see [data/verification.md](data/verification.md) for the check of each event.

## Data

- [data/events.json](data/events.json): the events, with categories, figures, attribution and sources
- [data/events.geojson](data/events.geojson): the same events as GeoJSON points
- [data/verification.md](data/verification.md): the source check for each event

## Building

The page is a single HTML file with the data, basemap and styles inlined. To rebuild it after editing `data/events.json` or `src/template.html`:

```bash
node src/build.js
```

This writes `index.html` (the page GitHub Pages serves), `dist/artifact.html` and `data/events.geojson`. The basemap in `vendor/basemap.js` comes from geoBoundaries (ADM1) and Natural Earth; `vendor/leaflet-markercluster.css` holds the stylesheets of [Leaflet](https://leafletjs.com) and [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).

## Credits

Map and research by [Jacopo Ottaviani](https://jacopoottaviani.com).

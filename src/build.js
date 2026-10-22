// Assembles the single-file map page and a GeoJSON copy of the dataset.
// Usage: node src/build.js [basemap.js] [leaflet.css markercluster.css ...]
// With no arguments it uses vendor/: the basemap, and the Leaflet and MarkerCluster stylesheets in one file.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const [basemapPath = path.join(root, "vendor/basemap.js"), ...cssPaths] = process.argv.slice(2);

const data = JSON.parse(fs.readFileSync(path.join(root, "data/events.json"), "utf8"));
// Leaflet's stock marker and layer-control images are unused here; drop them so the page makes no blocked requests.
const css = (cssPaths.length ? cssPaths : [path.join(root, "vendor/leaflet-markercluster.css")])
  .map(p => fs.readFileSync(p, "utf8")).join("\n")
  .replace(/[^{}]*\{[^{}]*url\(images\/[^)]*\)[^{}]*\}/g, "");

const html = fs.readFileSync(path.join(__dirname, "template.html"), "utf8")
  .replace("/*LEAFLET_CSS*/", () => css)
  .replace("/*BASEMAP*/", () => fs.readFileSync(basemapPath, "utf8"))
  .replace("/*EVENTS*/", () => JSON.stringify(data).replace(/</g, "\\u003c"));
// The artifact host adds the document skeleton itself; the standalone copy (served by GitHub Pages) carries its own, with the favicons.
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/artifact.html"), html);
fs.writeFileSync(path.join(root, "index.html"),
  `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<link rel="icon" href="brand/favicon.svg" type="image/svg+xml">\n<link rel="icon" href="brand/favicon-32.png" sizes="32x32" type="image/png">\n<link rel="apple-touch-icon" href="brand/apple-touch-icon.png">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}*,*::before,*::after{box-sizing:border-box}</style>\n</head>\n<body>\n${html}\n</body>\n</html>\n`);

const geojson = {
  type: "FeatureCollection",
  metadata: data.meta,
  features: data.events.map(({ lat, lng, ...props }) => ({ type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] }, properties: props }))
};
fs.writeFileSync(path.join(root, "data/events.geojson"), JSON.stringify(geojson, null, 2));
console.log("events", data.events.length, "html bytes", html.length);

const fs = require('fs');
const admZip = require('adm-zip');
const togeojson = require('@mapbox/togeojson')
const path = require('path');
const { DOMParser } = require('xmldom');

// Convert KMZ to GeoJSON
function kmzToGeojson(kmzFile, geojsonFile) {
    const zip = new admZip(kmzFile);
    const outputDir = path.join(__dirname, 'extracted_kmz');
    zip.extractAllTo(outputDir, true);

    const files = fs.readdirSync(outputDir);
    const kmlFile = files.find((file) => file.endsWith('.kml'));

    if (!kmlFile) {
        console.error('KML file not found inside KMZ!');
        return;
    }

    const kmlContent = fs.readFileSync(path.join(outputDir, kmlFile), 'utf8');

    console.log("KML content:");
    console.log(kmlContent);

    const dom = new DOMParser().parseFromString(kmlContent, 'application/xml');
    const geojson = togeojson.kml(dom);

    fs.writeFileSync(geojsonFile, JSON.stringify(geojson, null, 2));

    console.log(`The KMZ file has been converted to ${geojsonFile} succesfully.`);
}

const args = process.argv.slice(2);
const kmzFile = args[0];
const geojsonFile = args[1];

if (!kmzFile || !geojsonFile) {
    console.error('Use: node index.js <archivo.kmz> <archivo_convertido.geojson>');
    process.exit(1);
}

// Execute the script
kmzToGeojson(kmzFile, geojsonFile);
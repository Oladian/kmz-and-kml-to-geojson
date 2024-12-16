const fs = require('fs');
const admZip = require('adm-zip');
const togeojson = require('@mapbox/togeojson')
const path = require('path');
const { DOMParser } = require('xmldom');

function kmzToGeojson(fileToConvert, geojsonFile) {
    const kmlOutputDir = path.join(__dirname, 'extracted_kmz');
    const geojsonOutputDir = './generatedGeojson';

    let zip;
    let dom;
    let kmlContent;

    if (fileToConvert.indexOf('.kmz') !== -1) {
        zip = new admZip(fileToConvert);
        zip.extractAllTo(kmlOutputDir, true);

        const files = fs.readdirSync(kmlOutputDir);
        const kmlFile = files.find((file) => file.endsWith('.kml'));

        if (!kmlFile) {
            console.error('KML file not found inside KMZ!');
            return;
        }

        kmlContent = fs.readFileSync(path.join(kmlOutputDir, kmlFile), 'utf8');
        dom = new DOMParser().parseFromString(kmlContent, 'application/xml');
    }

    if (fileToConvert.indexOf('.kml') !== -1) {
        kmlContent = fs.readFileSync(fileToConvert, 'utf8');
        dom = new DOMParser().parseFromString(kmlContent, 'application/xml');
    }

    console.log("KML content:");
    console.log(kmlContent);

    const geojson = togeojson.kml(dom);

    if (!fs.existsSync(geojsonOutputDir)) {
        fs.mkdirSync(geojsonOutputDir);
    }

    if (!geojsonFile.indexOf('.geojson') !== -1) {
        geojsonFile = geojsonFile+'.geojson';
    }

    fs.writeFileSync(path.join(geojsonOutputDir, geojsonFile), JSON.stringify(geojson, null, 2));

    console.log(`The file has been converted to ${geojsonFile} succesfully.\n\nYou can find it here ==> ${path.resolve(geojsonOutputDir+'/'+geojsonFile)}`);
}

const args = process.argv.slice(2);
const kmzFile = args[0];
const geojsonFile = args[1];

if (!kmzFile || !geojsonFile) {
    console.error('Use: node index.js <archivo.kmz> <archivo_convertido.geojson>');
    process.exit(1);
}

kmzToGeojson(kmzFile, geojsonFile);
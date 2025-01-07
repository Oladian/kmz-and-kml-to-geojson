# kmz-kml to geojson
Convert KMZ or KML to GeoJSON

# Installation

Node version 20.15.0

```
npm install
```

# Execution

### Run the following command, changing the path to the files. You can use absolute paths to import the kml or kmz file; but the output file will be created in the `./generatedGeojson` folder.

You can just avoid the extension of the output file.

#### Accept kmz files
```
npm run convert -- file.kmz file_convert.geojson
```

#### Accepts kml files
```
npm run convert -- file.kmz file_convert
```

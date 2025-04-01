import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON'; // Import the GeoJSON format from OpenLayers


// Create a vector source for polygon
const polygonSource = new VectorSource();

// Fetch the GeoJSON file for polygon and load them
fetch('/src/data/civil-defence-regions.geojson') // Load the GeoJSON file from the public folder
.then((response) => response.json())
.then((geojsonData) => {
  // Parse the GeoJSON data for points using OpenLayers' GeoJSON format parser
  const geoJSONFormat = new GeoJSON();
  const features = geoJSONFormat.readFeatures(geojsonData, {
    dataProjection: 'EPSG:4326', // Projection of input data (GeoJSON uses EPSG:4326 by default)
    featureProjection: 'EPSG:3857', // Convert to the map's projection (EPSG:3857)
  });

  // Add the features (points) to the vector source
  polygonSource.addFeatures(features);
})
.catch((error) => console.error('Error loading GeoJSON data:', error));

// Function to determine polygon style based on the category
export const getPolygonStyle = (category) => {
    switch (category) {
      case 'first-aid':
        return new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.3)', // Red fill for important
          }),
          stroke: new Stroke({
            color: '#ff0000', // Red border for important
            width: 2,
          }),
        });
      default:
        return new Style({
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.2)', // Blue fill for normal
          }),
          stroke: new Stroke({
            color: '#0000ff', // Blue border for normal
            width: 2,
          }),
        });
    }
  };

// Create a vector layer for polygons with dynamic styling
export const polygonLayer = new VectorLayer({
  source: polygonSource,
  style: (feature) => getPolygonStyle(feature.get('category')), // Apply dynamic style based on 'category'
});


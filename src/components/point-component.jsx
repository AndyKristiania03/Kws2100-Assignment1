import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON'; // Import the GeoJSON format from OpenLayers

// Create a vector source for points
const pointSource = new VectorSource();

// Fetch the GeoJSON file and load the pointsS
fetch('/src/data/public-shelters.geojson') // Adjust the path according to your file location
  .then((response) => response.json())
  .then((geojsonData) => {
    // Parse the GeoJSON data and add it to the pointsSource
    const geoJSONFormat = new GeoJSON();
    const features = geoJSONFormat.readFeatures(geojsonData, {
      dataProjection: 'EPSG:4326', // Specify the projection of your data (GeoJSON is often in EPSG:4326)
      featureProjection: 'EPSG:3857', // The projection for your map (usually EPSG:3857 for OpenStreetMap)
    });
    pointSource.addFeatures(features); // Add parsed features to the source
  })
  .catch((error) => console.error('Error loading GeoJSON data:', error));

// Function to determine point style based on the category
export const getPointStyle = (category) => {
  switch (category) {
    case 'critical':
      return new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      });
    default:
      return new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: 'purple' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      });
  }
};

 // Create a vector layer for points with custom styling
export const pointsLayer = new VectorLayer({
  source: pointSource,
  style: (feature) => getPointStyle(feature.get('category')), // Apply dynamic style based on 'category'
});

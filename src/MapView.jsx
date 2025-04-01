import React, { useState, useEffect } from 'react';
import 'ol/ol.css'; // Import OpenLayers CSS
import { Map, View } from 'ol';
import { Tile as TileLayer} from 'ol/layer';
import { OSM } from 'ol/source';
import { Select } from 'ol/interaction';
import { click } from 'ol/events/condition';
import { transform } from 'ol/proj'; // Import transform for coordinate transformation
import { polygonLayer } from './components/polygon-component';
import { pointsLayer } from './components/point-component';

const MapView = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    // Create a base layer using OpenStreetMap
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // Initialize the map with EPSG:4326 and handle transformation to EPSG:3857
    const map = new Map({
      target: 'map', // This is the ID of the container element
      layers: [osmLayer, polygonLayer, pointsLayer], // Add both layers (points and polygons)
      view: new View({
        projection: 'EPSG:3857', // Set the map view to EPSG:3857 (Web Mercator)
        center: transform([8.4689, 60.4720], 'EPSG:4326', 'EPSG:3857'), // Center on Europe, converted to EPSG:3857
        zoom: 4,
      }),
    });

    // Add Select interaction to allow pointer-based selection
    const select = new Select({
      condition: click, // Condition for selecting (on click)
    });

    // Add the select interaction to the map
    map.addInteraction(select);

    // Add a listener for when a feature is selected
    select.on('select', (e) => {
      const selected = e.selected[0]; // Get the first selected feature (if any)
      setSelectedFeature(selected ? selected : null);
    });

    // Clean up the map when the component is unmounted
    return () => {
      map.setTarget(undefined); // Cleanup the map target
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', flexDirection:'column', display: 'flex' }}>
      <div id="map" style={{ flex: selectedFeature ? 0.7 : 1, width: '100%', height: '100%' }}></div> {/* Map Container */}

      {selectedFeature && (
        <div
          style={{
            flex: 0.3,
            width: '100%',
            background: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            marginTop: '20px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3>Information</h3>
           {/* display name & url */}
          {!!selectedFeature.get('navn') && <p><strong>Name:</strong> {selectedFeature.get('navn')}</p>}
          {!!selectedFeature.get('url') && <p><strong>URL:</strong> {selectedFeature.get('url')}</p>}
          {!!selectedFeature.get('category') && <p><strong>Category:</strong> {selectedFeature.get('category')}</p>}
          
           {/* display address details */}
          {!!selectedFeature.get('romnr') && <p><strong>Room No:</strong> {selectedFeature.get('romnr')}</p>}
          {!!selectedFeature.get('plasser') && <p><strong>Place:</strong> {selectedFeature.get('plasser')}</p>}
          {!!selectedFeature.get('adresse') && <p><strong>Address:</strong> {selectedFeature.get('adresse')}</p>}

          {/* Optionally, you can also display geometry type */}
          <p><strong>Geometry Type:</strong> {selectedFeature.getGeometry()?.getType()}</p>
          
          {/* Display coordinates if the geometry is a polygon */}
          {selectedFeature.getGeometry()?.getType() === 'Point' && (
            <p><strong>Coordinates:</strong> {JSON.stringify(selectedFeature.getGeometry().getCoordinates())}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;

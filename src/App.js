import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3JlZ2tvemxvdiIsImEiOiJjbHV1eHJ0eTQwZjIwMmpuMXZhMm45MDkwIn0.YuoiWCGT5tSV48-IG-1wgg";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-77.0214);
  const [lat, setLat] = useState(38.897);
  const [zoom, setZoom] = useState(12);

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [-77.0366048812866, 38.89873175227713],
            [-77.03364372253417, 38.89876515143842],
            [-77.03364372253417, 38.89549195896866],
            [-77.02982425689697, 38.89549195896866],
            [-77.02400922775269, 38.89387200688839],
            [-77.01519012451172, 38.891416957534204],
            [-77.01521158218382, 38.892068305429156],
            [-77.00813055038452, 38.892051604275686],
            [-77.00832366943358, 38.89143365883688],
            [-77.00818419456482, 38.89082405874451],
            [-77.00815200805664, 38.88989712255097],
          ],
        },
        properties: {},
      },
    ],
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current.addSource("LineString", {
        type: "geojson",
        data: geojson,
      });
      map.current.addLayer({
        id: "LineString",
        type: "line",
        source: "LineString",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#BF93E4",
          "line-width": 5,
        },
      });
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  // const zoomToBounds = () => {
  //   const coordinates = geojson.features[0].geometry.coordinates;
  //   const bounds = coordinates.reduce((bounds, coord) => {
  //     return bounds.extend(coord);
  //   }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

  //   map.current.fitBounds(bounds, {
  //     padding: 20,
  //   });
  // };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;

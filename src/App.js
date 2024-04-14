import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";
import geotags from "./geotags_small.json";
import FileUploader from "./FileUploader";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3JlZ2tvemxvdiIsImEiOiJjbHV1eHJ0eTQwZjIwMmpuMXZhMm45MDkwIn0.YuoiWCGT5tSV48-IG-1wgg";

function App() {
  const [data, setData] = useState(
    geotags.events.map(item => [
      item.positions[0].longitude,
      item.positions[0].latitude,
    ]),
  );
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(9.6348);
  const [lat, setLat] = useState(50.1758);
  const [zoom, setZoom] = useState(6.21);

  const handleFilter = () => {
    const filteredItems = geotags.events.filter(
      item => item.positions[0].latitude === 49.58508,
    );
    const newCoordinates = filteredItems.map(item => [
      item.positions[0].longitude,
      item.positions[0].latitude,
    ]);
    console.log("🚀 ~ newCoordinates:", newCoordinates);
    setData(newCoordinates);
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current.addSource("LineString", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: data,
              },
              properties: {},
            },
          ],
        },
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

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      map.current.getSource("LineString").setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: data,
            },
            properties: {},
          },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      <FileUploader />
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        <button onClick={handleFilter}>Filter</button>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;

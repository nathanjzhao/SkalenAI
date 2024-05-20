import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import Papa from 'papaparse';
import MauiButton from './MauiButton';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapComponent = ({mode}) => {

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchCSV = async () => {
      const data = await fetch('/Maui.csv');
      const text = await data.text();
      const result = Papa.parse(text, { header: true, dynamicTyping: true });
      setLocations(result.data);
    };

    fetchCSV();
  }, []);

  return (
    <>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MauiButton />
        {locations.length > 0 && locations.map((location, index) => {
          const lat = Number(location['geotagging_lat']);
          const lon = Number(location['geotagging_lon']);
          if (!isNaN(lat) && !isNaN(lon)) {
            // const roundedConfidence = Number(location['geotagging_confidence'].toFixed(3));
            const date = new Date(location['created_at']);
            return (
              <Marker key={index} position={[lat, lon]}>
                <Popup>
                  <span>{location['text']} 
                    <br/><br/>
                    <p>By {location['author_username']} at {date.toLocaleDateString() + ', ' + date.toLocaleTimeString()}</p>
                    <p>Geolcation confidience: {location['geotagging_confidence']}</p>
                    <a href={location['url']}>View Tweet here</a></span>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </>
  );
};

export default MapComponent;
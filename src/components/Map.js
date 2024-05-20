import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import Papa from 'papaparse';

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// export async function getStaticProps() {
//   const data = await fetch('/Maui.csv');
//   const text = await data.text();
//   console.log(text);
//   const result = Papa.parse(text, { header: true, dynamicTyping: true });
//   console.log(result);
//   const locations = result.data;
//   console.log(locations);

//   return {
//     props: {
//       locations,
//     },
//   };
// }

const MapComponent = () => {

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

  useEffect(() => {
    console.log(locations);
  }, [locations]);

  return (
    <>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.length > 0 && locations.map((location, index) => {
          const lat = Number(location['geotagging_lat']);
          const lon = Number(location['geotagging_lon']);
          if (!isNaN(lat) && !isNaN(lon)) {
            return <Marker key={index} position={[lat, lon]} />;
          }
          return null;
        })}
      </MapContainer>
    </>
  );
};

export default MapComponent;
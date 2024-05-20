import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic"
import Papa from 'papaparse';

const MapComponent = dynamic(() => import("@/components/Map.js"), { ssr:false })

export default function Home() {

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
    <div className="flex h-screen">
      <div className="w-full">
        <MapComponent />
      </div>
      <div className="overflow-y-auto w-1/2 bg-twitter-blue p-4">
        {locations.filter(location => isNaN(Number(location['geotagging_lon']))).map((location, index) => (
          <a href={location.url} key={index} className="block border-b border-gray-200 py-2">
            <div>
              <p>{location.text}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic"
import Papa from 'papaparse';

const MapComponent = dynamic(() => import("@/components/Map.js"), { ssr:false })

export default function Home() {
  const router = useRouter();
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


  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
  };

  const goFollowers = async () => {
    router.push('/followers')
  };


  // useEffect(() => {
  //   fetch('fol.txt')
  //     .then(response => response.text())
  //     .then(data => {
  //       const lines = data.split('\n');
  //       const followerList = JSON.parse(lines[1]).data.user.timeline_response.timeline.instructions[3].entries;
  //       const followerName = followerList[0].content.content.userResult.result.legacy.screen_name
  //       console.log(followerName)
  //     })
  //     .catch(error => console.error('Error:', error));
  // }, []);
  

  return (
    <div className="flex flex-col">
      <div className="flex flex-grow">
        <div className="w-full">
          <MapComponent/>
        </div>

        {/* Unmapped Tweets */}
        <div className="overflow-y-auto w-1/2 bg-twitter-blue p-4 h-screen">
          <div className="text-white flex justify-between p-4 items-center min-h-[80px] z-100 bg-blue-500">
            <button onClick={fetchData}>Fetch Data</button>
            <button onClick={goFollowers}>Visualize Followers</button>
          </div>
          {locations.filter(location => isNaN(Number(location['geotagging_lon']))).map((location, index) => (
            <a href={location.url} key={index} className="block border-b border-gray-200 py-2">
              <div>
                <p>{location.text}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

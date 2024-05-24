import { useEffect, useRef } from 'react';

export default function Followers() {
  const networkContainer = useRef(null);

  const handleButtonClick = async () => {
    // Fetch userFollowers from userFollowers.json
    fetch('/userFollowers.json')
      .then(response => response.json())
      .then(userFollowers => {
          import('vis-network/standalone/esm/vis-network').then(vis => {
            // Create an array of nodes for each user
            const nodes = new vis.DataSet(userFollowers.map((followers, index) => ({
              id: index,
              label: `User ${index}`
            })));

            // Create an array of edges for each pair of users with common followers
            const edges = new vis.DataSet();
            userFollowers.forEach((followers1, index1) => {
              userFollowers.forEach((followers2, index2) => {
                if (followers1 && followers2 && index1 !== index2 && followers1.some(follower => followers2.includes(follower))) {
                  edges.add({ from: index1, to: index2 });
                }
              });
            });

            // Create a network
            const data = {
              nodes: nodes,
              edges: edges
            };
            console.log(data)
            const options = {};
            new vis.Network(networkContainer.current, data, options);
          });
        });
    };
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div ref={networkContainer} className="w-full max-w-2xl h-96 bg-white shadow-md rounded-md overflow-hidden"></div>
        <button onClick={handleButtonClick} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">Load Network</button>
      </div>
    );
}
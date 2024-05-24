import { useEffect, useRef } from 'react';
import { select, forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3';

export default function Followers() {

  const svgRef = useRef(null);

  const handleButtonClick = async () => {
    // Fetch userFollowers from userFollowers.json
    const response = await fetch('/userFollowers.json');
    const userFollowers = await response.json();

    // Create an array of nodes for each user
    const nodes = userFollowers.map((followers, index) => ({
      id: index,
      label: `User ${index}`
    }));

    // Create an array of links for each pair of users with common followers
    const links = [];
    userFollowers.forEach((followers1, index1) => {
      userFollowers.forEach((followers2, index2) => {
        if (followers1 && followers2 && index1 !== index2 && followers1.some(follower => followers2.includes(follower))) {
          links.push({ source: index1, target: index2 });
        }
      });
    });

    // Create a force simulation
    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id(d => d.id))
      .force('charge', forceManyBody())
      .force('center', forceCenter(400 / 2, 400 / 2));

    // Select the SVG element
    const svg = select(svgRef.current);

    // Create a line for each link
    const link = svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#999')
      .style('stroke-opacity', 0.6);

    // Create a circle and a label for each node
    const node = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .style('fill', '#69b3a2');

    const label = svg.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.label)
      .style('font-size', '12px');

    // Update the positions of the nodes and links at each tick of the simulation
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <svg ref={svgRef} width="800" height="600"></svg>
        <button onClick={handleButtonClick} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">Load Network</button>
      </div>
    );
}
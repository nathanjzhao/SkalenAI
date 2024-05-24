import { useEffect, useRef, useState } from 'react';
import { select, forceSimulation, forceLink, forceManyBody, forceCenter, zoom, scaleOrdinal, schemeCategory10, drag as nodeDrag} from 'd3';

function findKCliques(nodes, links, k) {
  // Create an adjacency list
  const adjacencyList = new Map();
  console.log(nodes);
  console.log(links);

  nodes.forEach(node => adjacencyList.set(node.id, []));
  links.forEach(link => {
    adjacencyList.get(link.source.id).push(link.target.id);
    adjacencyList.get(link.target.id).push(link.source.id);
  });

  // The Bron-Kerbosch algorithm
  function bronKerbosch(r, p, x) {
    if (p.length === 0 && x.length === 0 && r.length === k) {
      cliques.push([...r]);
    }
    while (p.length > 0) {
      const node = p.pop();
      bronKerbosch([...r, node], p.filter(n => adjacencyList.get(node).includes(n)), x.filter(n => adjacencyList.get(node).includes(n)));
      x.push(node);
    }
  }

  // Find all cliques
  const cliques = [];
  bronKerbosch([], nodes.map(node => node.id), []);
  return cliques;
}

const drag = (simulation) => {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return nodeDrag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

export default function Followers() {

  const svgRef = useRef(null);
  const [reload, setReload] = useState(false);

  const N = 50;
  const H = 600;
  const W = 800;
  const threshold = 5;
  const k = 5;

  const handleButtonClick = async () => {
    setReload(!reload);
    
    // Fetch userFollowers from userFollowers.json
    const response = await fetch('/userFollowers.json');
    const userFollowers = await response.json();

    // Create an array of nodes for each user
    const nodes = userFollowers.slice(0,N).map((followers, index) => ({
      id: index,
      label: `User ${index}`
    }));

    // Create an array of links for each pair of users with common followers
    const links = [];
    userFollowers.slice(0,N).forEach((followers1, index1) => {
      userFollowers.slice(0,N).forEach((followers2, index2) => {
        if (followers1 && followers2 && index1 !== index2) {
          // Calculate the intersection of the followers arrays
          const sharedFollowers = followers1.filter(follower => followers2.includes(follower));
          // Only create an edge if the number of shared followers is above the threshold
          if (sharedFollowers.length >= threshold) {
            links.push({ source: index1, target: index2 });
          }
        }
      });
    });

    const chargeStrength = -Math.min(links.length, 200);

    // Create a force simulation
    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id(d => d.id))
      .force('charge', forceManyBody().strength(chargeStrength))
      .force('center', forceCenter(W / 2, H / 2));

    // Select the SVG element
    const svg = select(svgRef.current);

    // Create a line for each link
    const link = svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#999')
      .style('stroke-opacity', 0.6);


    // Find the k-cliques
    const kCliques = findKCliques(nodes, links, k);

    // Create a color scale
    const colorScale = scaleOrdinal(schemeCategory10);

    // Assign a color to each node based on its k-clique
    nodes.forEach(node => {
      const cliqueIndex = kCliques.findIndex(clique => clique.includes(node.id));
      node.color = colorScale(cliqueIndex);
    });

    // Create the nodes
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
        .attr('r', 5)
        .attr('fill', d => d.color) // Use the color assigned to the node
        .call(drag(simulation));

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

  // useEffect(() => {
  //   // Select the SVG element
  //   const svg = select(svgRef.current);
  
  //   // Create a zoom behavior
  //   const zoomBehavior = zoom()
  //     .scaleExtent([0.5, 5]) // The scale extent restricts the amount of zooming (optional)
  //     .on('zoom', (event) => {
  //       // On each zoom event, adjust the transform property of the SVG element
  //       svg.attr('transform', event.transform);
  //     });
  
  //   // Call the zoom behavior on the SVG element
  //   svg.call(zoomBehavior);
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
    <svg ref={svgRef} width={W} height={H} key={reload}></svg>
      <button onClick={handleButtonClick} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">Load Network</button>
    </div>
  );
}
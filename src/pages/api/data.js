// pages/api/data.js
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default async function handler(req, res) {
  // Fetch and parse CSV file
  const csvFile = fs.readFileSync(path.resolve('./public/Maui.csv'), 'utf-8');
  const csvData = Papa.parse(csvFile, { header: true, dynamicTyping: true }).data;

  // Fetch and parse text file
  const textFile = fs.readFileSync(path.resolve('./public/fol.txt'), 'utf-8');
  const lines = textFile.split('\n');
  // const followerList = JSON.parse(lines[1]).data.user.timeline_response.timeline.instructions[3].entries;
  // const followerName = followerList[0].content.content.userResult.result.legacy.screen_name;
  
  const userFollowers = lines.map((line, index) => {
    try {
      const data = JSON.parse(line);
      return data.data.user.timeline_response.timeline.instructions[3].entries.map((entry, entryIndex) => {
        try {
          return entry.content.content.userResult.result.legacy.screen_name;
        } catch (error) {
          console.error(`Error parsing entry at index: ${entryIndex} in line: ${index}`);
          // console.error(error);
        }
      });
    } catch (error) {
      console.error(`Error parsing line at index: ${index}`);
      // console.error(error);
    }
  });

  // Convert the userFollowers data to a JSON string
  const json = JSON.stringify(userFollowers, null, 2);
  
  // Define the path to the JSON file in the public directory
  const filePath = path.join(process.cwd(), 'public', 'userFollowers.json');
  
  // Write the JSON string to the file
  fs.writeFileSync(filePath, json);

  // Send response
  res.status(200).json({ csvData });
}
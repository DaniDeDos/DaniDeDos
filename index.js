import axios from "axios";
import fs from 'fs/promises';
import { execSync } from 'child_process';
import moment from 'moment';

import { updateBotStatus } from './updateBotStatus.js';
import { updateLastConnection } from './updateLastConnection.js';

async function main() {
 // Actualiza README.md con la última fecha de actividad
 await updateLastConnection("DaniDeDos");
 // Actualiza el estado del bot
 await updateBotStatus("Online");
 // Cuenta los commits por parte del día y actualiza README.md
 await countAndUpdateCommitsByPartOfDay("DaniDeDos");
}

async function getCommits(username) {
 const response = await axios.get(`https://api.github.com/users/${username}/events`);
 if (response.data && response.data.length > 0) {
   const commits = response.data.filter(event => event.type === 'PushEvent');
   return commits;
 } else {
   throw new Error("No events found for this user");
 }
}

function getPartOfDay(commit) {
 const date = new Date(commit.created_at);
 const hour = date.getUTCHours();

 if (hour >= 4 && hour < 12) {
   return 'morning';
 } else if (hour >= 12 && hour < 18) {
   return 'afternoon';
 } else if (hour >= 18 && hour < 20) {
   return 'evening';
 } else {
   return 'night';
 }
}

async function countCommitsByPartOfDay(username) {
 const commits = await getCommits(username);
 const counts = {
 morning: 0,
 afternoon: 0,
 evening: 0,
 night: 0
 };

 commits.forEach(commit => {
 const partOfDay = getPartOfDay(commit);
 counts[partOfDay]++;
 console.log(`Counting commit for ${partOfDay}: ${commit.id}`);
 });

 console.log(`Final counts: ${JSON.stringify(counts)}`);
 return counts;
}

async function countAndUpdateCommitsByPartOfDay(username) {
 const counts = await countCommitsByPartOfDay(username);

 // Leer el contenido de README.md
 let content = await fs.readFile("./README.md", { encoding: "utf-8" });

 // Identificar la sección de conteo de commits
 const regex = /total de commit mañana: (\d+)/;
 const match = content.match(regex);
 if (match) {
 // Reemplazar la sección de conteo de commits con los nuevos conteos
 const updatedContent = content.replace(regex, `total de commit mañana: ${counts.morning}`);
 await fs.writeFile("./README.md", updatedContent, { encoding: "utf-8" });
 } else {
 console.error("No se pudo encontrar la sección de conteo de commits");
 }
}


main();

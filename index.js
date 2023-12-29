import axios from "axios";
import fs from 'fs/promises';
import { execSync } from 'child_process';

import { updateBotStatus } from './updateBotStatus.js';
import { updateLastConnection } from './updateLastConnection.js';

async function main() {
 // Actualiza README.md con la última fecha de actividad
 await updateLastConnection("DaniDeDos");
 // Actualiza el estado del bot
 await updateBotStatus("Online");

updateReadme();
}

async function countCommits(after) {
 const output = execSync(`git rev-list --count HEAD --after="${after}"`).toString();
 return parseInt(output, 10);
}

async function calculatePercentages() {
 const now = new Date();
 const morning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
 const afternoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
 const evening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
 const night = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

 const totalCommits = await countCommits('1970-01-01');
 const morningCommits = await countCommits(morning.toISOString());
 const afternoonCommits = await countCommits(afternoon.toISOString());
 const eveningCommits = await countCommits(evening.toISOString());
 const nightCommits = await countCommits(night.toISOString());

 const morningPercentage = (morningCommits / totalCommits) * 100;
 const afternoonPercentage = (afternoonCommits / totalCommits) * 100;
 const eveningPercentage = (eveningCommits / totalCommits) * 100;
 const nightPercentage = (nightCommits / totalCommits) * 100;

 // ...
 console.log('Total commits:', totalCommits);
 console.log('Morning commits:', morningCommits);
 console.log('Afternoon commits:', afternoonCommits);
 console.log('Evening commits:', eveningCommits);
 console.log('Night commits:', nightCommits);
 // ...

 
 return { morningPercentage, afternoonPercentage, eveningPercentage, nightPercentage };
}

async function updateReadme() {
 const percentages = await calculatePercentages();

 let readmeContent = await fs.readFile('./README.md', 'utf8');
 readmeContent = readmeContent.replace(/Morning.*?(\d+\.\d+)%.*/, `Morning: ${percentages.morningPercentage.toFixed(2)}%`);
 readmeContent = readmeContent.replace(/Daytime.*?(\d+\.\d+)%.*/, `Daytime: ${percentages.afternoonPercentage.toFixed(2)}%`);
 readmeContent = readmeContent.replace(/Evening.*?(\d+\.\d+)%.*/, `Evening: ${percentages.eveningPercentage.toFixed(2)}%`);
 readmeContent = readmeContent.replace(/Night.*?(\d+\.\d+)%.*/, `Night: ${percentages.nightPercentage.toFixed(2)}%`);


 // ...
 console.log('Old README content:', readmeContent);
 readmeContent = readmeContent.replace(/Morning.*?(\d+\.\d+)%.*/, `Morning: ${percentages.morningPercentage.toFixed(2)}%`);
 readmeContent = readmeContent.replace(/Daytime.*?(\d+\.\d+)%.*/, `Daytime: ${percentages.afternoonPercentage.toFixed(2)}%`);
 readmeContent = readmeContent.replace(/Evening.*?(\d+\.\d+)%.*/, `Evening: ${percentages.eveningPercentage.toFixed(2)}%`);
 readmeContent = readmeContent.replace(/Night.*?(\d+\.\d+)%.*/, `Night: ${percentages.nightPercentage.toFixed(2)}%`);
 console.log('New README content:', readmeContent);
 // ...
 
 await fs.writeFile('./README.md', readmeContent, 'utf8');
}




main();

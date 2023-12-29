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
}

async function getCommits() {
 const result = execSync('git log --pretty="%ai %H"').toString();
 const lines = result.split('\n');
 const commits = lines.map(line => {
   const parts = line.split(' ');
   const date = new Date(parts[0]);
   const hash = parts[1];
   return {date, hash};
 });
 return commits;
}

function categorizeCommits(commits) {
 const categories = {
   morning: [],
   afternoon: [],
   evening: [],
   night: []
 };
 for (const commit of commits) {
   const hour = commit.date.getHours();
   if (hour >= 4 && hour < 12) {
     categories.morning.push(commit);
   } else if (hour >= 12 && hour < 17) {
     categories.afternoon.push(commit);
   } else if (hour >= 17 && hour < 21) {
     categories.evening.push(commit);
   } else {
     categories.night.push(commit);
   }
 }
 return categories;
}

async function printCommitCounts() {
 const commits = await getCommits();
 const categories = categorizeCommits(commits);
 console.log(`Morning commits: ${categories.morning.length}`);
 console.log(`Afternoon commits: ${categories.afternoon.length}`);
 console.log(`Evening commits: ${categories.evening.length}`);
 console.log(`Night commits: ${categories.night.length}`);
}

main();

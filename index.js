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

async function getCommits(username) {
 const response = await axios.get(`https://api.github.com/users/${username}/events`);
 if (response.data && response.data.length > 0) {
   const commits = response.data.filter(event => event.type === 'PushEvent');
   return commits;
 } else {
   throw new Error("No events found for this user");
 }
}

function calculateCommitsPerPart(commits) {
 const commitsPerPart = Array(24).fill(0);
 commits.forEach(commit => {
   const date = new Date(commit.created_at);
   const hour = date.getUTCHours();
   commitsPerPart[hour]++;
 });
 return commitsPerPart;
}


main();

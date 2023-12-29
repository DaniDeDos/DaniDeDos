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

function getPartOfDay(commit) {
 const date = new Date(commit.created_at);
 const hour = date.getUTCHours();

 if (hour >= 4 && hour < 12) {
   return 'manana';
 } else if (hour >= 12 && hour < 18) {
   return 'tarde';
 } else if (hour >= 18 && hour < 20) {
   return 'noche';
 } else {
   return 'madrugada';
 }
}
async function countCommitsByPartOfDay(username) {
 const commits = await getCommits(username);
 const counts = {
   manana: 0,
   tarde: 0,
   noche: 0,
   madrugada: 0
 };

 commits.forEach(commit => {
   const partOfDay = getPartOfDay(commit);
   counts[partOfDay]++;
 });

 console.log(counts);
}

main();

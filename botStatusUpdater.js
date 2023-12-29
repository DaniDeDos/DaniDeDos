// archivo botStatusUpdater.js

import axios from "axios";
import fs from 'fs/promises';

async function isBotActive(username) {
 const response = await axios.get(`https://api.github.com/users/${username}/events`);
 let botActive = 'Offline';
 if (response.data && response.data.length > 0) {
   botActive = 'Online';
 }
 // Actualizar el estado del bot en el archivo status.json
 await fs.writeFile("./status.json", JSON.stringify({ botStatus: botActive }), { encoding: "utf-8" });
}

async function setBotActiveState(state) {
 const botStatus = JSON.parse(await fs.readFile('./status.json', 'utf8'));
 botStatus.botStatus = state;
 await fs.writeFile('./status.json', JSON.stringify(botStatus), 'utf8');
}

export { isBotActive, setBotActiveState };

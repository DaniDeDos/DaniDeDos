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

export { isBotActive };

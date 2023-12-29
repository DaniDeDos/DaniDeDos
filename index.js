import axios from "axios";
import fs from 'fs/promises';
import { updateLastConnection } from './updateLastConnection.js';


async function updateBotStatus(status) {
 const data = { botStatus: status };
 await fs.writeFile('./status.json', JSON.stringify(data));
}

async function main() {
 // Actualiza README.md con la última fecha de actividad
 await updateLastConnection("DaniDeDos");
 // Actualiza el estado del bot
 await updateBotStatus("Online");
}

main();

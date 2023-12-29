import axios from "axios";
import fs from 'fs/promises';
import { updateLastConnection } from './updateLastConnection.js';

async function main() {
 // Actualiza README.md con la última fecha de actividad
 await updateLastConnection("DaniDeDos");
}

main();

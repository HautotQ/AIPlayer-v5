import { world, BlockLocation, MinecraftBlockTypes, system } from "@minecraft/server";
import { genererIAAutourDuJoueur } from "../starter_pack.js";
import { findBlockAround } from "./find_blocks.js";

function sortCommand(ev) {
  const message = ev.message;
  const player = ev.sender;

  switch (message) {
    case "/start":
      const entityType = "tabarcraft:ai_agent"; // Remplace par le bon ID

      genererIAAutourDuJoueur(player, entityType);

      player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"[IA] Humanoïde générée près de ${player.name} !"}]}`);
      break;

    case "/scan iron":
      findBlockAround(player, "minecraft:iron_ore", 1000, 20, (location) => {
        player.runCommandAsync(`say Fer trouvé en ${location.x}, ${location.y}, ${location.z}`);
      });
      break;

    default:
      // Tu peux ajouter un message ou ignorer
      break;
  }
}

// Utilisation : écoute les commandes dans le chat
world.beforeEvents.chatSend.subscribe(ev => {
  ev.cancel = true; // empêche l'envoi visible du message
  sortCommand(ev);
});

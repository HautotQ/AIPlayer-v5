import { world, BlockLocation, MinecraftBlockTypes, system } from "@minecraft/server";
import { genererIAAutourDuJoueur } from "./starter_pack.js";

function sortCommand(command) {
  switch (ev.message) {
  case "/start":
      world.events.playerJoin.subscribe(event => {
        const player = event.player;
        const entityType = "tabarcraft:ai_agent"; // Remplace par le type réel de ton entité

        const ia = genererIAAutourDuJoueur(player, entityType);

        player.runCommand(`tellraw @a {"rawtext":[{"text":"[IA] Humanoïde générée près de ${player.name} !"}]}`);
      });
    break;
  case "/scan":
    // lancer la fonction de scan
    break;
  }
}

import { world, system } from "@minecraft/server";
import { genererIAAutourDuJoueur } from "./starter_pack.js";

// Événement à déclencher quand un joueur se connecte
world.events.playerJoin.subscribe(event => {
    const player = event.player;
    const entityType = "tabarcraft:ai_agent"; // Remplace par le type réel de ton entité

    const ia = genererIAAutourDuJoueur(player, entityType);

    player.runCommand(`tellraw @a {"rawtext":[{"text":"[IA] Humanoïde générée près de ${player.name} !"}]}`);
});

world.beforeEvents.chatSend.subscribe(ev => {
  const player = ev.sender;

  if (ev.message === "/scan_gold") {
    ev.cancel = true;

    findBlockAround(player, "minecraft:gold_ore", 1000, 20, (location) => {
      player.runCommandAsync(`say Bloc d'or trouvé en ${location.x}, ${location.y}, ${location.z}`);
    });
  }
});

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const dimension = player.dimension;
    const entities = dimension.getEntities({ type: "tabarcraft:ai_agent" });

    for (const entity of entities) {
      const targetPos = player.location;
      const entityPos = entity.location;

      const dx = targetPos.x - entityPos.x;
      const dz = targetPos.z - entityPos.z;

      // Tourner vers le joueur
      const yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
      entity.setRotation({ x: 0, y: yaw });

      // Se déplacer doucement vers le joueur
      entity.teleport(
        {
          x: entityPos.x + dx * 0.05,
          y: entityPos.y,
          z: entityPos.z + dz * 0.05
        },
        { facingLocation: targetPos }
      );
    }
  }
}, 10);

world.beforeEvents.chatSend.subscribe((event) => {
  const message = event.message.toLowerCase();

  if (
    message.includes("quentin") ||
    message.includes("Tabarcraft") ||
    message.includes("Quentin")
  ) {
    for (const entity of world.getDimension("overworld").getEntities({
      type: "tabarcraft:ai_agent"
    })) {
      entity.triggerEvent("tabarcraft:become_hostile");

      // Message rouge via tellraw
      world.getDimension("overworld").runCommandAsync(`tellraw @a {"rawtext":[{"text":"§cTU N'AURAIS JAMAIS, AU GRAND JAMAIS DÛ PRONONCER CE MOT !!!!! TU VAS LE PAYER CHER !"}]}`);
    }
  }
});

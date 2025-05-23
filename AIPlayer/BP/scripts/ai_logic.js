import { world, system } from "@minecraft/server";

let playerId = null;
let aiEntity = null;

const AI_TYPE = "minecraft:wolf"; // Tu peux remplacer par un mob personnalisé si tu en as créé un.

function distance(a, b) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) +
    Math.pow(a.y - b.y, 2) +
    Math.pow(a.z - b.z, 2)
  );
}

function getNearestHostileEntity(origin, entities) {
  let closest = null;
  let minDist = Infinity;
  for (const entity of entities) {
    if (entity.type.startsWith("minecraft:") &&
        (entity.type.includes("zombie") || entity.type.includes("skeleton") || entity.type.includes("creeper"))) {
      const dist = distance(origin, entity.location);
      if (dist < minDist) {
        minDist = dist;
        closest = entity;
      }
    }
  }
  return closest;
}

function followAndProtectAI() {
  if (!playerId || !aiEntity) return;

  const player = server.level.getEntity(playerId);
  if (!player || !aiEntity.isValid()) return;

  const playerPos = player.location;
  const aiPos = aiEntity.location;

  // Suit le joueur
  if (distance(playerPos, aiPos) > 4) {
    aiEntity.runCommand(`tp @s ${playerPos.x + 1} ${playerPos.y} ${playerPos.z + 1}`);
  }

  // Défend contre les mobs hostiles
  const nearbyEntities = aiEntity.dimension.getEntities();
  const target = getNearestHostileEntity(playerPos, nearbyEntities);

  if (target) {
    aiEntity.runCommand(`attack @e[type=${target.type},r=10]`);
  }
}

server.system.runInterval(() => {
  followAndProtectAI();
}, 20); // toutes les 1 seconde

server.events.playerJoin.subscribe((event) => {
  const player = event.player;
  playerId = player.id;

  // Fait apparaître l’IA à côté du joueur
  const spawnPos = {
    x: player.location.x + 2,
    y: player.location.y,
    z: player.location.z + 2,
  };

  aiEntity = player.dimension.spawnEntity(AI_TYPE, spawnPos);
  if (aiEntity) {
    aiEntity.nameTag = "Compagnon IA";
    aiEntity.runCommand("tag @s add ai_guardian");
  }
});

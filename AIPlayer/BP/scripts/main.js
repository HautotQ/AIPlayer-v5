import { world, system, EntityTypes, MinecraftEntityTypes } from "@minecraft/server";

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const dimension = player.dimension;
    const entities = dimension.getEntities({ type: "minecraft:ai_agent" });

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

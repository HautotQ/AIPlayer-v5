import { world, BlockLocation, MinecraftBlockTypes, system } from "@minecraft/server";

/**
 * Recherche un bloc spécifique dans un rayon sphérique autour d'une entité.
 * @param {Entity} entity - L'entité qui effectue la recherche.
 * @param {string} blockTypeId - L'identifiant du bloc à chercher, ex: "minecraft:gold_ore".
 * @param {number} radius - Rayon maximal de recherche (ex: 1000).
 * @param {number} step - Espacement entre les points analysés (plus le step est grand, plus c'est rapide mais moins précis).
 * @param {(blockLocation: BlockLocation) => void} onFound - Fonction appelée quand le bloc est trouvé.
 */
function findBlockAround(entity, blockTypeId, radius = 1000, step = 10, onFound) {
  const center = entity.location;

  let x = -radius;

  const scan = () => {
    if (x > radius) return;

    for (let y = -radius; y <= radius; y += step) {
      for (let z = -radius; z <= radius; z += step) {
        const dx = x, dy = y, dz = z;
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (distance > radius) continue;

        const blockLoc = {
          x: Math.floor(center.x + dx),
          y: Math.floor(center.y + dy),
          z: Math.floor(center.z + dz)
        };

        try {
          const block = entity.dimension.getBlock(blockLoc);
          if (block && block.typeId === blockTypeId) {
            onFound(new BlockLocation(blockLoc.x, blockLoc.y, blockLoc.z));
            return;
          }
        } catch (e) {
          // ignorer les erreurs sur les positions invalides
        }
      }
    }

    x += step;
    system.run(scan); // planifie la suite pour ne pas bloquer le thread principal
  };

  scan();
}

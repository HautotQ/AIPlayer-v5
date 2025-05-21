import { world, Vector } from "@minecraft/server";

/**
 * Génère l'entité humanoïde dans un rayon de 5 blocs autour du joueur.
 * @param {Player} player - Le joueur connecté
 * @param {string} entityType - Le type de l'entité humanoïde à générer (ex: "namespace:humanoide")
 * @returns {Entity} L'entité générée
 */
function genererIAAutourDuJoueur(player, entityType) {
    const positionJoueur = player.location;

    // Générer une position aléatoire dans un rayon de 5 blocs autour du joueur (sur le même niveau Y)
    const randomOffsetX = Math.floor(Math.random() * 11) - 5; // -5 à +5
    const randomOffsetZ = Math.floor(Math.random() * 11) - 5; // -5 à +5
    const spawnPosition = new Vector(
        positionJoueur.x + randomOffsetX,
        positionJoueur.y,
        positionJoueur.z + randomOffsetZ
    );

    // Faire apparaître l'entité humanoïde dans la dimension "overworld"
    const dimension = world.getDimension("overworld");
    const entity = dimension.spawnEntity(entityType, spawnPosition);

    return entity;
}

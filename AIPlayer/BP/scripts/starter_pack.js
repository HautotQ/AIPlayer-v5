import { world, Vector } from "@minecraft/server";

/**
 * Génère l'entité humanoïde dans un rayon de 5 blocs autour du joueur.
 * @param {Player} player - Le joueur connecté
 * @param {string} entityType - Le type de l'entité humanoïde à générer (ex: "namespace:humanoide")
 * @returns {Entity} L'entité générée
 */
export function genererIAAutourDuJoueur(player, entityType) {
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

/**
 * Déplace une entité vers une position cible (sans pathfinding).
 * @param {Entity} entity - L'entité à déplacer
 * @param {{x: number, y: number, z: number}} cible - La position cible
 * @param {number} vitesse - Vitesse de déplacement (par défaut : 0.1)
 */
function deplacerEntiteVersPosition(entity, cible, vitesse = 0.1) {
    const positionActuelle = entity.location;

    const dx = cible.x - positionActuelle.x;
    const dz = cible.z - positionActuelle.z;

    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < 0.1) return; // Trop proche pour bouger

    const directionX = dx / distance;
    const directionZ = dz / distance;

    const nouvellePosition = {
        x: positionActuelle.x + directionX * vitesse,
        y: positionActuelle.y,
        z: positionActuelle.z + directionZ * vitesse
    };

    const yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
    entity.setRotation({ x: 0, y: yaw });

    entity.teleport(nouvellePosition, {
        facingLocation: cible
    });
}

/**
 * Fait sauter une entité verticalement.
 * @param {Entity} entity - L'entité à faire sauter
 * @param {number} puissance - La puissance du saut (défaut : 0.5)
 */
function sauterEntite(entity, puissance = 0.5) {
    const velocity = entity.getVelocity();
    entity.applyImpulse({ x: velocity.x, y: puissance, z: velocity.z });
}

/**
 * Fait sneaker une entité (nécessite un event prédéfini dans l'addon).
 * @param {Entity} entity - L'entité qui doit sneaker
 */
function sneakEntite(entity) {
    // Déclencher un comportement sneak prédéfini dans l'addon
    entity.triggerEvent("tabarcraft:sneak");
}

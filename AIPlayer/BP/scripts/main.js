import { world, system } from "@minecraft/server";
import { genererIAAutourDuJoueur } from "./starter_pack.js";
import { findBlockAround } from "./FindOres/find_blocks.js";

// 📦 URL de ton modèle IA
const IA_URL = "https://TabarcraftOfficiel--AIPlayer_v5.hf.space/predict";

// 🔁 Fonction appelée pour chaque joueur connecté
world.afterEvents.playerJoin.subscribe(event => {
    const player = event.player;
    const entityType = "tabarcraft:ai_agent";

    genererIAAutourDuJoueur(player, entityType);

    player.sendMessage(`[IA] Humanoïde générée près de ${player.name} !`);

    // Lancer l’analyse IA après 5 secondes
    system.runTimeout(() => {
        lancerAnalyseIA(player);
    }, 100);
});

// 🎯 Récupère des données du joueur (position, santé, etc.)
function getDonneesDuJoueur(player) {
    const pos = player.location;
    const health = player.getComponent("health")?.currentValue ?? 0;

    return [
        pos.x / 100,  // normalisation
        pos.y / 100,
        pos.z / 100,
        health / 20   // santé entre 0 et 1
    ];
}

// 🧠 Appelle l’IA avec les données du joueur
function lancerAnalyseIA(player) {
    const donnees = getDonneesDuJoueur(player);

    fetch(IA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: donnees })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.reponse) {
            player.sendMessage("[IA] Aucune réponse reçue.");
            return;
        }

        const action = data.reponse[0];
        interpreterReponseIA(player, action);
    })
    .catch(error => {
        player.sendMessage(`[IA] Erreur de communication : ${error}`);
    });
}

// ⚙️ Traduit la réponse IA en action Minecraft
function interpreterReponseIA(player, action) {
    const pos = player.location;
    const dim = player.dimension;

    switch (action) {
        case 0:
            dim.runCommandAsync(`tp @e[type=zombie,r=10] ${pos.x + 10} ${pos.y} ${pos.z + 10}`);
            player.sendMessage("[IA] Zombie éloigné !");
            break;
        case 1:
            dim.runCommandAsync(`tp @e[type=zombie,limit=1] ${pos.x} ${pos.y} ${pos.z}`);
            player.sendMessage("[IA] Zombie invoqué proche !");
            break;
        case 2:
            dim.runCommandAsync(`summon lightning_bolt ${pos.x} ${pos.y} ${pos.z}`);
            player.sendMessage("[IA] ⚡ Foudre invoquée !");
            break;
        default:
            player.sendMessage("[IA] Action inconnue : " + action);
    }
}

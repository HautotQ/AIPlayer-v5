import { world, system } from "@minecraft/server";

function observerEntite(entite) {
    const pos = entite.location;
    return [
        pos.x / 100,
        pos.y / 100,
        pos.z / 100
    ];
}

function agir(entite, action) {
    const pos = entite.location;
    switch (action) {
        case 0:
            entite.runCommandAsync(`tp @s ${pos.x + 1} ${pos.y} ${pos.z}`);
            break;
        case 1:
            entite.runCommandAsync(`say Je regarde autour`);
            break;
        case 2:
            entite.runCommandAsync(`summon lightning_bolt ${pos.x} ${pos.y} ${pos.z}`);
            break;
    }
}

function boucleIA() {
    const agents = world.getAllEntities().filter(e => e.typeId === "tabarcraft:ai_agent");
    for (const agent of agents) {
        const input = observerEntite(agent);

        fetch("https://TabarcraftOfficiel--AIPlayer_v5.hf.space/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: input })
        })
        .then(res => res.json())
        .then(data => agir(agent, data.reponse[0]))
        .catch(err => console.warn("Erreur IA:", err));
    }
}

// Appeler toutes les 3 secondes
system.runInterval(boucleIA, 60);

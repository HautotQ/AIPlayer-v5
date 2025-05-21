import { world, system } from "@minecraft/server";

const url = "http://172.20.10.2:8080/ask"; // Ton API locale

// Fonction pour interroger l'IA avec un prompt donné
function fetchIAResponse(prompt, player) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  })
    .then((res) => res.json())
    .then((data) => {
      const response = data.response;

      // Affiche la réponse dans le chat du joueur
      player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e[IA] ${response}"}]}`);
    })
    .catch((err) => {
      player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§c[Erreur IA] ${err.message}"}]}`);
    });
}

// Surveille les messages du joueur
world.beforeEvents.chatSend.subscribe((event) => {
  const message = event.message;
  const player = event.sender;

  // Tu peux ici ajouter un filtre, comme commencer par "/ia"
  if (message.startsWith("/ia ")) {
    const prompt = message.slice(4).trim(); // Supprime "/ia "
    fetchIAResponse(prompt, player);

    event.cancel = true; // Empêche le message de s'afficher dans le tchat normal
  }
});

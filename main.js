let donnees = [1.0, 0.5, -0.2, 3.1]; // Exemple de données d'entrée

let url = "https://TabarcraftOfficiel--AIPlayer_v5.hf.space/predict"; // 🟢 L'URL de ton Space

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        input: donnees
    })
})
.then(response => response.json())
.then(data => {
    if (data.reponse) {
        console.log("Réponse IA :", data.reponse);
        // Exécuter des actions dans Minecraft selon la réponse
        // Par exemple : changer la direction d’un mob, ou déclencher une animation
    } else {
        console.error("Erreur retournée par l’IA :", data.erreur);
    }
})
.catch(error => {
    console.error("Échec de communication avec le serveur IA :", error);
});

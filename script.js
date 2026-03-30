const myUrl = "https://makerslab.em-lyon.com/dww/data/products.json";
 
const getData = async (doStuffs) => {
    try {
        const response = await fetch(myUrl);
        if (!response.ok) {
            throw new Error("Network response not ok :" + response.statusText);
        }
        const data = await response.json();
        doStuffs(data);
    } catch (error) {
        console.error("Problem occurred while getting your data" + error);
    }
};
 
getData((data) => {
    // Le programme commence ici
 
    // -----------------------------------------------
    // ÉTAPE 1 : Aplatir le JSON en un tableau unique
    // -----------------------------------------------
 
    /*
    =============================================
    [IA UTILISÉE - PARTIE COMPLEXE]
 
    PROMPT :
    "Mon JSON est organisé par marque : data.items contient
    des clés comme 'adidas', 'nike', etc., chacune étant
    un tableau de produits. J'ai besoin d'un seul tableau
    avec tous les produits mélangés pour les afficher dans
    ma grille. Comment faire ça en JavaScript ?"
 
    RÉPONSE IA :
    "Tu peux utiliser Object.values() pour récupérer tous
    les tableaux de produits (sans les clés de marque),
    puis .flat() pour les fusionner en un seul tableau.
    Exemple :
    const allProducts = Object.values(data.items).flat();
    Object.values(data.items) retourne un tableau de tableaux,
    et .flat() les 'aplatit' en un seul niveau."
    =============================================
    */
 
    const allProducts = Object.values(data.items).flat();
 
    // Mise à jour du compteur de résultats
    document.getElementById("results-count").textContent = allProducts.length + " result(s)";
 
 
    // -----------------------------------------------
    // ÉTAPE 2 : Générer une carte HTML par produit
    // -----------------------------------------------
 
    /*
    =============================================
    [IA UTILISÉE - PARTIE COMPLEXE]
 
    PROMPT :
    "J'ai mon tableau de produits. Je veux créer une carte
    HTML pour chaque produit et l'ajouter dans ma section.
    Comment créer des éléments HTML depuis JavaScript et
    y injecter les données du produit (nom, image, prix) ?"
 
    RÉPONSE IA :
    "Utilise document.createElement() pour créer l'élément,
    puis .innerHTML avec des template literals (backticks)
    pour y écrire le HTML avec les données du produit.
    Enfin, utilise .appendChild() pour ajouter la carte
    dans le conteneur.
    Exemple :
    const card = document.createElement('div');
    card.innerHTML = `<h3>${product.name}</h3>`;
    container.appendChild(card);"
    =============================================
    */
 
    const grid = document.getElementById("cards-grid");
 
    allProducts.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "card";
 
        card.innerHTML = `
            <img class="card-image" src="${product.image}" alt="${product.name}" />
            <div class="card-info">
                <h3 class="card-name">${product.name}</h3>
                <p class="card-brand">${product.brand}</p>
                <p class="card-genre">${product.gender}</p>
                <button class="heart-btn" onclick="event.stopPropagation()">
                    <i data-lucide="heart"></i>
                </button>
            </div>
            <p class="card-price">${product.price.toFixed(2)} €</p>
        `;
 
        // Au clic, on redirige vers product.html en passant l'index du produit dans l'URL
        card.addEventListener("click", function () {
            window.location.href = "product.html?id=" + index;
        });
 
        grid.appendChild(card);
    });
 
    // Recrée les icônes Lucide pour les cartes nouvellement ajoutées
    lucide.createIcons();
});
 
 
// =============================================
// OUVERTURE / FERMETURE DES FILTRES
// =============================================
 
function toggleFilter(header) {
    const group = header.parentElement;
    const options = group.querySelector(".filter-options");
    const icon = header.querySelector("i");
 
    if (options) {
        if (options.style.display === "none" || options.style.display === "") {
            options.style.display = "flex";
            icon.setAttribute("data-lucide", "chevron-up");
        } else {
            options.style.display = "none";
            icon.setAttribute("data-lucide", "chevron-down");
        }
        lucide.createIcons();
    }
}
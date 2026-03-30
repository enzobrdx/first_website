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
    // ÉTAPE 1 : Récupérer l'identifiant du produit dans l'URL
    // -----------------------------------------------
 
    /*
    =============================================
    [IA UTILISÉE - PARTIE COMPLEXE]
 
    PROMPT :
    "Quand l'utilisateur clique sur une carte dans
    index.html, j'ouvre product.html?id=5 par exemple.
    Comment je fais pour lire ce paramètre 'id' dans
    l'URL depuis JavaScript dans product.html ?"
 
    RÉPONSE IA :
    "Utilise l'objet URLSearchParams combiné à
    window.location.search qui contient la partie
    '?id=5' de l'URL actuelle.
    Exemple :
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    params.get('id') retourne la valeur sous forme de
    chaîne de caractères. Il faut la convertir en nombre
    avec parseInt() si tu veux l'utiliser comme index."
    =============================================
    */
 
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
 
    // Si l'id n'est pas un nombre valide, on renvoie à l'accueil
    if (isNaN(productId)) {
        window.location.href = "index.html";
        return;
    }
 
 
    // -----------------------------------------------
    // ÉTAPE 2 : Retrouver le bon produit dans le JSON
    // -----------------------------------------------
 
    // On aplatit le JSON exactement comme dans script.js
    const allProducts = Object.values(data.items).flat();
 
    // Si l'id dépasse le nombre de produits, on renvoie à l'accueil
    if (productId < 0 || productId >= allProducts.length) {
        window.location.href = "index.html";
        return;
    }
 
    const product = allProducts[productId];
 
 
    // -----------------------------------------------
    // ÉTAPE 3 : Afficher les infos du produit dans la page
    // -----------------------------------------------
 
    // Mise à jour du titre de l'onglet navigateur
    document.title = "Shoes Gallery – " + product.name;
 
    // Remplissage des éléments HTML avec les données du produit
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-brand").textContent = product.brand;
    document.getElementById("product-gender").textContent = product.gender;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent = product.price.toFixed(2) + " €";
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-image").alt = product.name;
 
 
    // -----------------------------------------------
    // ÉTAPE 4 : Générer les boutons de taille
    // -----------------------------------------------
 
    /*
    =============================================
    [IA UTILISÉE - PARTIE COMPLEXE]
 
    PROMPT :
    "Dans mon JSON, les tailles sont dans un tableau
    'availability' avec des objets {size, quantity}.
    Je dois afficher un bouton par taille, grisé si
    quantity est 0. Comment parcourir ce tableau et
    créer les boutons avec le bon style selon la dispo ?"
 
    RÉPONSE IA :
    "Utilise forEach() pour parcourir availability.
    Pour chaque objet, teste item.quantity === 0 pour
    savoir si la taille est indisponible.
    Exemple :
    product.availability.forEach(function(item) {
        const btn = document.createElement('button');
        btn.textContent = item.size;
        if (item.quantity === 0) {
            btn.className = 'size-btn unavailable';
            btn.disabled = true;
        } else {
            btn.className = 'size-btn available';
        }
        container.appendChild(btn);
    });"
    =============================================
    */
 
    const sizeGrid = document.getElementById("size-grid");
 
    product.availability.forEach(function (item) {
        const btn = document.createElement("button");
        btn.textContent = item.size;
 
        if (item.quantity === 0) {
            btn.className = "size-btn unavailable";
            btn.disabled = true;
        } else {
            btn.className = "size-btn available";
 
            // Au clic, on marque ce bouton comme sélectionné
            btn.addEventListener("click", function () {
                // On retire la sélection de tous les boutons disponibles
                sizeGrid.querySelectorAll(".size-btn").forEach(function (b) {
                    if (!b.disabled) {
                        b.className = "size-btn available";
                    }
                });
                // On sélectionne celui cliqué
                this.className = "size-btn selected";
            });
        }
 
        sizeGrid.appendChild(btn);
    });
 
    // Recrée les icônes Lucide (notamment le cœur dans product.html)
    lucide.createIcons();
});
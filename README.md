# 📚 Application Books

Application mobile de gestion de bibliothèque personnelle développée avec React Native et Expo.

## 🌟 Fonctionnalités

### Gestion des Livres
- ✨ Affichage de la liste des livres avec leurs détails
- ➕ Ajout d'un nouveau livre
- ✏️ Modification des informations d'un livre
- 🗑️ Suppression d'un livre
- 🔍 Recherche de livres par titre ou auteur
- 🏷️ Filtrage par thème, statut de lecture et favoris
- ⭐ Notation des livres (0-5 étoiles)
- 🖼️ Support des couvertures de livres (upload d'images)

### Statuts et Notes
- 📖 Marquer un livre comme lu/non lu
- ❤️ Ajouter/retirer des favoris
- 📝 Ajouter des notes personnelles aux livres

### Interface Utilisateur
- 🌓 Thème clair/sombre avec persistance
- 📱 Interface responsive et intuitive
- ⚡ Navigation fluide entre les écrans
- 🔄 Synchronisation avec l'API backend

## 🛠️ Prérequis

- Node.js (v18 ou supérieur)
- npm, yarn ou pnpm
- Expo CLI
- Expo Go sur votre appareil mobile ou un émulateur

## 📲 Installation et Configuration

### 1. Configuration de l'API (dossier API-BOOKS)

```bash
cd API-BOOKS

# Installation des dépendances
npm install   # ou yarn install / pnpm install

# ⚠️ Important : Modifiez server.js pour permettre l'accès depuis le mobile
# Remplacez la dernière ligne par :
app.listen(PORT, "0.0.0.0", () =>
  console.log(\`✅ BookList API disponible sur http://[VOTRE_IP_LOCALE]:${PORT}\`)
)

# Démarrage du serveur
npm start    # ou yarn start / pnpm start
```

### 2. Configuration de l'Application Mobile (dossier Books)

```bash
cd Books

# Installation des dépendances
npm install   # ou yarn install / pnpm install

# Installation d'AsyncStorage (requis pour la persistance du thème)
expo install @react-native-async-storage/async-storage

# Configuration de l'API
# Modifiez config.js pour pointer vers votre API :
# API_URL: "http://[VOTRE_IP_LOCALE]:3000"

# Démarrage de l'application
npx expo start    # ou yarn start / pnpm start
```

## 📱 Pages et Fonctionnalités

### 📚 Page d'Accueil (Liste des Livres)
- **Navigation** : Point d'entrée de l'application
- **Affichage** : Liste scrollable des livres avec leurs couvertures
- **Filtrage et Tri** :
  - 🔍 Barre de recherche par titre ou auteur
  - 📑 Filtres par thème
  - ⭐ Filtre des favoris
  - 📖 Filtre des livres lus/non-lus
- **Actions Rapides** :
  - ➕ Bouton d'ajout d'un nouveau livre
  - ⚙️ Accès aux paramètres (thème)

### 📖 Page Détails du Livre
- **Informations** :
  - 🖼️ Couverture en grand format
  - 📝 Titre, auteur, éditeur, année
  - 🏷️ Thème du livre
  - ⭐ Note sur 5 étoiles (modifiable)
- **Actions** :
  - ❤️ Ajouter/Retirer des favoris
  - ✅ Marquer comme lu/non lu
  - 📝 Ajouter/voir les notes
  - ✏️ Modifier les informations
  - 🗑️ Supprimer le livre

### ➕ Modal Ajout/Modification de Livre
- **Champs de Saisie** :
  - 📝 Titre du livre
  - 👤 Auteur
  - 🏢 Éditeur
  - 📅 Année de publication
  - 🏷️ Thème
- **Options** :
  - 🖼️ Upload d'une couverture (depuis galerie ou caméra)
  - ⭐ Attribution d'une note
  - ❤️ Marquer comme favori
  - ✅ Marquer comme lu

### 📝 Section Notes
- **Affichage** : Liste chronologique des notes
- **Actions** :
  - ➕ Ajouter une nouvelle note
  - 🗑️ Supprimer une note existante
- **Format** : Texte enrichi avec date de création

### ⚙️ Page Paramètres
- **Thème** :
  - 🌞 Mode clair
  - 🌙 Mode sombre
  - 🔄 Switch pour basculer
  - 💾 Sauvegarde automatique du choix

## 💡 Guide d'Utilisation

1. Scannez le QR code avec Expo Go (Android) ou l'app Camera (iOS)
2. La page d'accueil affiche la liste des livres
3. Pour ajouter un livre :
   - Appuyez sur le bouton ➕
   - Remplissez les informations requises
   - Optionnellement, ajoutez une couverture
   - Validez pour sauvegarder
4. Pour gérer un livre existant :
   - Appuyez sur sa carte pour voir les détails
   - Utilisez les boutons d'action pour :
     - ❤️ Mettre en favori
     - ✅ Marquer comme lu
     - ⭐ Noter le livre
     - ✏️ Modifier les informations
     - 🗑️ Supprimer
5. Pour changer le thème :
   - Appuyez sur l'icône ⚙️
   - Utilisez le switch pour basculer entre clair et sombre

## 🎨 Personnalisation du Thème

L'application supporte deux thèmes :
- 🌞 Thème clair (par défaut)
- 🌙 Thème sombre

Pour changer de thème :
1. Accédez aux paramètres (icône ⚙️)
2. Utilisez le switch pour basculer entre les thèmes
3. Le choix est automatiquement sauvegardé

## 🔧 Structure du Projet

```
Books/
├── app/                  # Pages principales et navigation
├── components/          # Composants réutilisables
├── context/            # Contexte React (ThemeContext)
├── model/              # Types et interfaces
├── services/           # Services API
└── styles/            # Thèmes et styles globaux
```

## 📦 API Endpoints

- GET /books : Liste tous les livres
- POST /books : Ajoute un nouveau livre
- PUT /books/:id : Met à jour un livre
- DELETE /books/:id : Supprime un livre
- GET /books/:id/notes : Récupère les notes d'un livre
- POST /books/:id/notes : Ajoute une note à un livre
- POST /upload : Upload d'image de couverture


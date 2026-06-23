# Port de Russell — Capitainerie

Application web de gestion des catways et réservations du port de plaisance de Russell.

## Stack technique

- **Backend** : Node.js + Express
- **Base de données** : MongoDB + Mongoose
- **Vues** : EJS
- **Auth** : Sessions (express-session + connect-mongo)
- **Sécurité** : bcryptjs pour le hashage des mots de passe

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd russell-port

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres MongoDB

# 4. Importer les données de départ
npm run seed

# 5. Lancer l'application
npm start
```

L'application est accessible sur `http://localhost:3000`

## Identifiants par défaut (après seed)

- **Email** : `admin@port-russell.fr`
- **Mot de passe** : `admin123`

## Import MongoDB alternatif (mongoimport)

```bash
mongoimport --jsonArray --db russell_port --collection catways --file data/catways.json
mongoimport --jsonArray --db russell_port --collection reservations --file data/reservations.json
```

## Routes de l'application

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | / | Page d'accueil / connexion |
| POST | /login | Connexion |
| GET | /logout | Déconnexion |

### Catways (🔒 auth requise)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /catways | Liste des catways |
| GET | /catways/:id | Détail d'un catway |
| POST | /catways | Créer un catway |
| PUT | /catways/:id | Modifier l'état |
| DELETE | /catways/:id | Supprimer |

### Réservations (🔒 auth requise)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /catways/:id/reservations | Liste |
| GET | /catway/:id/reservations/:idReservation | Détail |
| POST | /catways/:id/reservations | Créer |
| PUT | /catways/:id/reservations/:idReservation | Modifier |
| DELETE | /catway/:id/reservations/:idReservation | Supprimer |

### Utilisateurs (🔒 auth requise)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /users/ | Liste |
| GET | /users/:email | Détail |
| POST | /users/ | Créer |
| PUT | /users/:email | Modifier |
| DELETE | /users/:email | Supprimer |

## Tableau de bord

- Accessible à `/dashboard` après connexion
- Affiche les réservations actives en cours
- Accès rapide aux sections catways, réservations, utilisateurs

## Documentation API

Accessible à `/api-docs`

## Déploiement

Variables d'environnement à configurer sur votre hébergeur :
- `MONGO_URI` : URI de connexion MongoDB Atlas (ex: `mongodb+srv://user:pass@cluster.mongodb.net/russell_port`)
- `SESSION_SECRET` : Clé secrète aléatoire longue
- `PORT` : Port d'écoute (souvent défini automatiquement par la plateforme)

Hébergeurs recommandés : **Render**, **Railway**, **Heroku**
Base de données : **MongoDB Atlas** (gratuit)
# russell
# russel
# russel

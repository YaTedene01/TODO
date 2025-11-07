# test_node_js

## Description
Ce projet est une API RESTful de gestion de tâches (todos) avec authentification, partage de tâches, gestion d'utilisateurs et historique des actions. Il utilise Node.js, Express, TypeScript et Prisma avec une base de données PostgreSql.

## Fonctionnalités principales
- Authentification JWT
- Gestion des utilisateurs (CRUD, upload d'image)
- Gestion des tâches (CRUD, partage, marquer comme complétée)
- Historique des actions
- Documentation Swagger

## Installation
1. Cloner le dépôt :
	 ```bash
	 git clone <repo-url>
	 cd test_node_js
	 ```
2. Installer les dépendances :
	 ```bash
	 npm install
	 ```
3. Configurer la base de données dans le fichier `.env` :
	 ```env
	 DATABASE_URL="mysql://user:password@localhost:3306/nom_de_la_db"
	 ```
4. Générer le client Prisma et migrer la base :
	 ```bash
	 npm run generate
	 npm run migrate
	 ```
5. Lancer le serveur :
	 ```bash
	 npm run dev
	 ```

## Structure du projet

```
├── src/
│   ├── index.ts                # Point d'entrée principal
│   ├── auth/                   # JWT et config
│   ├── config/                 # Config DB/env
│   ├── controllers/            # Logique métier (auth, user, todo, historique)
│   ├── middlewares/            # Auth, accès
│   ├── repositories/           # Accès aux données
│   ├── routes/                 # Définition des routes
│   ├── services/               # Services métier
│   ├── utils/                  # Utilitaires
│   ├── validators/             # Validation des schémas
├── prisma/
│   ├── schema.prisma           # Schéma de la base
│   ├── migrations/             # Migrations SQL
│   ├── seeds.js                # Seed de données
├── assets/                     # Images uploadées
├── package.json                # Dépendances et scripts
├── tsconfig.json               # Config TypeScript
```

## Principales routes

### Authentification
- `POST /auth/login` : Connexion
- `POST /auth/refresh-token` : Rafraîchir le token
- `POST /auth/logout` : Déconnexion

### Utilisateurs
- `GET /users` : Liste des utilisateurs
- `GET /users/:id` : Détail utilisateur
- `POST /users` : Création
- `PUT /users/:id` : Modification
- `DELETE /users/:id` : Suppression
- `POST /users/:id/upload-image` : Upload d'image de profil

### Todos
- `GET /todos` : Liste des tâches
- `GET /todos/:id` : Détail tâche
- `POST /todos` : Création
- `PUT /todos/:id` : Modification
- `DELETE /todos/:id` : Suppression
- `PATCH /todos/:id/complete` : Marquer comme complétée
- `POST /todos/:id/share` : Partager une tâche

### Historique
- `GET /historique` : Liste des actions
- `POST /historique` : Ajouter une action
- `PUT /historique/:id` : Modifier une action
- `DELETE /historique/:id` : Supprimer une action

### Documentation API
- Swagger disponible sur : `GET /api-docs`

## Schéma de la base de données (Prisma)

```prisma
model user {
	id        Int      @id @default(autoincrement())
	email     String   @unique
	password  String
	name      String?
	imageUrl  String?
	todos     todo[]
	historiques Historique[]
	role      Role   @default(USER)
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
	sharedTodos TodoShare[]
}

model todo {
	id        Int      @id @default(autoincrement())
	title     String
	completed Boolean  @default(false)
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
	userId    Int
	historiques Historique[]
	user      user     @relation(fields: [userId], references: [id], onDelete: Cascade)
	shares    TodoShare[]
}

model TodoShare {
	id        Int      @id @default(autoincrement())
	todo      todo     @relation(fields: [todoId], references: [id], onDelete: Cascade)
	todoId    Int
	user      user     @relation(fields: [userId], references: [id], onDelete: Cascade)
	userId    Int
	canEdit   Boolean  @default(false)
	canDelete Boolean  @default(false)
	createdAt DateTime @default(now())
}

model Historique {
	id        Int      @id @default(autoincrement())
	action    String
	userId    Int
	todoId    Int
	timestamp DateTime @default(now())
	user      user     @relation(fields: [userId], references: [id], onDelete: Cascade)
	todo      todo     @relation(fields: [todoId], references: [id], onDelete: Cascade)
}

enum Role {
	USER
	ADMIN
}
```

# TODO

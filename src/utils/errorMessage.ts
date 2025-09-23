
export const ErrorMessages = {
    // Auth
    AUTH_INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
    AUTH_REFRESH_TOKEN_INVALID: "Refresh token invalide",
    AUTH_MISSING_EMAIL: "L'email est obligatoire",
    AUTH_MISSING_PASSWORD: "Le mot de passe est obligatoire",
    AUTH_LOGOUT_SUCCESS: "Déconnexion réussie",

    // User
    USER_MISSING_NAME: "Le nom est obligatoire",
    USER_MISSING_ROLE: "Le rôle est obligatoire",
    USER_NOT_FOUND: "Utilisateur non trouvé",
    USER_IMAGE_REQUIRED: "Aucune image envoyée",
    USER_IMAGE_UPLOADED: "Image uploadée",

    // Todo
    TODO_MISSING_TITLE: "Le titre du todo est obligatoire",
    TODO_MISSING_COMPLETED: "L'état de complétion du todo est obligatoire",
    TODO_NOT_FOUND: "Todo non trouvé",
    TODO_USERID_REQUIRED: "userId requis",
    TODO_OWNER_ONLY_SHARE: "Seul le propriétaire peut partager",
    TODO_CREATED: "Todo créé avec succès",
    TODO_UPDATED: "Todo mis à jour",
    TODO_DELETED: "Todo supprimé",

    // Historique
    HISTO_MISSING_FIELDS: "Champs requis manquants",
    HISTO_NOT_FOUND: "Historique non trouvé",
    HISTO_CREATED: "Historique créé",
    HISTO_UPDATED: "Historique mis à jour",
    HISTO_DELETED: "Historique supprimé",

    // Génériques
    SERVER_ERROR: "Erreur interne du serveur",
    BAD_REQUEST: "Requête invalide",
    FORBIDDEN: "Vous n'avez pas les droits nécessaires",
    NOT_FOUND: "Ressource non trouvée",
    UNAUTHORIZED: "Non autorisé",
    INTERNAL_SERVER_ERROR: "Erreur interne du serveur",
};

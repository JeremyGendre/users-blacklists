export const getReadableAuthError = (error: any) => {
    const message = error ? error.message ?? null : null;
    if(!message) return 'Une erreur est survenue';
    else if(message.includes('wrong-password')) return 'Mauvais mot de passe';
    else if(message.includes('user-not-found')) return "L'utilisateur n'existe pas";
    else if(message.includes('too-many-requests')) return "Accès à ce compte temporairement bloqué, dû à de trop nombreuses tentatives. Réessayez plus tard.";
    return 'Une erreur est survenue';
};

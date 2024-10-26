exports.formatMillisecondsTimeToHour = (milliseconds) => {
    // Convertir les millisecondes en secondes
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const days = Math.floor(totalSeconds / 86400);

    // Construire la chaîne de résultat
    const parts = [];

    if (days > 0) {
        parts.push(`${days} jour${days > 1 ? 's' : ''}`);
    }
    if (hours > 0) {
        parts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
    }
    if (minutes > 0 || (days === 0 && hours === 0)) {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    }

    return parts.join(' et ');
}

exports.getRemainingTime = (timeInMilliSecond) => {
    const now = Date.now();
    const remainingTime = timeInMilliSecond - now;

    if (remainingTime > 0) {
        return this.formatMillisecondsTimeToHour(remainingTime);
    } else {
        return "0 minute"
    }
}

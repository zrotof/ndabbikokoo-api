const winston = require("winston");
require("winston-daily-rotate-file");

const { environment } = require("./dot-env");

const isDevelopment = environment === "development";

const logsDir = isDevelopment ? "logs" : "/home/dmfm5155/logs/mahol";

const customFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    // Append meta information (structured data) if present
    if (Object.keys(meta).length > 0) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`; // Pretty print JSON meta
    }

    return logMessage;
  }
);

const accessTransport = new winston.transports.DailyRotateFile({
    dirname: logsDir+"/access",
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compresse les logs anciens
    maxFiles: '14d',
    level: isDevelopment ? "debug" : "info", // Niveau de log adapté à l'environnement
  });
  
  const errorTransport = new winston.transports.DailyRotateFile({
    dirname: logsDir+"/errors",
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compresse les logs anciens
    maxFiles: '30d',
    level: 'error', // Only logs of level 'error' or higher
  });

// Configuration de la console (uniquement pour le développement ou complément en prod)
const consoleTransport = new winston.transports.Console({
  level: "debug", // Toujours afficher les logs de debug en dev
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Ajoute un timestamp
  ),
});

// Crée le logger
const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "info", // Niveau principal
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Ajoute un timestamp
    customFormat  ),
  transports: [
    accessTransport,
    errorTransport,
    ...(isDevelopment ? [consoleTransport] : []), // Affiche dans la console si en dev
  ],
});

module.exports = logger;

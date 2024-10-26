const {
  AccountNotValidatedError,
  AuthenticationError,
  AuthorizationError,
  CustomError,
  DatabaseError,
  InvalidCredentialsError,
  NotFoundError,
  ValidationError,
  TooManyAttemptsError,
} = require("../utils/errors");

module.exports = (err, req, res, next) => {
  let statusCode = 500;
  let message =
    "Une erreur inattendue est survenue, veuillez contacter le web master";

  switch (true) {
    case err.name === "SequelizeUniqueConstraintError":
      statusCode = 409;
      message = err.errors.map((err) => err.message).join(", ");
      break;

    case err.name === "SequelizeValidationError":
      statusCode = 409;
      message = err.errors.map((err) => err.message).join(", ");
      break;

    case err.name === "SequelizeDatabaseError":
      message = "Une erreur de base de données est survenue.";
      break;

    case err instanceof AccountNotValidatedError:
      statusCode = err.status; // Utiliser le statut de l'erreur personnalisée
      message = err.message;
      break;

    case err instanceof CustomError:
      statusCode = err.status || 500; // Utiliser le statut de l'erreur personnalisée
      message = err.message;
      break;

    case err instanceof InvalidCredentialsError:
      statusCode = err.status; // Utiliser le statut de l'erreur personnalisée
      message = err.message;
      break;

    case err instanceof NotFoundError:
      statusCode = err.status;
      message = err.message;
      break;

    case err instanceof TooManyAttemptsError:
      statusCode = err.status;
      message = err.message;
      break;

    default:
      break;
  }

  res.status(statusCode).json({
    status: "error",
    data: null,
    message: message,
  });
};

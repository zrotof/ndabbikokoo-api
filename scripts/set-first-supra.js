const crypto = require("crypto");
const { Op } = require("sequelize");
const { models, sequelize } = require("../models");
const { transporter } = require("../config/mail-transporter");
const { o2switch, supraAdminEmail } = require("../config/dot-env");
const {
  generateHashedPasswordAndSalt,
} = require("../helpers/password.helpers");
const {
  generateRegistrationNumber,
} = require("../utils/generate-registration-number");
const SubscriberStatusEnum = require("../enums/subscriber-status.enum");

const createSuperAdmin = async () => {
  const transaction = await sequelize.transaction();

  try {
    console.log("➡️ Sélection de l'adhérent avec l'email de Marie ...");


    const subscriber = await models.User.findOne(
      {
        where: {email: 'test@maholdiaspora.com'},
        attributes: ['id']
      },
      { transaction }
    );

    if(subscriber){
      console.log("✅ Marie a été retrouvée :", subscriber.id);
    }

    const randomPasswordSupra = crypto
      .randomBytes(7)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 7);

    // 🔹 Récupération des rôles
    const roles = await models.Role.findAll({
      attributes: ["id", "code"],
      where: { code: { [Op.in]: ["super_admin", "deputy"] } },
    },    
    {transaction}
  );

    if (!roles.length) throw new Error("❌ Aucun rôle trouvé !");

    const supraAdminRoleId = roles.find((role) => role.code === "super_admin")?.id;
    const deputyRoleId = roles.find((role) => role.code === "deputy")?.id;

    if (!supraAdminRoleId || !deputyRoleId) {
      throw new Error("❌ Les rôles Supra Admin ou Délégué sont manquants !");
    }

    const passHashSupra = generateHashedPasswordAndSalt(randomPasswordSupra);

    // 🔹 Création du Staff (Super Admin)
    const staff = await models.Staff.create(
      {
        subscriberId: subscriber.id,
        email: 'test@maholdiaspora.com',
        password: passHashSupra.hash,
        salt: passHashSupra.salt,
      },
      {
        returning: ["id"],
        transaction
      } 
    );

    console.log("✅ Staff créé avec succès :", staff.id);

    await staff.addRoles([supraAdminRoleId, deputyRoleId ], { transaction });

    console.log("✅ Rôle 'Supra Admin' et 'délégué' sont assignés au Staff");

    // 🔹 Envoi d'un e-mail avec les mots de passe
    await transporter.sendMail({
      from: o2switch.router,
      to: 'test@maholdiaspora.com',
      subject: "MAHÒL : Compte d'administration",
      text: `Votre mot de passe provisoire pour vous connecter à la partie admin est : ${randomPasswordSupra}`,
    });

    console.log("📧 E-mail de confirmation envoyé !");
    await transaction.commit();
  } catch (error) {
    console.error("❌ Erreur lors de la création du Super Admin :", error);
    await transaction.rollback();
    process.exit(1);
  } finally {
    transporter.close();
    process.exit(0);
  }
};

createSuperAdmin();

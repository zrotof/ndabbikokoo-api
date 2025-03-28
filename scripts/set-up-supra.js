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
    console.log("➡️ Création du Super Admin en cours...");

    const registrationNumber = generateRegistrationNumber(6);

    const subscriber = await models.Subscriber.create(
      {
        subscriberRegistrationNumber: registrationNumber,
        firstname: "Supra",
        lastname: "Admin",
        sex: "Homme",
        address: "123 Rue Exemple",
        postalCode: "75000",
        country: "France",
        town: "Paris",
        phoneNumber: "0123456789",
        phoneCode: "+33",
        areStatusInternalRegulationsAndMembershipAgreementAccepted: true,
        areRgpdConsentAccepted: true,
      },
      { transaction }
    );

    console.log("✅ Subscriber créé avec succès :", subscriber.id);

    const randomPasswordMember = crypto
      .randomBytes(7)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 7);
    const randomPasswordSupra = crypto
      .randomBytes(7)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 7);

    const passHashMember = generateHashedPasswordAndSalt(randomPasswordMember);
    const passHashSupra = generateHashedPasswordAndSalt(randomPasswordSupra);

    // 🔹 Création du User (Membre)
    const user = await models.User.create(
      {
        subscriberId: subscriber.id,
        email: supraAdminEmail,
        password: passHashMember.hash,
        canAuthenticate: true,
        isAccountValidated: true,
        isEmailConfirmed: true,
        salt: passHashMember.salt,
        status: SubscriberStatusEnum.ACTIF,
      },
      { transaction }
    );

    console.log("✅ User créé avec succès :", user.id);

    // 🔹 Récupération des rôles
    const roles = await models.Role.findAll({
      attributes: ["id", "code"],
      where: { code: { [Op.in]: ["super_admin", "admin", "member"] } },
      transaction,
    });

    if (!roles.length) throw new Error("❌ Aucun rôle trouvé !");

    const supraAdminRoleId = roles.find(
      (role) => role.code === "super_admin"
    )?.id;
    const adminRoleId = roles.find((role) => role.code === "admin")?.id;
    const memberRoleId = roles.find((role) => role.code === "member")?.id;

    if (!supraAdminRoleId || !adminRoleId || !memberRoleId) {
      throw new Error(
        "❌ Les rôles Supra Admin, Admin ou Member sont manquants !"
      );
    }

    await subscriber.addRoles([memberRoleId], { transaction });

    console.log("✅ Rôle membre assigné à l'adhérent");

    // 🔹 Création du Staff (Super Admin)
    const staff = await models.Staff.create(
      {
        subscriberId: subscriber.id,
        email: supraAdminEmail,
        password: passHashSupra.hash,
        salt: passHashSupra.salt,
      },
      {
        returning: ["id"],
        transaction
      } 
    );

    console.log("✅ Staff créé avec succès :", staff.id);

    // 🔹 Assigner un rôle Admin au Staff
    const staffRoleId = supraAdminRoleId; // On met "supra-admin" ici


    await staff.addRoles([staffRoleId], { transaction });

    console.log("✅ Rôle 'Supra Admin' assigné au Staff");

    // 🔹 Envoi d'un e-mail avec les mots de passe
    await transporter.sendMail({
      from: o2switch.router,
      to: supraAdminEmail,
      subject: "MAHÒL : Vos mots de passe",
      text: `Vos mots de passe provisoires sont : \n - Partie publique: ${randomPasswordMember} \n - Partie admin: ${randomPasswordSupra}`,
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

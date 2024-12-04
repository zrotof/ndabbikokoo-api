const crypto = require('crypto');
const { o2switch } = require('../config/dot-env')
const {models, sequelize} = require("../models");
const { generateHashedPasswordAndSalt } = require('../helpers/password.helpers');
const { generateToken } = require("../utils/jwt.utils");
const { transporter } = require('../config/mail-transporter')
const { supraAdminEmail } = require("../config/dot-env")
const { sendVerificationEmail } = require("../services/mail.services")

const createWebMaster = async () => {
  try{
    const transaction = await sequelize.transaction(); // Démarrer une transaction

    const users = await models.User.findAll({});
    if (!users || users.length > 0) {
      console.log(users ? "There are already users in DB" : "There is no user in DB");
      return;
    }

    const randomPassword = crypto.randomBytes(7).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 7);
  
    const hashParams = generateHashedPasswordAndSalt(randomPassword);

    const newUser = await models.User.create(
      {
        firstname: "Jean",
        lastname: "Tartanpion",
        email: supraAdminEmail,
        password: hashParams.hash,
        salt: hashParams.salt,
      },
      { transaction }
    );
    
    const roles = await models.Role.findAll({
      where: {
        name: "Admin",
      },
      transaction,
    });

    await newUser.setRoles(roles, { transaction });

    const expiresIn = "2h";
    const token = await generateToken(newUser.id, expiresIn);
    const name = newUser.getFullName();

    await sendVerificationEmail(name, supraAdminEmail, token);

    await transporter.sendMail(
      {
        from: o2switch.router,
        to: supraAdminEmail ,
        subject: "MAHÒL : Votre mot de passe provisoire est: ",
        text: randomPassword
      }
    )

    console.log("Tout est ok")
    await transaction.commit();

  }
  catch(e){
    console.log(e)

    await transaction.rollback();
  } finally {
    transporter.close(); // Close the mail transporter if required
    process.exit(0); // Exit the script
  }
}

createWebMaster();
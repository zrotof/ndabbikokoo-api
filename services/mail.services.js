const { transporter } = require("../config/mail-transporter");
const { o2switch } = require("../config/dot-env");

const { validAccountTemplate, initChangePasswordTemplate, succeedChangePasswordTemplate } = require("../templates/mails.templates");

exports.sendVerificationEmail = async (name, email, token) => {
  try {
    const subject = "PORTFOLIO : Activez votre compte";
    const message = await validAccountTemplate(name, token);

    await transporter.sendMail({
      from: o2switch.router,
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    throw error;
  }
}

exports.sendInitChangePasswordEmail = async (name, email, token) => {
  try {
    const subject = "PORTFOLIO : Changement de mot de passe";
    const message = await initChangePasswordTemplate(name, token);

    await transporter.sendMail({
      from: o2switch.router,
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    throw error;
  }
};

exports.sendSuccessPasswordChangedEmail = async (name, email)=> {
  try {
    const subject = "PORTFOLIO : Mot de passe modifié avec succès";
    const message = await succeedChangePasswordTemplate(name);

    await transporter.sendMail({
      from: o2switch.router,
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    throw error;
  }
}

const { transporter } = require("../config/mail-transporter");
const { o2switch } = require("../config/dot-env");
const fs = require('fs');
const path = require('path');

const { 
  accountValidationTemplate,
  emailVerificationTemplate, 
  suceedEmailVerificationTemplate,
  passwordInitialisationRequestTemplate, 
  succeedPasswordInitialisationTemplate,
  groupAssignmentMailTemplate,
  guestInvitationMailTemplate,
  groupValidationMailTemplate,
  idRequestTemplate,
  identicationWithAttachmentsMailTemplate,
  staffRequestMailTemplate,
  succeedStaffAccountCreationMailTemplate,
  succeedGroupAffectationMailTemplate
} = require("../templates/mails.templates");

class MailService {

  async sendAccountValidationMailResponse(mailObject) {
    try {
      const subject = "MAHÒL : Compte créé";
      const message = await accountValidationTemplate(mailObject.username);
  
      await transporter.sendMail({
        from: o2switch.router,
        to: mailObject.email,
        subject: subject,
        html: message,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendAccountVerificationMailResponse(name, email) {
    try {
      const subject = "MAHÒL : Félicitation votre compte est activée !";
      const message = await accountValidationTemplate(name);
  
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

  async sendEmailVerificationMailRequest(name, email, token) {
    try {
      const subject = "MAHÒL : Activez votre compte";
      const message = await emailVerificationTemplate(name, token);
        
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

  async sendPasswordInitilisationMailRequest(name, email, token) {
    try {
      const subject = "MAHÒL : Changement de mot de passe";
      const message = await passwordInitialisationRequestTemplate(name, token);
  
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

  async sendSucceedEmailVerificationMailResponse (name, email) {
    try {
      const subject = "MAHÒL : Votre email est bien vérifiée!";
      const message = await suceedEmailVerificationTemplate(name);
  
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

  async sendSuccessPasswordResetMailResponse (name, email) {
    try {
      const subject = "MAHÒL : Mot de passe modifié avec succès";
      const message = await succeedPasswordInitialisationTemplate(name);
  
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

  async sendGroupAssignmentMailResponse(mailObject){
    try {
      const subject = "MAHÒL : Affectation à un groupe";
        
      const message = await groupAssignmentMailTemplate(mailObject.subscriberName, mailObject.groupName);

      await transporter.sendMail({
        from: o2switch.router,
        to: mailObject.subscriberEmail,
        subject: subject,
        html: message,
      });
  
    } catch (error) {
      throw error
    }
  }

  async sendGuestInvitationMailRequest(mailObject) {
    try {
      
      const subject = `Vous êtes invité(e) à rejoindre le groupe ${mailObject.groupName} sur Mahol`
  
      const message = await guestInvitationMailTemplate(mailObject.firstname, mailObject.lastname, mailObject.email, mailObject.groupName, mailObject.representantName);
  
      await transporter.sendMail({
        from: o2switch.router,
        to: mailObject.email,
        subject: subject,
        html: message
      })
  
      return true;
    } catch (error) {
      throw error
    }
  }

  async sendGroupValidationMailResponse(mailObject) {
    try {
      const subject = `MAHÒL : Validation de votre groupe "${mailObject.groupName}"`;
  
      const message = await groupValidationMailTemplate(mailObject.groupCreatorName, mailObject.groupName);
  
      await transporter.sendMail({
        from: o2switch.router,
        to: mailObject.creatorEmail,
        subject: subject,
        html: message
      });
    } catch (error) {
      throw error;
    }
  }

  async sendEmailIdRequest(name, token, subscriberEmail) {
    try {
      const subject = `MAHÒL : Vérification de votre identité`;
  
      const message = await idRequestTemplate(name, token)

      await transporter.sendMail({
        from: o2switch.router,
        to: subscriberEmail,
        subject: subject,
        html: message
      });

    } catch (error) {
      throw error
    }
  }

  async sendEmailIdenticationWithAttachments(mailObject){
    try {
      const fullName = mailObject.lastname+ " "+mailObject.firstname;
      const subject = `Transmission pièce d'identification de ${fullName}`;

      const message = await identicationWithAttachmentsMailTemplate(fullName, mailObject.email, mailObject.subscriberRegistrationNumber, mailObject.identificationType)

      await transporter.sendMail({
        from: o2switch.router,
        to: o2switch.idReceiver,
        subject: subject,
        html: message,
        attachments: mailObject.files.map((file) => ({
          filename: file.originalname,
          content: file.buffer,          
          contentType: file.mimetype
        }))
      });

    } catch (error) {
      throw error
    }
  }

  async sendStaffRequestMail(mailObject){
    try {

      const subject = "MAHOL DIASPORA : Accès à votre compte administrateur";
      const message = await staffRequestMailTemplate(mailObject)

      await transporter.sendMail({
        from: o2switch.router,
        to: mailObject.emailPro,
        subject: subject,
        html: message
      });

    } catch (error) {
      throw error
    }
  }

  async sendSucceedStaffRegisteredMailResponse(mailObject){
    try {

      const subject = "MAHOL DIASPORA : compte administrateur créé";
      const message = await succeedStaffAccountCreationMailTemplate(mailObject.firstname)

      await transporter.sendMail({
        from: o2switch.router,
        to: mailObject.emailPro,
        subject: subject,
        html: message
      });

    } catch (error) {
      throw error
    }
  }

  async sendSucceedGroupAffectationMailResponse(mailObject){
    try {

      const subject = "MAHOL DIASPORA : Modification De Groupe ";
      const message = await succeedGroupAffectationMailTemplate(mailObject.firstname)

      await transporter.sendMail({
        from: o2switch.router,
        to: mailObject.emailPro,
        subject: subject,
        html: message
      });

    } catch (error) {
      throw error
    }
  }
}

module.exports = new MailService();

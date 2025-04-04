const { clientBaseUrl, clientAdminBaseUrl } = require("../config/dot-env");
const { o2switch } = require("../config/dot-env");

exports.accountValidationTemplate = async (name) => {
  return `
   <html>
     <head>
       <style>
         /* Your CSS styles go here */
          *{
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
          }
          body {
            background-color: #f2f2f2;
          }
         .container {
           width: 100%;
           margin: 0 auto;
           padding: 20px 20px;          
         }
         button{
             padding: 10px 25px;
             margin-bottom: 15px;
             background-color : #814b2b;
             border: none;
         }
         .token{
            display: block;
            text-decoration: none;
            font-size: 16px;
            color: #fff !important;
            font-weight: bold;
            background-color : #7fbbd7;
            padding: 10px 25px;
            margin-bottom: 20px;
            margin-top: 20px;
            width: fit-content
        }
       </style>
     </head>
     <body>
       <div class="container">
          <p>Cher(e) ${name},</p>
          <p>
            Vos informations ont bien été pris en compte et votre compte a été crée. 
          </p>
          <p>
            Vous pouvez vous connecter.
          </p>
          <a class="token" href="${clientBaseUrl}/se-connecter" target=blank> Se connecter </a>
       </div>
     </body>
   </html>
  `;
};

exports.passwordInitialisationRequestTemplate = async (name, token) => {
  return `
 <html>
   <head>
     <style>
       /* Your CSS styles go here */
        *{
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
       .container {
         width: 100%;
         margin: 0 auto;
         padding: 20px 20px;          
       }
       button{
           padding: 10px 25px;
           margin-bottom: 15px;
           background-color : #814b2b;
           border: none;
       }
       .token{
          display: block;
          text-decoration: none;
          font-size: 16px;
          color: #fff !important;
          font-weight: bold;
          background-color : #7fbbd7;
          padding: 10px 25px;
          margin-bottom: 20px;
          margin-top: 20px;
          width: fit-content
      }
     </style>
   </head>
   <body>
     <div class="container">
        <p>Cher(e) ${name},</p>
        <p>Vous voulez changer de mot de passe ? Cliquez sur le bouton ci-dessous.</p>
        <a class="token" href="${clientBaseUrl}/changer-mot-de-passe?token=${token}" target=blank> Je change mon mot de passe </a>
        <p>
          Si vous n'êtes pas à l'orgine de la création de ce compte, veuillez nous en informer à l'adresse ${o2switch.contact}
        </p>
     </div>
   </body>
 </html>
`;
};

exports.staffPasswordInitialisationRequestTemplate = async (name, token) => {
  return `
 <html>
   <head>
     <style>
       /* Your CSS styles go here */
        *{
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
       .container {
         width: 100%;
         margin: 0 auto;
         padding: 20px 20px;          
       }
       button{
           padding: 10px 25px;
           margin-bottom: 15px;
           background-color : #814b2b;
           border: none;
       }
       .token{
          display: block;
          text-decoration: none;
          font-size: 16px;
          color: #fff !important;
          font-weight: bold;
          background-color : #2a5d46;
          padding: 10px 25px;
          margin-bottom: 20px;
          margin-top: 20px;
          width: fit-content
      }
     </style>
   </head>
   <body>
     <div class="container">
        <p>Cher(e) ${name},</p>
        <p>Vous souhaitez changer de mot de passe ? Cliquez sur le bouton ci-dessous.</p>
        <a class="token" href="${clientAdminBaseUrl}/changer-mot-de-passe?token=${token}" target=blank> Je change mon mot de passe </a>
        <p>
          Si vous n'êtes pas à l'origine de cette action, veuillez nous en informer à l'adresse ${o2switch.contact}
        </p>
     </div>
   </body>
 </html>
`;
};

exports.emailVerificationTemplate = async (name, token) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        p{
          font-size: 15px;
          line-height: 25px;
        }
        .greeting{
          margin-bottom : 30px;
        }
        .token{
          display: block;
            text-decoration: none;
            font-size: 16px;
            color: #fff !important;
            font-weight: bold;
            background-color : #7fbbd7;
            padding: 10px 25px;
            margin-bottom: 20px;
            margin-top: 20px;
            width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="greeting">Cher(e) ${name},</p>
        <p>MAHÒL : Compte crée </p>
        <p>Vos informations ont bien été pris en compte, veuillez cliquer sur le bouton ci-dessous pour valider votre adresse email.</p>
        <a class="token" href="${clientBaseUrl}/valider-email?token=${token}" target=blank> Je valide mon email </a>
        <p>
            <b>NB :</b> Si vous n'êtes pas à l'orgine de la création de ce compte, veuillez nous en informer à l'adresse ${o2switch.contact}.
        </p>
      </div>
    </body>
  </html>
`;
};

exports.suceedEmailVerificationTemplate = async (name) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        p{
          font-size: 15px;
          line-height: 25px;
        }
        .greeting{
          margin-bottom : 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="greeting">Cher(e) ${name},</p>
        <p>Vous avez validé votre email</p>
        <p>Nous traitons les information que vous avez fourni. Vous recevrez un email lorsque votre compte sera crée.</p>
        <p>
          Nous avons pu vérifier que vous êtes bienle propriétaire de l'adresse email que vous avez fournie.
        </p>
        
        <p>
            <b>NB :</b> Si vous n'êtes pas à l'orgine de la création de ce compte, veuillez nous en informer à l'adresse ${o2switch.contact}.
        </p>
      </div>
    </body>
  </html>
`;
};

exports.groupAssignmentMailTemplate = async (subscriberName, groupName) => {
  return `
<html>
  <head>
    <style>
      *{
        margin: 0;
        padding: 0;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
      }
      body {
        background-color: #f2f2f2;
      }
      .container {
        width: 100%;
        margin: 0 auto;
        padding: 20px 20px;          
      }
      .token{
        display: block;
        text-decoration: none;
        font-size: 16px;
        color: #fff !important;
        font-weight: bold;
        background-color : #7fbbd7;
        padding: 10px 25px;
        margin-bottom: 20px;
        margin-top: 20px;
        width: fit-content
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Cher(e) ${subscriberName},</p>
      <p>Vous êtes désormais membre du groupe ${groupName}.</p>
    </div>
  </body>
</html>
`;
};

exports.guestInvitationMailTemplate = async (
  firstname,
  lastname,
  email,
  groupName,
  representantName
) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        .token{
          display: block;
          text-decoration: none;
          font-size: 16px;
          color: #fff !important;
          font-weight: bold;
          background-color : #7fbbd7;
          padding: 10px 25px;
          margin-bottom: 20px;
          margin-top: 20px;
          width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Bonjour ${firstname} ${lastname},</p>
        <p>
          Vous avez été invité(e) par ${representantName} à rejoindre le groupe ${groupName} sur notre plateforme Mahol Diaspora. 
          Ce groupe vous permettra de [bénéfices ou objectifs du groupe, par ex. : partager des idées, collaborer, accéder à des ressources exclusives].
        </p>
        <br>
        <p>
        Pour rejoindre le groupe, suivez ces étapes simples :
        </p>
        <ol>
          <li>
            Cliquez sur le bouton ci-dessous pour accéder à la page d'inscription.
          </li>
          <li>
            Complétez le formulaire avec vos informations personnelles.
          </li>
          <li>
            Une fois inscrit(e), vous serez automatiquement ajouté(e) au groupe ${groupName}.
          </li>
        </ol>

        <a class="token" href="${clientBaseUrl}/nous-rejoindre/particulier?email=${email}&firstname=${firstname}&lastname=${lastname}" target=blank >Je rejoins le groupe</a>

        <p>
          Si vous avez des questions ou rencontrez des difficultés, contactez-nous à l'adresse ${o2switch.contact}.
        </p>
        <p>
          À très bientôt,
        </p>
        <br>
        <p>
          L’équipe Mahol
        </p>
      </div>
    </body>
  </html>
  `;
};

exports.groupValidationMailTemplate = async (groupCreatorName, groupName) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        .token{
          display: block;
          text-decoration: none;
          font-size: 16px;
          color: #fff !important;
          font-weight: bold;
          background-color : #7fbbd7;
          padding: 10px 25px;
          margin-bottom: 20px;
          margin-top: 20px;
          width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Bonjour ${groupCreatorName},</p>
        <p>
          Votre groupe ${groupName} a été validé par les administrateurs de Mahol. 
          En vous connectant vous aurez la possibilité d'inviter des membres à rejoindre votre groupe. 
        </p>
        <br>

        <a class="token" href="${clientBaseUrl}/se-connecter" target=blank >Se connecter</a>

        <p>
          Si vous avez des questions ou rencontrez des difficultés, contactez-nous à ${o2switch.contact}.
        </p>
        <p>
          À très bientôt,
        </p>
        <br>
        <p>
          L’équipe Mahol
        </p>
      </div>
    </body>
  </html>
  `;
};

exports.succeedPasswordInitialisationTemplate = async () => {};

exports.idRequestTemplate = async (subscriberName, token) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        .token{
          display: block;
          text-decoration: none;
          font-size: 16px;
          color: #fff !important;
          font-weight: bold;
          background-color : #7fbbd7;
          padding: 10px 25px;
          margin-bottom: 20px;
          margin-top: 20px;
          width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Bonjour ${subscriberName},</p>
        <p>
          Nous souhaitons vérifier votre identité et valider définitivement votre compte. 
          Pour cela, nous vous prions de bien vouloir nous faire parvenir votre pièce d'identité . 
        </p>
        <p>
          Pour nous envoyer votre document d'identification, veillez cliquer sur le boutton ci-après.
        </p>
        <br>

        <a class="token" href="${clientBaseUrl}/envoyer-piece-identite?token=${token}" target=blank> J'envois ma pièce d'identité</a>

        <p>
          Si vous avez des questions ou rencontrez des difficultés, contactez-nous à ${o2switch.contact}.
        </p>
        <p>
          À très bientôt,
        </p>
        <br>
        <p>
          L’équipe Mahol
        </p>
      </div>
    </body>
  </html>
  `;
};

exports.identicationWithAttachmentsMailTemplate = async (
  subscriberName,
  email,
  resgistrationNumber,
  identificationType
) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        .token{
          display: block;
          text-decoration: none;
          font-size: 16px;
          color: #fff !important;
          font-weight: bold;
          background-color : #7fbbd7;
          padding: 10px 25px;
          margin-bottom: 20px;
          margin-top: 20px;
          width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Bonjour,</p>
        <p>
            L'adhérent nommé ${subscriberName} vient de soumettre ses éléments d'identification :            
        </p>
        <br>
        <ul>
          <li> 
            N° d'adhérent : ${resgistrationNumber}
          </li>
          <li> 
            Email adhérent : ${email}
          </li>
          <li> 
            Type de pièce : ${identificationType}
          </li>
        </ul>

        <br>
        <p>
          Veuillez procéder à la véification des éléments
        </p>
        <br>
        <p>
          L’équipe Mahol
        </p>
      </div>
    </body>
  </html>
  `;
};

exports.staffRequestMailTemplate = async (mailObject) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        p{
          font-size: 15px;
          line-height: 25px;
        }
        .greeting{
          margin-bottom : 30px;
        }
        .token{
          display: block;
            text-decoration: none;
            font-size: 16px;
            color: #fff !important;
            font-weight: bold;
            background-color : #7fbbd7;
            padding: 10px 25px;
            margin-bottom: 20px;
            margin-top: 20px;
            width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="greeting">Cher(e) ${mailObject.firstname},</p>
        <p>Vous avez étés invités à rejoindre le staff de Mahol Diaspora avec pour rôle(s) : ${mailObject.roleStringifiedNames}. </p>
        <p>Pour accéder à votre espace d'administration, veuillez cliquer sur le lien ci-dessous et définir votre mot de passe.</p>
        <a class="token" href="${clientAdminBaseUrl}/staffs/valider-invitations?firstname=${mailObject.firstname}&email=${mailObject.emailPro}&token=${mailObject.token}" target="_blank"> Je définis mon mot de passe </a>
        <p>
            <b>NB : </b> Pour toutes questions, écrivez-nous à l'adresse ${o2switch.contact}.
        </p>
      </div>
    </body>
  </html>
`;
};

exports.succeedStaffAccountCreationMailTemplate = async (firstname) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        p{
          font-size: 15px;
          line-height: 25px;
        }
        .greeting{
          margin-bottom : 30px;
        }
        .token{
          display: block;
            text-decoration: none;
            font-size: 16px;
            color: #fff !important;
            font-weight: bold;
            background-color : #7fbbd7;
            padding: 10px 25px;
            margin-bottom: 20px;
            margin-top: 20px;
            width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="greeting">Cher(e) ${firstname},</p>
        <p>Félicitation, vous faites désormais partie du staff de Mahol </p>
        <p>Pour accéder à votre espace d'administration, veuillez cliquer sur le lien ci-dessous et vous connecter</p>
        <a class="token" href="${clientAdminBaseUrl}/se-connecter" target="_blank">Se Connecter</a>
        <p>
            <b>NB : </b> Pour toutes questions, écrivez-nous à l'adresse ${o2switch.contact}.
        </p>
      </div>
    </body>
  </html>
`;
};

exports.succeedGroupAffectationMailTemplate = async (firstname) => {
  return `
  <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
        }
        body {
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 20px 20px;          
        }
        p{
          font-size: 15px;
          line-height: 25px;
        }
        .greeting{
          margin-bottom : 30px;
        }
        .token{
          display: block;
            text-decoration: none;
            font-size: 16px;
            color: #fff !important;
            font-weight: bold;
            background-color : #7fbbd7;
            padding: 10px 25px;
            margin-bottom: 20px;
            margin-top: 20px;
            width: fit-content
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="greeting">Cher(e) ${firstname},</p>
        <p>Un nouveau groupe vous a été affecté ou retiré, veuillez-vous connecter pour en prendre connaissance. </p>

        <a class="token" href="${clientAdminBaseUrl}/se-connecter" target="_blank">Se Connecter</a>
        <p>
            <b>NB : </b> Pour toutes questions, écrivez-nous à l'adresse ${o2switch.contact}.
        </p>
      </div>
    </body>
  </html>
`;
};

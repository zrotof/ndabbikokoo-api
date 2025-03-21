const { clientBaseUrl, clientAdminBaseUrl } = require("../config/dot-env");
const { o2switch } = require('../config/dot-env');

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
          Votre compte a bien été validé par les administrateurs de Mahol. Vous pouvez désormais vous connecter et profiter de toutes les fonctionnalités de la plateforme.
          </p>
          <a class="token" href="${clientBaseUrl}/se-connecter" target=blank> Se connecter </a>
          
       </div>
  
     </body>
   </html>
  `;
  
  return htmlContent;
  }

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
        <p>Nous avons bien pris en compte votre désir de changer de mot de passe . Pour ce faire veuiller cliquer sur le bouton ci après.</p>
        <a class="token" href="${clientBaseUrl}/changer-mot-de-passe?token=${token}" target=blank> Changer vore mot de passe </a>
        <p>
          <b>NB :</b> Si vous n'êtes pas à l'origine de la création de ce compte, écrivez-nous à l'adresse contact@purs.cm pour que nous supprimions ce compte.
        </p>
     </div>

   </body>
 </html>
`;

return htmlContent;
}

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
        <p>Votre compte a bien été créé et il ne vous reste plus qu'à le valider pour pouvoir y accéder. </p>
        <p>Pour ce faire, veuiller cliquer sur le bouton ci-après!</p>
        <a class="token" href="${clientBaseUrl}/valider-email?token=${token}" target=blank> Je vérifie mon email </a>
        <p>
            <b>NB :</b> Si vous n'êtes pas à l'origine de la création de ce compte, écrivez-nous à l'adresse ${o2switch.contact} pour que nous supprimions ce compte.
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
        <p>
          Nous avons pu vérifier que vous êtes bienle propriétaire de l'adresse email que vous avez fournie.
        </p>
        <p>
          Cependant, nous devons encore procédé à des vérifications des  informations que vus avez fournies lors de la création de votre compte. Une fois ces vérifications effectuées, vous recevrez un email vous informant de la validation de votre compte.
        </p>
        <p>
            <b>NB :</b> Si vous n'êtes pas à l'origine de la création de ce compte, écrivez-nous à l'adresse ${o2switch.contact} pour que nous supprimions ce compte.
        </p>
      </div>
    </body>
  </html>
`;
};

exports.groupAssignmentMailTemplate = async(subscriberName, groupName) => {
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
      <p>Vous faites désormais partie du groupe ${groupName}.</p>
    </div>
  </body>
</html>
`
}

exports.guestInvitationMailTemplate = async (firstname, lastname, email, groupName, representantName) => {
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
          Vous avez été invité(e) par ${representantName} à rejoindre le groupe ${groupName} sur notre plateforme Mahol. Ce groupe vous permettra de [bénéfices ou objectifs du groupe, par ex. : partager des idées, collaborer, accéder à des ressources exclusives].
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

        <a class="token" href="${clientBaseUrl}/nous-rejoindre/particulier?email=${email}&firstname=${firstname}&lastname=${lastname}" target=blank >Rejoindre le groupe</a>

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
  `
}

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
          Votre groupe ${groupName} a été validé par les administrateurs de Mahol. En vous connectant vous aurez la possibilité d'inviter des membres à rejoindre votre groupe. 
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
  `
}

exports.succeedPasswordInitialisationTemplate = async() => {

}

exports.idRequestTemplate = async(subscriberName, token) => {
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
          Nous souhaitons vérifier votre identité et valider définitivement votre compte. Pour cela, nous vous prions de bien vouloir nous faire parvenir votre pièce d'identité . 
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
  `
}

exports.identicationWithAttachmentsMailTemplate = async(subscriberName, email, resgistrationNumber, identificationType) => {
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
  `
}

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
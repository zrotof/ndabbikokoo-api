const { clientBaseUrl } = require("../config/dot-env");
const { o2switch } = require('../config/dot-env');

exports.changePasswordTemplate = async (name, token) => {
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
};

exports.initChangePasswordTemplate = async (name, token) => {

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

exports.validAccountTemplate = async (name, token) => {
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

exports.succeedChangePasswordTemplate = async(name) => {
    return `
  <html>
    <head>
      <style>
        /* Your CSS styles go here */
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
        <p>Cher(e) ${name},</p>
        <p>Nous avons bien procédé à la modification de votre mot de passe, il ne vous reste plus qu'à vous connecter ! Pour ce faire vous pouvez cliquer sur le bouton ci après.</p>
        <a class="token" href="${clientBaseUrl}/se-connecter" target=blank> Se connecter </a>
        <p>
            <b>NB :</b> Si vous n'êtes pas à l'origine de la création de ce compte, écrivez-nous à l'adresse contact@purs.cm pour que nous supprimions ce compte.
        </p>
      </div>
    </body>
  </html>
`
}



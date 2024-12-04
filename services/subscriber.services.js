const { where } = require('sequelize');
const { models } = require('../models');

const { CustomError } = require('../utils/errors');
const { isObjectEmpty } = require('../utils/parsing.utils');

class Subscriber{

    async getSubscribers(queries){
        try {

            let whereCondition = {}

            if(isObjectEmpty(queries)){
                whereCondition = {
                    isAccountValidated : true
                }
            }
            else{
                whereCondition = {...queries}
            }

            const subscribersList = await models.Subscriber.findAll({
                exclude : ["areStatusInternalRegulationsAndMembershipAgreementAccepted", "areRgpdConsentAccepted"],
                include: [
                    {
                        model: models.User,
                        attributes: ['email', 'isEmailConfirmed',],
                        where : whereCondition
                    }
                ]
            });

            const subscribers = subscribersList.map(item => ({
                id: item.id,
                firstname: item.firstname,
                lastname: item.lastname,
                marriedName: item.marriedName,
                sex: item.sex,
                address: item.address,
                postalCode: item.postalCode,
                country: item.country,
                town: item.town,
                phoneNumber: item.phoneNumber,
                phoneCode: item.phoneCode,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                email: item.User?.email,
                isEmailConfirmed: item.User?.isEmailConfirmed
            }));

            return subscribers;

        } catch (error) {
            throw error;
        }
    }

    async createSubscriber(subscriberData, subscriberEmail, transaction){
        try {
            const isUserExist = await models.User.findOne({where : { email : subscriberEmail}});
            
            if(isUserExist){
                const message = "Un utilisateur associé à cet adresse email existe déjà!"
                throw new CustomError(message, 409)
            }

            return await models.Subscriber.create( subscriberData, { transaction } );
        } catch (error) {
            throw error
        }
    }

    async deleteSubscriber(subscriberId){
        try {
            const subscriber = await models.Subscriber.findByPk(subscriberId);

            if (!subscriber) {
              throw new NotFoundError(
                "Cet adhérent est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !"
              );
            }
          
            await subscriber.destroy();
      
        } catch (error) {
            throw error
        }
    }
}

module.exports = new Subscriber();
const beneficiaryService = require("../services/beneficiary.services");

exports.registerBeneficiary = async (req, res, next) => {
  try {

    const beneficiaryToSave = { 
      subscriberId: req.body.subscriberId,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      sex: req.body.sex,
      address: req.body.address,
      postalCode: req.body.postalCode,
      country: req.body.country,
      town: req.body.town,
      phoneCode: req.body.phoneCode,
      phoneNumber: req.body.phoneNumber
    }

    const beneficiary = await beneficiaryService.registerBeneficiary(beneficiaryToSave);

    return res.status(200).json({
      status: "success",
      data: beneficiary,
      message: 'Bénéficiaire créé avec succès !'
    });

  } catch (error) {
    next(error);
  }
}

exports.getBeneficiaryBySubscriberId = async (req, res, next) => {
  try {

    const id = req.params.id;

    const beneficiary = await beneficiaryService.getBeneficiaryBySubscriberId(id);

    return res.status(200).json({
      status: "success",
      data: beneficiary,
      message: null
    });

  } catch (error) {
    next(error);
  }
}


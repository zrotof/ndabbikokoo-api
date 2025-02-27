const beneficiaryService = require("../services/beneficiary.services");

exports.registerBeneficiary = async (req, res, next) => {
  try {

    const beneficiaryToSave = { 
      subscriberId: req.body?.subscriberId,
      email: req.body?.email,
      firstname: req.body?.firstname,
      filiation: req.body?.filiation,
      lastname: req.body?.lastname,
      sex: req.body?.sex,
      address: req.body?.address,
      postalCode: req.body?.postalCode,
      country: req.body?.country,
      town: req.body?.town,
      phoneCode: req.body?.phoneCode,
      phoneNumber: req.body?.phoneNumber
    }

    const beneficiary = await beneficiaryService.registerBeneficiary(beneficiaryToSave);

    return res.status(201).json({
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

    const beneficiaries = await beneficiaryService.getBeneficiariesBySubscriberId(id);

    return res.status(200).json({
      status: "success",
      data: beneficiaries,
      message: null
    });

  } catch (error) {
    next(error);
  }
}

exports.editBeneficiaryById = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const id = req.params.id;

    const { newBeneficiaryData } = req.body;

    await beneficiaryService.editBeneficiaryById(id, newBeneficiaryData, transaction);
    
    return res.status(201).json({
      status: "success",
      data: null,
      message: "Bénéficiaire modifié avec succès !",
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteBeneficiary = async (req, res,next) => {
  try {
        const beneficiaryId = req.params.id;
        await beneficiaryService.deleteBeneficiaryById(beneficiaryId);
    
        return res.status(200).json({
          status: "success",
          data: null,
          message: "Bénéficiaire supprimé avec succès !",
        });
    
  } catch (error) {
    next(error)
  }
}


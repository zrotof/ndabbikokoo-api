const beneficiaryService = require("../services/beneficiary.services");

exports.registerSubscriber = async (req, res, next) => {
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


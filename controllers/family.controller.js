const familyService = require('../services/family.services');

exports.getFamilyMembersBySubscriberId = async (req, res, next) => {
  try {
    const id = req.params.id;

    const families = await familyService.getFamilyMembersBySubscriberId(id);

    return res.status(200).json(
      {
        status: "success",
        data: families,
        message: null
      }
    )
  } catch (error) {
    next(error)
  }
}
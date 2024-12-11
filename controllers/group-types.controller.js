const groupTypeService = require("../services/group-type.services");

exports.getGroupTypes = async (req, res, next) => {
  try {
    const groupTypes = await groupTypeService.getGroupTypes();

    return res.status(201).json({
      status: "success",
      data: groupTypes,
      message: "",
    });
  } catch (e) {
    next(e);
  }
};
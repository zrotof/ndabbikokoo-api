const groupService = require("../services/group.services");

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await groupService.getGroups();

    return res.status(201).json({
      status: "success",
      data: groups,
      message: "",
    });
  } catch (e) {
    next(e);
  }
};

exports.getGroupById = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const group = await groupService.getGroupById(groupId);

    return res.status(200).json({
      status: "success",
      data: group,
      message: "Groupe trouvé",
    });
  } catch (e) {
    next(e);
  }
};

exports.createGroup = async (req, res, next) => {
  try {
    const { name, country, town } = req.body;

    await groupService.createGroup({ name, country, town });

    return res.status(201).json({
      status: "success",
      data: null,
      message: `Groupe ${name} créé avec succès !`,
    });
  } catch (e) {
    next(e);
  }
};

exports.updateGroup = async (req, res, next) => {
  const groupId = req.params.id;
  const {newGroupData} = req.body;

  try {
    const result = await groupService.updateGroup(groupId, newGroupData);

    return res.status(200).json({
      status: "success",
      data: result,
      message: "Groupe modifié avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

//Delete user
exports.deleteGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    await groupService.deleteGroup(groupId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Groupe supprimé avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

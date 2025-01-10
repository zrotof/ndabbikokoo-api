const groupService = require("../services/group.services");

exports.getGroups = async (req, res, next) => {
  try {
    const queries = req.query;

    const groups = await groupService.getGroups(queries);

    return res.status(201).json({
      status: "success",
      data: groups,
      message: "",
    });
  } catch (e) {
    next(e);
  }
};

exports.getGroupMembersByGroupId = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const members = await groupService.getGroupMembersByGroupId(groupId);

    return res.status(200).json({
      status: "success",
      data: members,
      message: "Membres trouvés",
    });
    
  } catch (error) {
    next(error)
  }
}

exports.getGroupBySubscriberId = async (req, res, next) => {
  try {
    const subscriberId = req.params.id;
    const group = await groupService.getGroupBySubscriberId(subscriberId);

    return res.status(200).json({
      status: "success",
      data: group,
      message: "Groupe trouvé",
    });
    
  } catch (error) {
    next(error)
  }
}

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
    const { name, country, town, groupType, isActive, representativeId } = req.body;

    await groupService.createGroup({ name, country, town, groupType, isActive, representativeId });

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
  const { newGroupData } = req.body;

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

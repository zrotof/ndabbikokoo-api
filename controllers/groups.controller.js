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
}

exports.getGroupWithMembersByGroupId = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const groupWithMembers = await groupService.getGroupWithMembersByGroupId(groupId);

    return res.status(200).json({
      status: "success",
      data: groupWithMembers,
      message: "Membres trouvés",
    });
    
  } catch (error) {
    next(error)
  }
}

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
}

exports.createGroup = async (req, res, next) => {
  try {

    const { name, country, town, isActive, representativeId } = req.body;

    const groupDataToSave = {
      name : name,
      country: country,
      town: town,
      isActive: isActive ?? true,
      isCreatedByMahol: !representativeId,
      representativeId: representativeId ?? null
    }

    await groupService.createGroup(groupDataToSave);

    return res.status(201).json({
      status: "success",
      data: null,
      message: `Groupe ${name} créé avec succès !`,
    });
  } catch (e) {
    next(e);
  }
}

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
}

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
}
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../services/role.services");

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await getRoles();

    return res.status(201).json({
      status: "success",
      data: roles,
      message: "",
    });
  } catch (e) {
    next(e);
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const roleToSave = { name, description };

    const role = await createRole(roleToSave);

    return res.status(201).json({
      status: "success",
      data: role,
      message: `Rôle ${name} créé avec succès !`,
    });
  } catch (e) {
    next(e);
  }
};

exports.updateRole = async (req, res, next) => {
  const roleId = req.params.id;
  const newRoleData = req.body;
  try {
    const result = await updateRole(roleId, newRoleData);

    return res.status(200).json({
      status: "success",
      data: result,
      message: "Rôle modifié avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

//Delete user
exports.deleteRole = async (req, res, next) => {
  try {
    const roleId = req.params.id;
    await deleteRole(roleId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Rôle supprimé avec succès !",
    });
  } catch (e) {
    next(e);
  }
};

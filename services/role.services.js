const { models } = require("../models");
const { NotFoundError } = require('../utils/errors');

exports.getRoles = async () => {
  try {
    const roles = await models.Role.findAll();
    return roles;
  } catch (error) {
    throw error;
  }
};

exports.createRole = async (roleData) => {
  try {
    const newRole = await models.Role.create(roleData);
    return newRole;
  } catch (error) {
    throw error;
  }
};

exports.updateRole = async (roleId, newRoleData) => {
  try {
    const updatedRowCount = await models.Role.update(newRoleData, {
      where: { id: roleId },
    });

    if (updatedRowCount[0] === 0) {
      throw new NotFoundError("Le rôle que vous essayez de modifier est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !");
    }

    return true;
  } catch (error) {
    throw error
  }
};

exports.deleteRole = async (roleId) => {
  try {
    const deletedRole = await models.Role.destroy({
      where: { id: roleId },
    });

    if (deletedRole === 0) {
      throw new NotFoundError("Le rôle que vous essayez de supprimer est inconnu. Veuillez actualiser la page et re-essayer. Si le problème persiste contactez le webmaster !");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const { models } = require("../models");
const { NotFoundError, CustomError } = require('../utils/errors');

exports.getRoles = async () => {
  try {
    const roles = await models.Role.findAll();
    return roles;
  } catch (error) {
    throw error;
  }
};

exports.getRoleByCode = async (code) => {
  try {
    const role = await models.Role.findOne({
      where: {code}
    });

    if (!role) {
      throw new NotFoundError("Le rôle que vous cherchez est inconnu");
    }

    return role;
  } catch (error) {
    throw error;
  }
}

exports.assignRolesToSubscriber = async (subscriberId, isGroupRepresentative, transaction) => {
  try {
    const subscriber = await models.Subscriber.findByPk(subscriberId, {transaction});

    if (!subscriber) {
      throw new NotFoundError('Nous nous retouvons pas cet adhérent');
    }

    const roleCode = isGroupRepresentative ? 'representative' : 'member';

    const role = await this.getRoleByCode(roleCode);

    await subscriber.addRoles(role, { transaction });
    return true;
  } catch (error) {
    throw error;
  }
};

exports.assignRolesToStaff = async (subscriberId, Ids = [], transaction) => {
  try {
    const subscriber = await models.Subscriber.findByPk(subscriberId);
    
    if (!subscriber) {
      throw new NotFoundError('Nous nous retouvons pas cet adhérent');
    }
    
    const rolesToAssign = await models.Role.findAll({
      where: {
        id: rolesId
      },
      transaction
    });

    const foundRoleIds = rolesToAssign.map(role => role.id);
    const missingRoles = rolesId.filter(roleId => !foundRoleIds.includes(roleId));

    if (missingRoles.length > 0) {
      throw new NotFoundError("Attention! Vous essayer de créer un adhérent en lui assignant des roles inexistants");
    }

    if (rolesToAssign.length === 0) {

      const defaultRole = await this.getDefaultRole();

      rolesToAssign.push(defaultRole);
    }

    await subscriber.addRoles(rolesToAssign, { transaction });
    return true;
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
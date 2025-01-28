const staffService = require('../services/staff.services');

exports.createStaff = async (req, res, next) => {
  try {

    const { email, password, roles } = req.body;

    staffData = {email,password};

    await staffService.createStaff(staffData);

    return res.status(201).json({
      status: "success",
      data: user,
      message: "Utilisateur trouvé",
    });
    
  } catch (e) {
    next(e);
  }
};
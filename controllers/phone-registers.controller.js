const phoneRegisterService = require('../services/phone-register.services');

exports.getPhoneRegisters = async (req, res, next) => {
  try {

    const phoneRegisters = await phoneRegisterService.getPhoneRegisters();

    return res.status(200).json(
      {
        status: "success",
        data: phoneRegisters,
        message: null
      }
    )
  } catch (error) {
    next(error)
  }
}

exports.createPhoneRegister = async (req, res, next) => {
  try {

    const { phone } = req.body;

    const phoneRegister = await phoneRegisterService.createPhoneRegister(phone);

    return res.status(201).json(
      {
        status: "success",
        data: phoneRegister,
        message: null
      }
    )
  } catch (error) {
    next(error)
  }
}
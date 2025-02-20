const articleRubricService = require("../services/rubric.services");

exports.getRubrics = async (req, res) => {
  try {
    const queryParams = { ...req.query };

    const rubrics = await articleRubricService.getRubrics(queryParams);

    return res.status(200).json({
      status: "success",
      data: rubrics,
      message: "Succès !",
    });
  } catch (e) {
    throw e;
  }
};

exports.getRubricById = async (req, res) => {
  try {
    const rubricId = req.params.id;

    const articleRubric = await articleRubricService.getRubricById(rubricId);

    return res.status(200).json({
      status: "success",
      data: articleRubric,
      message: "Rubrique trouvée !",
    });
  } catch (e) {
    throw e;
  }
};

exports.createRubric = async (req, res) => {
  try {
    const reqData = { ...req.body };

    const rubric = await articleRubricService.createRubric(reqData);

    return res.status(201).json({
      status: "success",
      data: rubric,
      message: "Rubrique créée avec succès !",
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      data: null,
      message: "Erreur lors de la création, contactez le web master",
    });
  }
};

exports.updateRubric = async (req, res) => {
  try {
    const rubricId = req.params.id;

    const rubricItem = await articleRubricService.getRubricById(rubricId);

    const reqData = req.body;

    const updatedRubric = articleRubricService.updateRubric(
      rubricItem,
      reqData
    );

    return res.status(201).json({
      status: "success",
      data: updatedRubric,
      message: "Rubrique modifiée avec succès !",
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      data: null,
      message: "Erreur inconnue, contactez le web master",
    });
  }
};

exports.deleteRubricById = async (req, res) => {
  try {
    const rubricId = req.params.id;

    await articleRubricService.deleRubricById(rubricId);

    return res.status(200).json({
      status: "success",
      data: null,
      message: "Rubrique supprimée avec succès !",
    });
  } catch (e) {
    throw e;
  }
};

exports.updateArtcleRubricListOrder = async (req, res) => {
  try {
    const dataArray = req.body;

    await articleRubricService.updateArtcleRubricListOrder(dataArray);

    return res.status(201).json({
      status: "success",
      data: null,
      message: "Ordre modifié avec succès !",
    });
  } catch (e) {
    throw e
  }
};
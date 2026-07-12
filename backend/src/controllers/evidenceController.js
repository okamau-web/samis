const evidenceService = require("../services/evidence.service");

exports.uploadEvidence = async (req, res) => {
  try {

    const result = await evidenceService.uploadEvidence(req);

    return res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully.",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getCaseEvidence = async (req, res) => {
  try {
    const evidence = await evidenceService.getCaseEvidence(req);

    return res.status(200).json({
      success: true,
      message: "Evidence retrieved successfully.",
      data: evidence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getEvidenceById = async (req, res) => {
  try {
    const evidence = await evidenceService.getEvidenceById(req);

    return res.status(200).json({
      success: true,
      message: "Evidence retrieved successfully.",
      data: evidence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.previewEvidence = async (req, res) => {
  try {
    const result = await evidenceService.previewEvidence(req, res);
    return result;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.downloadEvidence = async (req, res) => {
  try {
    return await evidenceService.downloadEvidence(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateEvidence = async (req, res) => {
  try {

    const result = await evidenceService.updateEvidence(req);

    return res.status(200).json({
      success: true,
      message: "Evidence updated successfully.",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
exports.deleteEvidence = async (req, res) => {
  try {

    const result = await evidenceService.deleteEvidence(req);

    return res.status(200).json({
      success: true,
      message: "Evidence deleted successfully.",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.restoreEvidence = async (req, res) => {
  try {

    const result = await evidenceService.restoreEvidence(req);

    return res.status(200).json({
      success: true,
      message: "Evidence restored successfully.",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
exports.getStatistics = async (req, res) => {
  try {

    const stats = await evidenceService.getStatistics();

    return res.status(200).json({
      success: true,
      message: "Evidence statistics retrieved successfully.",
      data: stats,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
exports.getHistory = async (req, res) => {
  try {

    const history = await evidenceService.getHistory(req);

    return res.status(200).json({
      success: true,
      message: "Evidence history retrieved successfully.",
      data: history,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
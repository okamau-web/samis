const CaseRepository = require("../repositories/case.repository");
const CaseHistoryRepository = require("../repositories/case-history.repository");

class CaseHistoryService {
  async findByCase(caseId) {
    // Ensure the case exists
    await CaseRepository.findByIdOrFail(
      caseId,
      "Case not found."
    );

    return await CaseHistoryRepository.findByCase(caseId);
  }
}

module.exports = new CaseHistoryService();
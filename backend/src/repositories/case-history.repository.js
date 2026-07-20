const BaseRepository = require("./base.repository");
const CaseHistory = require("../models/CaseHistory");

class CaseHistoryRepository extends BaseRepository {
  constructor() {
    super(CaseHistory);
  }

  async findByCase(caseId) {
    return this.model
      .find({ case: caseId })
      .populate("performedBy", "fullName username role")
      .sort({ createdAt: 1 });
  }
}

module.exports = new CaseHistoryRepository();
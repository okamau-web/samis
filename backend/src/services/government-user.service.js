const BaseService = require("./base.service");

const GovernmentUserRepository = require("../repositories/government-user.repository");

class GovernmentUserService extends BaseService {
  constructor() {
    super(GovernmentUserRepository);
  }

  async getAll(query) {
    
    return this.repository.findAll(query);
  }
}

module.exports = new GovernmentUserService();

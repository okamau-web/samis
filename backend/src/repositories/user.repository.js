const BaseRepository = require("./base.repository");
const User = require("../models/User");

class UserRepository extends BaseRepository {

    constructor() {
        super(User);
    }

}

module.exports = new UserRepository();
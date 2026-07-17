class BaseService {

    constructor(repository) {

        this.repository = repository;

    }

    async findById(id) {

        return this.repository.findById(id);

    }

    async create(data) {

        return this.repository.create(data);

    }

    async updateById(id, data) {

        return this.repository.updateById(id, data);

    }

    async deleteById(id) {

        return this.repository.deleteById(id);

    }

}

module.exports = BaseService;
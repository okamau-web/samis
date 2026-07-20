class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async updateOrFail(id, data, message = "Record not found.") {
    const record = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      throw new Error(message);
    }

    return record;
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async exists(filter) {
    return this.model.exists(filter);
  }

  async findByIdOrFail(id, message = "Record not found.") {
    const record = await this.model.findById(id);

    if (!record) {
      throw new Error(message);
    }

    return record;
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }


  async updateByIdOrFail(id, data, message = "Record not found.") {

    const record = await this.model.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!record) {
        throw new Error(message);
    }

    return record;
}
}
module.exports = BaseRepository;

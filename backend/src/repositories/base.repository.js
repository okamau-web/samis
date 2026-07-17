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
  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
  async exists(filter) {
    return this.model.exists(filter);
  }
}
module.exports = BaseRepository;

const BaseRepository = require("./base.repository");
const Case = require("../models/Case");

const { buildSearchStage } = require("../helpers/search.helper");

const { buildSortStage } = require("../helpers/sort.helper");

const { buildPaginationFacet } = require("../helpers/pagination.helper");

const caseSearchFields = require("../constants/case-search-fields");
const caseSortFields = require("../constants/case-sort-fields");
const caseProjection = require("../constants/case-projection");

class CaseRepository extends BaseRepository {
  constructor() {
    super(Case);
  }

  async findAll(query) {
    const {
      search = "",

      status,

      priority,

      county,

      category,

      assignedTo,

      page = 1,

      limit = 10,

      sortBy = "createdAt",

      sortOrder = "desc",
    } = query;

    const pipeline = [];

    const filter = {
      isDeleted: { $ne: true },
    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (county) {
      filter.county = county;
    }

    if (category) {
      filter.category = category;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    pipeline.push({
      $match: filter,
    });

    const searchStage = buildSearchStage(
      caseSearchFields,

      search,
    );

    if (searchStage) {
      pipeline.push(searchStage);
    }

    pipeline.push(
      buildSortStage(
        sortBy,

        sortOrder,

        caseSortFields,
      ),
    );

    pipeline.push({
      $facet: buildPaginationFacet(
        Number(page),

        Number(limit),

        caseProjection,
      ),
    });

    const result = await this.model.aggregate(pipeline);

    const total = result[0].metadata[0]?.total || 0;

    return {
      data: result[0].data,

      meta: {
        page: Number(page),

        limit: Number(limit),

        total,

        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async assign(caseId, officerId, assignedBy) {
    return await this.updateOrFail(
      caseId,

      {
        assignedTo: officerId,

        assignedBy,

        assignedAt: new Date(),

        status: "Assigned",
      },

      "Case not found.",
    );
  }
  async updateStatus(caseId, status) {
    return await this.updateOrFail(
      caseId,
      { status },

      "Case not found.",
    );
  }

  async transfer(caseId, officerId, assignedBy, reason = "") {
    return await this.updateOrFail(
      caseId,

      {
        assignedTo: officerId,

        assignedBy,

        assignedAt: new Date(),

        transferReason: reason,
      },

      "Case not found.",
    );
  }
  async update(caseId, data) {
  return await this.updateByIdOrFail(
    caseId,
    data,
    "Case not found."
  );
}
 
async softDelete(caseId, userId) {
    return this.updateByIdOrFail(
        caseId,
        {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
        },
        "Case not found."
    );
}
 
async restore(caseId) {
  return this.updateByIdOrFail(
    caseId,
    {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    },
    "Deleted case not found."
  );
}
async findDeleted() {

    return await this.model
        .find({
            isDeleted: true,
        })
        .populate("reportedBy", "username role")
        .populate("assignedTo", "username role")
        .populate("deletedBy", "username role")
        .sort({
            deletedAt: -1,
        });

}
}

module.exports = new CaseRepository();

 const BaseRepository = require("./base.repository");

const User = require("../models/User");

const {
    lookupGovernmentProfile
} = require("../helpers/aggregation.helper");

const {
    buildSearchStage
} = require("../helpers/search.helper");

const {
    buildSortStage
} = require("../helpers/sort.helper");

const {
    buildPaginationFacet
} = require("../helpers/pagination.helper");

class GovernmentUserRepository extends BaseRepository {

    constructor() {

        super(User);

    }

    async findAll(query) {

        const {

            search = "",

            role,

            status,

            page = 1,

            limit = 10,

            sortBy = "createdAt",

            sortOrder = "desc"

        } = query;

        const pipeline = [];

        const userFilter = {

            userType: "Government"

        };

        if (role) {

            userFilter.role = role;

        }

        if (status) {

            userFilter.status = status;

        }

        pipeline.push({

            $match: userFilter

        });

        pipeline.push(

            ...lookupGovernmentProfile()

        );

        const searchStage = buildSearchStage(

            [

                "username",

                "profile.fullName",

                "profile.personalNumber",

                "profile.nationalId"

            ],

            search

        );

        if (searchStage) {

            pipeline.push(searchStage);

        }

        pipeline.push(

            buildSortStage(

                sortBy,

                sortOrder

            )

        );

        pipeline.push({

            $facet: buildPaginationFacet(

                Number(page),

                Number(limit),

                {

                    _id: 0,

                    userId: "$_id",

                    username: 1,

                    role: 1,

                    status: 1,

                    personalNumber: "$profile.personalNumber",

                    nationalId: "$profile.nationalId",

                    fullName: "$profile.fullName",

                    phoneNumber: "$profile.phoneNumber",

                    email: "$profile.email",

                    designation: "$profile.designation",

                    county: "$profile.county",

                    subCounty: "$profile.subCounty",

                    division: "$profile.division",

                    location: "$profile.location",

                    subLocation: "$profile.subLocation",

                    village: "$profile.village",

                    createdAt: 1,

                    updatedAt: 1

                }

            )

        });

        const result = await this.model.aggregate(pipeline);

        const total = result[0].metadata[0]?.total || 0;

        return {

            data: result[0].data,

            meta: {

                page: Number(page),

                limit: Number(limit),

                total,

                totalPages: Math.ceil(total / Number(limit))

            }

        };

    }

}

module.exports = new GovernmentUserRepository();
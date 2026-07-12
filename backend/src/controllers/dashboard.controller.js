const Case = require("../models/Case");
const CaseHistory = require("../models/CaseHistory");

const {
  successResponse,
  errorResponse,
} = require("../helpers/response.helper");

const { CASE_STATUS } = require("../constants/case.constants");


 
exports.getDashboardSummary = async (req, res) => {
  try {
    const summary = await Case.aggregate([
      {
        $facet: {
          totalCases: [
            {
              $match: {
                isDeleted: false,
              },
            },
            { $count: "count" },
          ],

          reported: [
            {
              $match: {
                status: CASE_STATUS.REPORTED,
                isDeleted: false,
              },
            },
            { $count: "count" },
          ],

          assigned: [
            {
              $match: {
                status: CASE_STATUS.ASSIGNED,
                isDeleted: false,
              },
            },
            { $count: "count" },
          ],

          underInvestigation: [
            {
              $match: {
                status: CASE_STATUS.UNDER_INVESTIGATION,
                isDeleted: false,
              },
            },
            { $count: "count" },
          ],

          resolved: [
            {
              $match: {
                status: CASE_STATUS.RESOLVED,
                isDeleted: false,
              },
            },
            { $count: "count" },
          ],

          closed: [
            {
              $match: {
                status: CASE_STATUS.CLOSED,
                isDeleted: false,
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = {
      totalCases: summary[0].totalCases[0]?.count || 0,
      reportedCases: summary[0].reported[0]?.count || 0,
      assignedCases: summary[0].assigned[0]?.count || 0,
      underInvestigation: summary[0].underInvestigation[0]?.count || 0,
      resolvedCases: summary[0].resolved[0]?.count || 0,
      closedCases: summary[0].closed[0]?.count || 0,
    };

    return successResponse(
      res,
      200,
      "Dashboard summary retrieved successfully.",
      data,
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

 
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await CaseHistory.find()
      .populate("performedBy", "fullName username role")
      .populate("case", "caseNumber")
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedActivities = activities.map((activity) => ({
      caseNumber: activity.case?.caseNumber || "Unknown Case",

      action: activity.action,

      performedBy:
        activity.performedBy?.fullName ||
        activity.performedBy?.username ||
        "System",

      role: activity.performedBy?.role || "System",

      remarks: activity.remarks,

      performedAt: activity.createdAt,
    }));

    return successResponse(
      res,
      200,
      "Recent activity retrieved successfully.",
      formattedActivities,
      {
        count: formattedActivities.length,
      },
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

 
exports.getCasesByCategory = async (req, res) => {
  try {
    const categories = await Case.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    return successResponse(
      res,
      200,
      "Cases by category retrieved successfully.",
      categories,
      {
        count: categories.length,
      },
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

 
exports.getCasesByCounty = async (req, res) => {
  try {
    const counties = await Case.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$county",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          county: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    return successResponse(
      res,
      200,
      "Cases by county retrieved successfully.",
      counties,
      {
        count: counties.length,
      },
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

 
exports.getMonthlyCases = async (req, res) => {
  try {
    const monthlyCases = await Case.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          cases: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedData = monthlyCases.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month],
      cases: item.cases,
    }));

    return successResponse(
      res,
      200,
      "Monthly case statistics retrieved successfully.",
      formattedData,
      {
        count: formattedData.length,
      },
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};
 
exports.getOfficerWorkload = async (req, res) => {
  try {
    const workload = await Case.aggregate([
      {
        $match: {
          isDeleted: false,
          assignedTo: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          assignedCases: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "officer",
        },
      },
      {
        $unwind: "$officer",
      },
      {
        $project: {
          _id: 0,
          officer: {
            $ifNull: ["$officer.fullName", "$officer.username"],
          },
          role: "$officer.role",
          assignedCases: 1,
        },
      },
      {
        $sort: {
          assignedCases: -1,
        },
      },
    ]);

    return successResponse(
      res,
      200,
      "Officer workload retrieved successfully.",
      workload,
      {
        count: workload.length,
      },
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

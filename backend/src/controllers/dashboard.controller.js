 const Case = require("../models/Case");

const CaseHistory = require("../models/CaseHistory");
const {
    successResponse,
    errorResponse,
} = require("../helpers/response.helper");

 exports.getRecentActivity = async (req, res) => {
  try {

    const activities = await CaseHistory.find()
      .populate("performedBy", "fullName username role")
      .populate("case", "caseNumber")
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedActivities = activities.map(activity => ({
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

    return res.status(200).json({
      success: true,
      count: formattedActivities.length,
      data: formattedActivities,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });

  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalCases = await Case.countDocuments({ isDeleted: false });

    const reportedCases = await Case.countDocuments({
      status: "Reported",
      isDeleted: false,
    });

    const assignedCases = await Case.countDocuments({
      status: "Assigned",
      isDeleted: false,
    });

    const underInvestigation = await Case.countDocuments({
      status: "Under Investigation",
      isDeleted: false,
    });

    const resolvedCases = await Case.countDocuments({
      status: "Resolved",
      isDeleted: false,
    });

    const closedCases = await Case.countDocuments({
      status: "Closed",
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalCases,
        reportedCases,
        assignedCases,
        underInvestigation,
        resolvedCases,
        closedCases,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};

exports.getCasesByCategory = async (req, res) => {
  try {

    const categories = await Case.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred."
    });

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

    return res.status(200).json({
      success: true,
      data: counties,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });

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

    const formattedData = monthlyCases.map(item => ({
      year: item._id.year,
      month: monthNames[item._id.month],
      cases: item.cases,
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });

  }
};

exports.getOfficerWorkload = async (req, res) => {
  try {

    const workload = await Case.aggregate([
      {
        $match: {
          isDeleted: false,
          assignedTo: { $ne: null },
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
            $ifNull: [
              "$officer.fullName",
              "$officer.username",
            ],
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

    return res.status(200).json({
      success: true,
      data: workload,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });

  }
};

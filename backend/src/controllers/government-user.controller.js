const User = require("../models/User");
const GovernmentProfile = require("../models/GovernmentProfile");
const CitizenProfile = require("../models/CitizenProfile");
const GovernmentUserService = require("../services/government-user.service");

const {
  successResponse,
  errorResponse,
} = require("../helpers/response.helper");

exports.getAllGovernmentUsers = async (req, res) => {
 
  try {
    const result = await GovernmentUserService.getAll(req.query);
    return successResponse(
      res,
      "Government users retrieved successfully.",
      result.data,
      200,
      result.meta,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
    );
  }
};

exports.getGovernmentUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorResponse(res, "Government user not found.", 404);
    }

    const profile = await GovernmentProfile.findOne({
      userId,
    });

    if (!profile) {
      return errorResponse(
        res,

        "Government profile not found.",
        404,
      );
    }

    const governmentUser = {
      userId: user._id,

      username: user.username,

      role: user.role,

      status: user.status,

      personalNumber: profile.personalNumber,

      nationalId: profile.nationalId,

      fullName: profile.fullName,

      phoneNumber: profile.phoneNumber,

      email: profile.email,

      designation: profile.designation,

      county: profile.county,

      subCounty: profile.subCounty,

      division: profile.division,

      location: profile.location,

      subLocation: profile.subLocation,

      village: profile.village,
    };

    return successResponse(
      res,
      "Government user retrieved successfully.",
      governmentUser,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateGovernmentUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      role,
      personalNumber,
      nationalId,
      fullName,
      phoneNumber,
      email,
      designation,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
    } = req.body;

    // User
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, "Government user not found.", 404);
    }

    // Profile
    const profile = await GovernmentProfile.findOne({
      userId,
    });

    if (!profile) {
      return errorResponse(res, "Government profile not found.", 404);
    }

    // Duplicate Personal Number
    const existingPersonalNumber = await GovernmentProfile.findOne({
      personalNumber,
      userId: { $ne: userId },
    });

    if (existingPersonalNumber) {
      return errorResponse(res, "Personal Number already exists.", 409);
    }

    // Duplicate Government National ID
    const existingGovernmentNationalId = await GovernmentProfile.findOne({
      nationalId,
      userId: { $ne: userId },
    });

    if (existingGovernmentNationalId) {
      return errorResponse(res, "National ID already exists.", 409);
    }

    // Duplicate Citizen National ID
    const existingCitizenNationalId = await CitizenProfile.findOne({
      nationalId,
    });

    if (
      existingCitizenNationalId &&
      existingCitizenNationalId.nationalId !== profile.nationalId
    ) {
      return errorResponse(res, "National ID already exists.", 409);
    }

    // Update User
    user.role = role;

    await user.save();

    // Update Government Profile
    profile.personalNumber = personalNumber;
    profile.nationalId = nationalId;
    profile.fullName = fullName;
    profile.phoneNumber = phoneNumber;
    profile.email = email;
    profile.designation = designation;
    profile.county = county;
    profile.subCounty = subCounty;
    profile.division = division;
    profile.location = location;
    profile.subLocation = subLocation;
    profile.village = village;

    await profile.save();

    return successResponse(res, "Government user updated successfully.", {
      userId: user._id,
      username: user.username,
      role: user.role,
      personalNumber: profile.personalNumber,
      nationalId: profile.nationalId,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      designation: profile.designation,
      county: profile.county,
      subCounty: profile.subCounty,
      division: profile.division,
      location: profile.location,
      subLocation: profile.subLocation,
      village: profile.village,
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.toggleGovernmentUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, "Government user not found.", 404);
    }

    if (user.userType !== "Government") {
      return errorResponse(res, "Invalid government user.", 400);
    }

    user.status = user.status === "Active" ? "Suspended" : "Active";

    await user.save();

    return successResponse(
      res,
      `User ${user.status.toLowerCase()} successfully.`,
      {
        userId: user._id,
        status: user.status,
      },
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

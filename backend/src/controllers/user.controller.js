const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  isStrongPassword,
  PASSWORD_POLICY,
} = require("../utils/password.validators");
const asyncHandler = require("../middleware/asyncHandler");
const {
  successResponse,
  errorResponse,
} = require("../helpers/response.helper");
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return errorResponse(res, 404, "User not found.");
  }

  return successResponse(res, 200, "Profile retrieved successfully.", user);
});

 exports.updateProfile = asyncHandler(async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    phone,
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return errorResponse(
      res,
      404,
      "User not found."
    );
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  await user.save();

  return successResponse(
    res,
    200,
    "Profile updated successfully.",
    user
  );

});

 exports.changePassword = asyncHandler(async (req, res) => {

  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return errorResponse(
      res,
      404,
      "User not found."
    );
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    return errorResponse(
      res,
      400,
      "Current password is incorrect."
    );
  }

  if (newPassword !== confirmPassword) {
    return errorResponse(
      res,
      400,
      "Passwords do not match."
    );
  }

  if (!isStrongPassword(newPassword)) {
    return errorResponse(
      res,
      400,
      PASSWORD_POLICY
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();

  return successResponse(
    res,
    200,
    "Password changed successfully."
  );

});
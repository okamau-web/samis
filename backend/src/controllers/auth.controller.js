const User = require("../models/User");
const GovernmentProfile = require("../models/GovernmentProfile");
const CitizenProfile = require("../models/CitizenProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 const {
  isStrongPassword,
  PASSWORD_POLICY,
} = require("../utils/password.validators");
const {
    successResponse,
    errorResponse,
} = require("../helpers/response.helper");

exports.register = async (req, res) => {
  try {
    const {
      password,
      userType,
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

      gender,
      dateOfBirth,
      ward,
    } = req.body;
    // 2. automatic generating username based on personalNumber for Government and nationalId for Citizen
    const username = userType === "Government"? personalNumber : nationalId;
    // Basic validation
     if (!password || !userType || !role) {
  return res.status(400).json({
    success: false,
    message: "Password, userType and role are required.",
  });
}

    if (userType === "Government") {
      if (
        !personalNumber ||
        !nationalId ||
        !fullName ||
        !phoneNumber ||
        !designation ||
        !county ||
        !subCounty ||
        !division ||
        !location ||
        !subLocation
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required government officer details.",
        });
      }
    }
    if (userType === "Citizen") {
      if (
        !nationalId ||
        !fullName ||
        !phoneNumber ||
        !gender ||
        !county ||
        !ward
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required citizen details.",
        });
      }
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    if (userType === "Government") {
      const existingPersonalNumber = await GovernmentProfile.findOne({
        personalNumber,
      });

      if (existingPersonalNumber) {
        return res.status(409).json({
          success: false,

          message: "Personal Number already exists.",
        });
      }
    }

    // Check National ID in Government Profiles
    const existingGovernmentNationalId = await GovernmentProfile.findOne({
      nationalId,
    });

    if (existingGovernmentNationalId) {
      return res.status(409).json({
        success: false,

        message: "National ID already exists.",
      });
    }

    // Check National ID in Citizen Profiles
    const existingCitizenNationalId = await CitizenProfile.findOne({
      nationalId,
    });

    if (existingCitizenNationalId) {
      return res.status(409).json({
        success: false,

        message: "National ID already exists.",
      });
    }
    //password validors


if (!isStrongPassword(password)) {
  return res.status(400).json({
    success: false,
    message: PASSWORD_POLICY,
  });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create authentication user
    const user = await User.create({
      username,

      password: hashedPassword,

      userType,

      role,
    });
    // Create profile based on user type
    if (userType === "Government") {
      await GovernmentProfile.create({
        userId: user._id,

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
      });
    }
    if (userType === "Citizen") {
      await CitizenProfile.create({
        userId: user._id,

        nationalId,

        fullName,

        gender,

        dateOfBirth,

        phoneNumber,

        email,

        county,

        ward,

        village,
      });
    }

    return res.status(201).json({
      success: true,

      message: "User registered successfully.",

      data: {
        userId: user._id,

        username: user.username,

        userType: user.userType,

        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 
 exports.login = async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(
        res,
        "Username and password are required.",
        400
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return errorResponse(
        res,
        "Invalid username or password.",
        401
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return errorResponse(
        res,
        "Invalid username or password.",
       401
      );
    }
let profile = null;

if (user.userType === "Government") {

  profile = await GovernmentProfile.findOne({
    userId: user._id
  });

}
    // Prevent suspended users from logging in
    if (user.status === "Suspended") {
      return errorResponse(
        res,
        "Your account has been suspended. Please contact the system administrator.",
        403
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

  
  return successResponse(
  res,
  "Login successful.",
  {
    token,
    userId: user._id,
    username: user.username,
    role: user.role,
    userType: user.userType,
    profile
  }
);

  } catch (error) {

    return errorResponse(
      res,
      error.message
    );

  }
};

const express = require("express");

const router = express.Router();

const governmentUserController = require("../controllers/government-user.controller");

const auth = require("../middleware/auth.middleware");

router.get(
  "/",
  auth.verifyToken,
  auth.authorize(
    "superAdmin",
    "CC",
    "DCC",
    "ACC"
  ),
  governmentUserController.getAllGovernmentUsers
);

router.get(
  "/:userId",
  auth.verifyToken,
  auth.authorize(
    "superAdmin",
    "CC",
    "DCC",
    "ACC"
  ),
  governmentUserController.getGovernmentUserById
);

router.put(
  "/:userId",
   auth.verifyToken,
  auth.authorize(
    "superAdmin",
    "CC",
    "DCC",
    "ACC"
  ),
  governmentUserController.updateGovernmentUser
);

router.patch(
  "/:userId/status",
  governmentUserController.toggleGovernmentUserStatus
);
module.exports = router;
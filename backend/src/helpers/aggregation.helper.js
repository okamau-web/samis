// Government Profile lookup.

exports.lookupGovernmentProfile = () => [
  {
    $lookup: {
      from: "governmentprofiles",

      localField: "_id",

      foreignField: "userId",

      as: "profile",
    },
  },

  {
    $unwind: "$profile",
  },
];

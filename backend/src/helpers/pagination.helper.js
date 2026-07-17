 /**
 * Builds a MongoDB $facet stage for pagination.
 */

exports.buildPaginationFacet = (
  page = 1,
  limit = 10,
  project = {}
) => ({

  metadata: [
    {
      $count: "total",
    },
  ],

  data: [
    {
      $skip: (page - 1) * limit,
    },

    {
      $limit: limit,
    },

    {
      $project: project,
    },
  ],

});
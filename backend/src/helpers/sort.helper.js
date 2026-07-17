// Builds a MongoDB sort stage.
 

exports.buildSortStage = (

    sortBy = "createdAt",

    sortOrder = "desc"

) => ({

    $sort: {

        [sortBy]: sortOrder === "asc" ? 1 : -1

    }

});
 exports.buildSortStage = (
    sortBy = "createdAt",
    sortOrder = "desc",
    sortFields = {}
) => {

    const field = sortFields[sortBy] || sortBy;

    return {
        $sort: {
            [field]: sortOrder === "asc" ? 1 : -1
        }
    };

};
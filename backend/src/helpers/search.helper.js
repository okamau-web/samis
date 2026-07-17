// Builds a MongoDB search stage.
 

exports.buildSearchStage = (fields = [], search = "") => {

    if (!search || !search.trim()) {

        return null;

    }

    return {

        $match: {

            $or: fields.map(field => ({

                [field]: {

                    $regex: search,

                    $options: "i"

                }

            }))

        }

    };

};
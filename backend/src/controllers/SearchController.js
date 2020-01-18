const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res) {

       const techsArray = parseStringAsArray(techs);

       const devs = await Dev.find({
           techs: {
                $in: techsArray,
           },
           location:
           { $near :
              {
                $geometry: { type: "Point",  coordinates: [longitude, latitude] },
                $minDistance: 0,
                $maxDistance: 50000
              }
           }
        });
        return res.json({ devs });
    }
}
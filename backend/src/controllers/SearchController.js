const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res) {
      console.log('index in search: ', req.query);
      const techsArray = parseStringAsArray(req.query.techs);

      const devs = await Dev.find({
          techs: {
              $in: techsArray,
          },
          location:
          { $near :
            {
              $geometry: { type: "Point",  coordinates: [req.query.longitude, req.query.latitude] },
              $minDistance: 0,
              $maxDistance: 50000
            }
          }
      });
      console.log('devs:', devs);
      return res.json({ devs });
    }
}
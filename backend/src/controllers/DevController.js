const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, store, update, destroy, findConnections
module.exports = {
    async index(req, res) {
        console.log('index!');

        const devs = await Dev.find();

        return res.json(devs);
    },
    async store(req, res) {
        console.log('store!');

        const { github_username, techs, latitude, longitude } = req.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio } = response.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            // Filtrar as connections ques estao no maximo 10km de distancia
            // e que o novo dev tenha pelo menos uma das techs filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )
            // test
            // console.log(sendSocketMessageTo); 
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return res.json(dev);

    },
    async udpate(req, res) {
        console.log('update: ', req.body);

        const { id } = req.params;

        const { name, bio, techs, avatar_url } = req.body;

        const location = {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude],
        };

        try {
            const dev = await Dev.updateOne(
                { "_id"       : id },
                { "name"      : name, 
                  "bio"       : bio,
                  "techs"     : techs, 
                  "avatar_url": avatar_url, 
                  "location"  : location
                }
            )
            return res.json( dev );
        } catch(error) {
            return res.json(error);
        }
    },
    async destroy(req, res) {
        console.log('destroy: ', req.body);

        const { github_username } = req.body;

        const dev = await Dev.deleteOne({
            github_username
        })
        return res.json(dev.deletedCount);
    },
    async show(req, res) {
        console.log('show: ', req.params.id);
        const id = req.params.id;
        let dev = await Dev.findOne(
            {_id: id}, function (err, dev) {
                return res.json(dev);
            }, (err) => {
                return res.json(err);
            }
        );
    },
};
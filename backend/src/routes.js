const { Router } = require('express');
const DevControllers = require('./controllers/DevController');
const SeachController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevControllers.index);

routes.post('/devs', DevControllers.store);

routes.get('/search', SeachController.index);

routes.put('/update/:id', DevControllers.udpate);

routes.delete('/destroy', DevControllers.destroy);

routes.get('/show/:id', DevControllers.show);

module.exports = routes; 

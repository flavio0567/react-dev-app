const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

const connections = [];

let io;
exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        // test
        // console.log(socket.id);
        // console.log(socket.handshake.query);

        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
                techs: parseStringAsArray(techs),
        });

        // test 
        // setTimeout(() => {
        //     socket.emit('message', 'hello Omnistack!')
        // }, 3000);
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item));  // pelo menos uma das techs existe
    });
};

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
}
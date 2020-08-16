let url = require('url');
const Hapi = require('@hapi/hapi');
let Wreck = require('wreck');

let server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
});



const getInstagram = function(next) {
    let instagramURL = 'https://api.instagram.com/...';
    Wreck.get(instagramURL, null, function(err, res, payload) {
        if (err) {return next(err); }
        if (res.statusCode !== 200) {
            return next(res.statusCode);
        }
        return next(null, JSON.parse(payload));
    });
};


server.route({ method: 'GET', path: '/instagram.json',
    handler: function(request, reply) {
        return server.method.getInstagram( function(error, result) {
            if (error) { return reply({ error: error}).code(500); }
            return reply(result);
        });
    }, config: {
        cors: true,
        cache: { expiresIn: 60 * 60 * 1000, privacy: 'private' }
    }
});

server.method('getInstagram', getInstagram, {
    cache: {
        expiresIn: 60 * 60 * 1000,
        staleIn: 60 * 1000,
        staleTimeout: 100,
        generateTimeout: 100
    }
});

server.start( function() {
    console.log('Server runining at: ', server.info.uri);
});
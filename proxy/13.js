(function() {
    'use strict';
    var Hapi, Wreck, getInstagram, server, url;
  
    url = require('url');
  
  
    Wreck = require('wreck');
  
    Hapi = require('hapi');
  
    getInstagram = function(next) {
      var clientID, instagramURL;
      clientID = process.env.INSTAGRAM_CLIENT_ID || '';
      instagramURL = ['https://api.instagram.com/v1/users/234016235/media/recent', "?client_id=" + clientID, '&count=12'].join('');
      Wreck.get(instagramURL, null, function(err, res, payload) {
        console.log('Getting Instagram data...');
        if (err) {
          return next(err);
        }
        if (res.statusCode !== 200) {
          return next(res.statusCode);
        }
        return next(null, JSON.parse(payload));
      });
    };
  
    server = new Hapi.Server();
  
    server.connection({
      port: process.env.PORT || 3000
    });
  
    server.method('getInstagram', getInstagram, {
      cache: {
        expiresIn: 60 * 60 * 1000,
        staleIn: 60 * 1000,
        staleTimeout: 100
      }
    });
  
    server.route({
      method: 'GET',
      path: '/instagram.json',
      handler: function(request, reply) {
        return server.methods.getInstagram(function(error, result) {
          if (error) {
            return reply({
              error: error
            }).code(500);
          }
          return reply(result);
        });
      },
      config: {
        cors: true,
        cache: {
          expiresIn: 60 * 60 * 1000,
          privacy: 'private'
        }
      }
    });
  
    server.start(function() {
      return console.log('Server running at:', server.info.uri);
    });
  
  }).call(this);
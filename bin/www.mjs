#!/usr/bin/env node

/**
 * Module dependencies.
 */

 import app from '../app.mjs';
 import debug from 'debug';
 debug('vr-streaming-proxy:server');
 import http from 'http';
 
 /**
  * SSDP Server
  */
 
 import node_ssdp from 'node-ssdp';
 const ssdp_server = new node_ssdp.Server({
     location: {
         port: 3000,
         path: '/description.xml'
     }
 });
 
 ssdp_server.addUSN('upnp:rootdevice');
 ssdp_server.addUSN('urn:schemas-upnp-org:device:MediaServer:1');
 ssdp_server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1');
 //ssdp_server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1');
 
 // start server on all interfaces
 ssdp_server.start()
   .catch(e => {
     console.log('Failed to start server:', e)
   })
   .then(() => {
     console.log('Server started.')
   })
 
 process.on('exit', function(){
     ssdp_server.stop() // advertise shutting down and stop listening
 })
 
 /**
  * Get port from environment and store in Express.
  */
 
 var port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 
 var server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
     var port = parseInt(val, 10);
 
     if (isNaN(port)) {
         // named pipe
         return val;
     }
 
     if (port >= 0) {
         // port number
         return port;
     }
 
     return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
     if (error.syscall !== 'listen') {
         throw error;
     }
 
     var bind = typeof port === 'string'
         ? 'Pipe ' + port
         : 'Port ' + port;
 
     // handle specific listen errors with friendly messages
     switch (error.code) {
         case 'EACCES':
             console.error(bind + ' requires elevated privileges');
             process.exit(1);
             break;
         case 'EADDRINUSE':
             console.error(bind + ' is already in use');
             process.exit(1);
             break;
         default:
             throw error;
     }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
     var addr = server.address();
     var bind = typeof addr === 'string'
         ? 'pipe ' + addr
         : 'port ' + addr.port;
     debug('Listening on ' + bind);
 }
 
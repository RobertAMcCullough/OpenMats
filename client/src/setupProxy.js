// //for dev only - for links and cors issues between port 3000 and 5000

// const proxy = require('http-proxy-middleware')

// module.exports = function(app) {
//     app.use(proxy('/auth/google', {target: 'http://localhost:5000'}));
//     app.use(proxy('/api/**', {target: 'http://localhost:5000'}));
// }

//this is for dev only - for links and cors issues

const proxy = require('http-proxy-middleware');
 
module.exports = function(app) {
    app.use(proxy('/auth/**', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/**', { target: 'http://localhost:5000' }));
};
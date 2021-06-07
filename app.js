import app from './config/express';
/* eslint-disable no-unused-vars */
// import db from './config/sequelize';
import config from './config/config';

const debug = require('debug')('anchoring-api:index');
/* eslint-enable no-unused-vars */

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// module.parent check is required to support mocha watch
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        console.log(`server started on port ${config.port} (${config.env})`);
    });
}

export default app;

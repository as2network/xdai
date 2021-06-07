// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mysql: {
        db: process.env.MYSQL_DB,
        port: process.env.MYSQL_PORT,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        passwd: process.env.MYSQL_PASSWD,
    },
    provider_url: process.env.PROVIDER_URL,
    contract_address: process.env.CONTRACT_ADDRESS,
    private_key: process.env.PRIVATE_KEY,
    address: process.env.ADDRESS
};

export default config;

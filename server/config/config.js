
let env = process.env.NODE_ENV || "development";
console.log('env ******* ', env);

if(env === "development" || env === "test"){
    let config = require('./config.json');

    let configEnv = config[env];
    Object.keys(configEnv).forEach( (key) => {
        process.env[key] = configEnv[key];
    });

}

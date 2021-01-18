const models = require('./index');

module.exports = () => {
    const options = {
        force : process.env.NODE_ENV === 'development' ? true : false
    }
    return models.sequelize.sync(options);
}
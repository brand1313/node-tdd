module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users',{
        name: {
            type : DataTypes.STRING(20),
            unique: true
        }
    })
}

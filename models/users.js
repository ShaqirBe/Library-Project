module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {

        FirstName: Sequelize.DataTypes.STRING,
        LastName: Sequelize.DataTypes.STRING,
        Username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Password: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Role: {
           type: Sequelize.DataTypes.STRING,
           defaultValue: "member" 
        }
    },{
        timestamps: false
    });
    User.associate = function(models) {
        User.hasMany(models.Borrow, { foreignKey: 'userId' });
    };
	return User
}
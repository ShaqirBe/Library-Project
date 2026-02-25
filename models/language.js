module.exports = (sequelize, DataTypes) => {
    const Language = sequelize.define('Language', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING
    },
    {
        timestamps: false 
    });
    Language.associate = function(models) {
        Language.belongsToMany(models.Book, { through: 'BookLanguages' });
    };

    return Language;
};
module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genre', {
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
    Genre.associate = function(models) {
        Genre.hasMany(models.Book, { foreignKey: 'genreId' });
    };

    return Genre;
};
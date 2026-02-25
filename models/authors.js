module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define('Author', {
        
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        name: DataTypes.STRING
    },{
        timestamps: false
    });

    Author.associate = function(models) {
         Author.hasMany(models.Book, { foreignKey: 'authorId' });
    };
    return Author;
};
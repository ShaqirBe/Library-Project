module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        publisher: DataTypes.STRING,
        year: DataTypes.INTEGER,
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        genreId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        borrowed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        
        
    },{
        timestamps: false
    });
    Book.associate = function(models) {
        Book.belongsTo(models.Author, { foreignKey: 'authorId' });
        Book.belongsTo(models.Genre, { foreignKey: 'genreId' });
        Book.belongsToMany(models.Language, { through: 'BookLanguages' });
        Book.hasMany(models.Borrow, { foreignKey: 'bookId' });
    };
    return Book;
};

module.exports = (sequelize, DataTypes) => {
    const Borrow = sequelize.define('Borrow', {
        
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        borrowDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        
        returnDate: {
            type: DataTypes.DATE,
            allowNull: true 
        }
    });

    Borrow.associate = function(models) {
        Borrow.belongsTo(models.User, { foreignKey: 'userId' });
        Borrow.belongsTo(models.Book, { foreignKey: 'bookId' });
    };

    return Borrow;
};
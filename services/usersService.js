const bcrypt = require('bcryptjs');

class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    
    }

    async create(firstName, lastName, username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.User.create(
            {
                FirstName: firstName,
                LastName: lastName,
                Username: username,
                Password: hashedPassword
            }
        ) 
    }

    async getAll() {
        return this.User.findAll({
            where: {}
        })
    }
    async getOne(userId) {        
        return await this.User.findOne({
            where: {
                id: userId
            }
        });
    }
    async getOneByName(username) {        
        return await this.User.findOne({
            where: {
                Username: username
            }
        });
    }
    async changeFirstName(userId, firstName) {
        return this.User.update({ FirstName: firstName }, { where: { id: userId } })
    }


    async deleteUser(userId) {
        return this.User.destroy({
            where: {id: userId}
        })
    }
}
module.exports = UserService;

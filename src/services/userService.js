import User from "../models/userModel.js";

class UserService{
    async create(user) {
        const createdUser = await User.create(user)
        return createdUser;
    }
    async getAll(){
        const allUsers = await User.findAll();
        return allUsers;
    }
    async getOne(id){
        if(!id) throw new Error("id is required");
        const foundUser = await User.findByPk(id);
        return foundUser;
    }
    async update(user) {
        const existingUser = await User.findByPk(user.id)
        if(!existingUser){throw new Error("User does not exist")}
        await existingUser.update(user)
        return existingUser;
    }

    async delete(id){
        const deletedUser = await User.findByPk(id);
        if(!deletedUser){throw new Error("User does not exist")}
        await deletedUser.destroy();
        return deletedUser;
    }
}

export default new UserService();
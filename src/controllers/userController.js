import UserService from "../services/userService.js";

class UserController{
    async create(req, res){
       try {
           const user = await UserService.create(req.body);
           res.status(201).json(user);
       }catch (error) {
           res.status(500).json({message: 'Error creating users'});
       }
    }
    async getAll(req,res){
        try {
            const users = await UserService.getAll();
            return res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({message: 'Error getting users'});
        }
    }

    async getOne(req, res) {
        try {
            const user = await UserService.getOne(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error getting user' });
        }
    }
    async update(req,res){
        try {
            const user = req.body;
            if(!await UserService.getOne(user.id)){
                return res.status(404).json({ message: 'No user found with this id' });
            }
            const updatedUser = await UserService.update(user);
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            res.status(500).json({message: 'Error updating user'});
        }
    }
    async delete(req,res){
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const foundUser = await UserService.delete(id);
            return res.status(200).json({message:'User deleted'});
        }
        catch (error) {
            res.status(500).json({message: 'Error deleting user'});
        }
    }
}

export default UserController;
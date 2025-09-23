import { UserRepository } from "../repositories/userRepository.js";
// Utilisation de l'inférence TypeScript pour le type Todo
export class UserService {
    mnrepo;
    constructor() {
        this.mnrepo = new UserRepository();
    }
    getAllUsers() {
        return this.mnrepo.findAll();
    }
    findUserById(id) {
        return this.mnrepo.findById(id);
    }
    createUser(data) {
        return this.mnrepo.create(data);
    }
    updateUser(id, data) {
        return this.mnrepo.update(id, data);
    }
    async deleteUser(id) {
        await this.mnrepo.delete(id);
    }
}
//# sourceMappingURL=userService.js.map
import { UserRepository } from "../repositories/userRepository.js";
// Utilisation de l'inférence TypeScript pour le type Todo

export class UserService {
    private mnrepo: UserRepository;

    constructor() {
        this.mnrepo = new UserRepository();
    }

    getAllUsers() {
        return this.mnrepo.findAll();
    }

    findUserById(id: number) {
        return this.mnrepo.findById(id);
    }

    createUser(data: any) {
        return this.mnrepo.create(data);
    }

    updateUser(id: number, data: any) {
        return this.mnrepo.update(id, data);
    }

    async deleteUser(id: number): Promise<void> {
        await this.mnrepo.delete(id);
    }

}
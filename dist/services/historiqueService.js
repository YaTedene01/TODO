import { HistoriqueRepository } from '../repositories/historiqueRepository.js';
export class HistoriqueService {
    mnrepo;
    constructor() {
        this.mnrepo = new HistoriqueRepository();
    }
    async findAll() {
        return await this.mnrepo.findAll();
    }
    async findById(id) {
        return await this.mnrepo.findById(id);
    }
    async create(data) {
        return await this.mnrepo.create(data);
    }
    async update(id, data) {
        return await this.mnrepo.update(id, data);
    }
    async delete(id) {
        return await this.mnrepo.delete(id);
    }
}
//# sourceMappingURL=historiqueService.js.map
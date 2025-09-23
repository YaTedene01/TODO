import type { Historique } from '@prisma/client';
import { HistoriqueRepository } from '../repositories/historiqueRepository.js';

export class HistoriqueService {

    private mnrepo: HistoriqueRepository;
	constructor() {
		this.mnrepo = new HistoriqueRepository();
	}

	async findAll() {
		return await this.mnrepo.findAll();
	}

	async findById(id: number) {
		return await this.mnrepo.findById(id);
	}

	async create(data: Omit<Historique, "id">) {
		return await this.mnrepo.create(data);
	}

	async update(id: number, data: Partial<Omit<Historique, "id">>) {
		return await this.mnrepo.update(id, data);
	}

	async delete(id: number) {
		return await this.mnrepo.delete(id);
	}
}

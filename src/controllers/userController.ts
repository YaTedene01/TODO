import type { Request, Response } from "express";
import { UserService } from "../services/userService.js";
import { CreateTodoSchema } from "../validators/todoSchema.js"; 
import { CreateUserSchema } from "../validators/userSchema.js";
import { ErrorMessages } from "../utils/errorMessage.js";
import { HttpStatus } from "../utils/httpStatus.js";
import { UserRepository } from '../repositories/userRepository.js';

const mnservice = new UserService();

export class UserController {
    static async uploadImage(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const file = (req as any).file as Express.Multer.File | undefined;
            if (!file) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: ErrorMessages.USER_IMAGE_REQUIRED });
            }
            const imageUrl = `/assets/${file.filename}`;
            const mnuser = await mnservice.updateUser(id, { imageUrl });
            res.json({ message: ErrorMessages.USER_IMAGE_UPLOADED, imageUrl, user: mnuser });
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
   
    static async getAll(_req: Request, res: Response) {
        try {
            const mnusers = await mnservice.getAllUsers();
            const usersWithImageUrl = mnusers.map((user: any) => ({
                ...user,
                imageUrl: user.imageUrl ? `${_req.protocol}://${_req.get('host')}${user.imageUrl}` : null
            }));
            res.json(usersWithImageUrl);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.SERVER_ERROR });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const mnuser = await mnservice.findUserById(id);
            if (!mnuser) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.USER_NOT_FOUND });
            }
            let imageUrl = mnuser.imageUrl ? `${req.protocol}://${req.get('host')}${mnuser.imageUrl}` : null;
            return res.json({ ...mnuser, imageUrl });
        } catch (error: any) {
           return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    
    static async create(req: Request, res: Response) {
        try {
            let mndata = req.body;
            if ((req as any).file) {
                mndata.imageUrl = `/assets/${(req as any).file.filename}`;
            }
            mndata = CreateUserSchema.parse(mndata);
            const mnuser = await mnservice.createUser(mndata);
            res.status(HttpStatus.CREATED).json({
                message: 'Utilisateur créé avec succès',
                user: mnuser
            });
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json({ errors });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const mndata = CreateUserSchema.parse(req.body);
            const mnuser = await mnservice.updateUser(id, mndata);
            res.json(mnuser);
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json({ errors });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await mnservice.deleteUser(id);
            res.status(HttpStatus.NO_CONTENT).send();
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async getSharedTodos(req: Request, res: Response) {
        try {
            const userId = Number(req.params.id);
            // Utilise la méthode getSharedTodos du UserRepository via une instance
            const userRepo = new UserRepository();
            const todos = await userRepo.getSharedTodos(userId);
            res.json(todos);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}
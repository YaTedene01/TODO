import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import todoroute from "./routes/todoRoute.js";
import { todoController } from "./controllers/todoController.js";
import { requireAuth } from "./middlewares/requireAuth.js";
import userroute from "./routes/userRoute.js";
import authroute from "./routes/authRoute.js";
import historiqueRouter from "./routes/historiqueRoute.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../assets'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    })
});
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use("/assets", express.static("assets"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo API",
            version: "1.0.0",
            description: "API pour la gestion des todos"
        },
        servers: [
            { url: "http://localhost:3010" }
        ]
    },
    apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const port = 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Route POST /api/todo/upload pour création avec image
app.post('/api/todo/upload', requireAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
    try {
    const { title, description, completed, endTime } = req.body;
        const userId = (req as any).user?.id;
        if (!title) return res.status(400).json({ error: 'Le titre est requis.' });
        let imageUrl = undefined;
        let audioUrl = undefined;
        if (req.files && (req.files as any).image && (req.files as any).image[0]) {
            imageUrl = `/assets/${(req.files as any).image[0].filename}`;
        }
        if (req.files && (req.files as any).audio && (req.files as any).audio[0]) {
            audioUrl = `/assets/${(req.files as any).audio[0].filename}`;
        }
        let endTimeValue = undefined;
        if (endTime) {
            const dt = new Date(endTime);
            if (!isNaN(dt.getTime())) {
                endTimeValue = dt.toISOString();
            }
        }
        const todoData: any = {
            title,
            description,
            completed: completed === 'true' || completed === true,
            userId,
            imageUrl,
            audioUrl,
            endTime: endTimeValue
        };
        const mntodo = await todoController.createDirect(todoData);
        res.status(201).json(mntodo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
app.use('/api/todo', todoroute);
app.use('/api/user', userroute);
app.use('/api/auth', authroute);
app.use('/api/historique', historiqueRouter);

app.get('/', (req, res) => {
  res.send('API TODO en ligne');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import todoroute from "./routes/todoRoute.js";
import userroute from "./routes/userRoute.js";
import authroute from "./routes/authRoute.js";
import historiqueRouter from "./routes/historiqueRoute.js";
const app = express();
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/todo', todoroute);
app.use('/api/user', userroute);
app.use('/api/auth', authroute);
app.use('/api/historique', historiqueRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

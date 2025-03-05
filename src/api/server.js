import express from 'express';
import sequelize from './sequelize.js';
import trackRouter from './routes/trackRoutes.js';
import fileUpload from 'express-fileupload'
import cors from 'cors';
import usersRouter from "./routes/usersRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use('/trackRouter', trackRouter );
app.use('/userRouter', usersRouter)

async function startApp() {
    try {
        await sequelize.authenticate();
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    } catch (e) {
        console.error(e);
    }
}

startApp();
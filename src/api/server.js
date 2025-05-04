import express from 'express';
import sequelize from './sequelize.js';
import trackRouter from './routes/trackRoutes.js';
import fileUpload from 'express-fileupload'
import cors from 'cors';
import usersRouter from "./routes/usersRoutes.js";
import playlistRouter from "./routes/playlistRoutes.js";
import artistRouter from "./routes/artistRoutes.js";
import albumRouter from "./routes/albumRoutes.js";
import genreRouter from "./routes/genreRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use('/trackRouter', trackRouter );
app.use('/userRouter', usersRouter)
app.use('/playlistRouter', playlistRouter)
app.use('/albumRouter', albumRouter);
app.use('/artistRouter', artistRouter)
app.use('/genreRouter', genreRouter);

async function startApp() {
    try {
        await sequelize.authenticate();
        sequelize.sync().catch((err) => {console.log(err + "\nSync Error")});
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    } catch (e) {
        console.error(e);
    }
}

startApp();
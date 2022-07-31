import express from "express";
import chalk from "chalk";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidator } from "./validations/auth.js";
import { loginValidator } from "./validations/login.js";
import { postCreateValidator } from "./validations/posts.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";
import 'dotenv/config';

//Подключение базы
/* Название между / и ? в методе connect скажет монгузу, что надо
подключиться не только к серверу, но и к конкретной базе*/
mongoose
	.connect(`${process.env.REACT_APP_MONGO}`)
	.then(() => console.log(chalk.greenBright("DB was connected")))
	.catch((error) => console.log(chalk.redBright("DB connection failed", error)));

const PORT = 3010;
const app = express(); //Инициализация

//Создаем хранилище картинок
const storage = multer.diskStorage({
	//Путь
	destination: (_, __, cb) => {
		//Колбэк не получает никаких ошибок и загружает все картинки в папку 'uploads'
		cb(null, "uploads");
	},

	//Название файла
	filename: (_, file, cb) => {
		//Вытаскиваем оригинальное название файла
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });

app.use(express.json());//Обработка JSON
app.use(cors());//Разрешаем CORS

/*Когда придет запрос на /uploads, express должен
зайти в статичную папку и в ней искать файл
(Мы делаем запрос на получение статичного файла)*/
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
	res.send("New project!");
});

app.get("/users", UserController.getAllUsers);

app.post(
	"/auth/login",
	loginValidator,
	handleValidationErrors,
	UserController.login
);
app.post(
	"/auth/register",
	registerValidator,
	handleValidationErrors,
	UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
// app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidator,
	handleValidationErrors,
	PostController.create
);//Создаем пост только если юзер авторизован
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidator,
	handleValidationErrors,
	PostController.update
);
app.delete("/posts/:id", checkAuth, PostController.remove);

app.listen(PORT, (error) => {
	if (error) {
		return console.log(chalk.bgRed("Something went wrong"));
	}
	console.log(chalk.bold.green(`Server has been started on ${PORT} port`));
});
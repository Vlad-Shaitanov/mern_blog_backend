import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
	try {

		//Пароль из запроса
		const password = req.body.password;
		//генерация соли
		const salt = await bcrypt.genSalt(10);
		//Создаем зашифрованный пароль
		const hash = await bcrypt.hash(password, salt);

		//Создаем документ (нового юзера)
		const doc = new UserModel({
			email: req.body.email,
			passwordHash: hash,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl
		});

		//Записываем в базу
		const user = await doc.save();

		//Создаем токен 
		const token = jwt.sign({
			_id: user._id
		}, "secret123", {
			expiresIn: "30d", //Время жизни токена
		});

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Регистрация не удалась"
		});
	}
};

export const login = async (req, res) => {
	console.log(req.body);

	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден"
			});
		}

		//Проверяем, совпадают ли пароли в базе и запросе
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if (!isValidPass) {
			return res.status(400).json({
				message: "Неверный логин или пароль"
			});
		}

		//Создаем токен 
		const token = jwt.sign({
			_id: user._id
		}, "secret123", {
			expiresIn: "30d", //Время жизни токена
		});


		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось авторизоваться"
		});
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await UserModel.find();

		res.json(users);
	} catch (error) {
		res.status(500).json({
			message: "Ошибка получения прользователей"
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден"
			});
		}

		const { passwordHash, ...userData } = user._doc;
		res.json(userData);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "/auth/me error"
		});
	}
};
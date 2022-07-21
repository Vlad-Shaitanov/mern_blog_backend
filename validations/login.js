import { body } from "express-validator";

export const loginValidator = [
	body("email", "Неверный формат почты")
		.isEmail(),//Проверяем, что поле email это действительно email
	body("password", "Пароль должен быть минимум 5 символов")
		.isLength({ min: 5 }),

];
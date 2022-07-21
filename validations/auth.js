import { body } from "express-validator";

export const registerValidator = [
	body("email", "Неверный формат почты")
		.isEmail(),//Проверяем, что поле email это действительно email
	body("password", "Пароль должен быть минимум 5 символов")
		.isLength({ min: 5 }),
	body("fullName", "Укажите имя")
		.isLength({ min: 3 }),
	body("avatarUrl", "Неверная ссылка")
		.optional()
		.isURL(), //Опцю поле. Если пришло, проверяем, что это УРЛ
];
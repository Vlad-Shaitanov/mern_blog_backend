import { body } from "express-validator";

export const postCreateValidator = [
	body("title", "Введите заголовок статьи")
		.isLength({ min: 3 })
		.isString(),
	body("text", "Введите текст статьи")
		.isLength({ min: 3 })
		.isString(),
	body("tags", "Неверный формат тэгов (укажите массив)")
		.optional()
		.isArray(),
	body("imageUrl", "Неверная ссылка на изображение")
		.optional()
		.isString(), //Опцю поле. Если пришло, проверяем
];
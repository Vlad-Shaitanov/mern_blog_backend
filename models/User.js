import mongoose from "mongoose";

//Создание схемы для пользователя
const UserSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true, //поле обязательное
	},

	email: {
		type: String,
		required: true,
		unique: true, //должно быть уникальным
	},

	passwordHash: {
		type: String,
		required: true,
	},

	avatarUrl: String
}, {
	timestamps: true, //Будет дата создания и обновления сущности
}
);

//Экспортируем модель
export default mongoose.model("User", UserSchema);
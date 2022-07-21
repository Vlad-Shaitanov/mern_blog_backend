import mongoose from "mongoose";

//Создание схемы для пользователя
const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true, //поле обязательное
	},

	text: {
		type: String,
		required: true,
		unique: true, //должно быть уникальным
	},

	tags: {
		type: Array,
		default: [], //Если тэги не передать, то будет пустой массив
	},

	viewsCount: { // Просмотры поста
		type: Number,
		default: 0,
	},

	user: { //Автор поста
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", //Будет ссылаться на модель "User"(Связь между таблицами)
		required: true,
	},

	imageUrl: String
}, {
	timestamps: true, //Будет дата создания и обновления сущности
}
);

//Экспортируем модель
export default mongoose.model("Post", PostSchema);
import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts.map((obj) => obj.tags).flat().slice(0, 5);

		const uniqTags = [... new Set(tags)];

		res.json(uniqTags);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось получить тэги"
		});
	}
};

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate("user").exec();//Связь с моделью User

		res.json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось получить статьи"
		});
	}
};

export const getOne = async (req, res) => {
	try {

		//Вытаскиваем id из запроса
		const postId = req.params.id;

		/* Ищем пост по id, обновляем в нем просмотры и возвращаем
		актуальный документ*/
		PostModel.findOneAndUpdate(
			{
				_id: postId
			},
			{
				$inc: { //Увеличили на 1 счетчик просмотров
					viewsCount: 1
				}
			},
			{ //После обновления статьи возвращаем актуальный вариант
				returnDocument: "after"
			},
			(err, doc) => {
				if (err) {
					console.warn(err);
					return res.status(500).json({
						message: "Не удалось вернуть статью"
					});
				}

				//Если документа нет(undefined)
				if (!doc) {
					return res.status(404).json({
						message: "Статья не найдена"
					});
				}

				res.json(doc);
			}
		).populate('user');

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось получить статьи"
		});
	}
};

export const create = async (req, res) => {
	try {
		//СОздаем документ (пост)
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			avatarUrl: req.body.avatarUrl,
			tags: req.body.tags,
			user: req.userId
		});

		const post = await doc.save();
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось создать статью"
		});
	}
};

export const remove = async (req, res) => {
	try {
		//Вытаскиваем id из запроса
		const postId = req.params.id;

		PostModel.findByIdAndDelete(
			{
				_id: postId
			},
			(err, doc) => {
				if (err) {
					console.log(error);
					res.status(500).json({
						message: "Не удалось удалить статью"
					});
				}

				//Если документа нет(undefined)
				if (!doc) {
					return res.status(404).json({
						message: "Статья не найдена"
					});
				}

				res.json({
					message: "Success true"
				});
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось получить статьи"
		});
	}
};

export const update = async (req, res) => {
	try {

		//Вытаскиваем id из запроса
		const postId = req.params.id;

		/* Ищем пост по id, обновляем в нем информацию и возвращаем
		актуальный документ*/
		await PostModel.updateOne(
			{
				_id: postId
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			}
		);

		res.json({
			message: "Статья обновлена"
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось обновить статью"
		});
	}
};
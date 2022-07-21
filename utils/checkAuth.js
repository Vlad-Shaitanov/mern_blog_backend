import jwt from "jsonwebtoken";

export default (req, res, next) => {
	//Вытаскиваем токен завторизации
	const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

	if (token) {
		try {
			const decoded = jwt.verify(token, "secret123");

			req.userId = decoded._id;

			//Для продолжения работы функции
			next();
		} catch (error) {
			return res.status(403).json({
				message: "Нет доступа1"
			});
		}
	} else {
		return res.status(403).json({
			message: "Нет доступа2"
		});
	}

	// res.send(token);

};
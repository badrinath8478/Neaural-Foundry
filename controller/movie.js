const Movie = require("../model/movie");



exports.addMovie = async (req, res, next) => {
    try {
        const movie = new Movie({
            Title: req.body.Title,
            Year: req.body.Year,
            Rating: req.body.Rating,
            ShortMessage: req.body.ShortMessage,
            Review: req.body.Review,
            Poster: req.body.Poster,
            PostedBy: req.userId
        });
        await movie.save();
        return res.status(201).json({
            success: true,
            message: "movie added successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err,
        });
    }
};

exports.getMovie = async (req, res, next) => {
    try {
        const movies = await Movie.find({ PostedBy: req.userId });
        if (!movies) {
            return res.status(200).json({
                success: true,
                message: "no movies to display"
            });
        }
        return res.status(200).json({
            success: true,
            message: movies
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


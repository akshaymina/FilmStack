import React from 'react'

const MovieCard = ({ movie: {title, vote_average, original_language, release_date, poster_path} }) => {


    return (
        <div className="movie-card">
            <div className="mt-4">
                <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={title} />
            </div>

            <div className="content">
                <h3>{title}</h3>
                <div className="rating">
                    <img src="./star.svg" alt="star" />
                    <p>{vote_average.toFixed(1)}</p><span>•</span>
                    <p className="lang">{original_language}</p><span>•</span>
                    <div className="year">{release_date.slice(0, 4)}</div>
                </div>

            </div>
        </div>
    );
}

export default MovieCard
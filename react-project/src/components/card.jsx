import React from 'react'
const Card = ({ title, poster_path, vote_average, original_language, release_date }) => {
  return (
    <div className="movie-card">
      {poster_path
      ? <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} 
          alt={title} /> : <img src="../public/no-movie.png" alt="No movie poster available"/>
        }
      <h3>{title}</h3>
      <div className="content">
        <div className="rating">
          <img src="../public/star.svg" alt="star" />
          <p>{vote_average.toFixed(1)}</p>
        </div>
        <span className="lang">{original_language}</span>
        <span className="year">{new Date(release_date).getFullYear()}</span>
      </div>
    </div>
  )
}

export default Card

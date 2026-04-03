function ApartmentCard({ apartment, isSelected, isSaved, onToggleCompare, onToggleSave, score }) {
  const formattedRent = `$${apartment.rent.toLocaleString()} / month`;

  return (
    <article className="apartment-card">
      <div
        className="apartment-card-image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(17, 24, 39, 0.12), rgba(17, 24, 39, 0.55)), url(${apartment.image})`,
        }}
      >
        <span className="match-chip">{score}% match</span>
      </div>

      <div className="apartment-card-body">
        <div className="card-header">
          <div>
            <h3>{apartment.name}</h3>
            <p>{apartment.description}</p>
          </div>
          <strong className="rent-text">{formattedRent}</strong>
        </div>

        <div className="detail-grid">
          <div className="detail-box">
            <span>Commute</span>
            <strong>{apartment.distanceMinutes} min</strong>
          </div>
          <div className="detail-box">
            <span>Transit</span>
            <strong>{apartment.transit}</strong>
          </div>
          <div className="detail-box">
            <span>Safety</span>
            <strong>{apartment.safetyScore}/10</strong>
          </div>
          <div className="detail-box">
            <span>Quiet</span>
            <strong>{apartment.quietScore}/10</strong>
          </div>
        </div>

        <div className="tag-row">
          <span className="tag">{apartment.neighborhood}</span>
          <span className="tag">{apartment.furnished ? 'Furnished' : 'Unfurnished'}</span>
          <span className="tag">
            {apartment.utilitiesIncluded ? 'Utilities included' : 'Utilities extra'}
          </span>
          <span className="tag">{apartment.laundry}</span>
        </div>

        <ul className="feature-list">
          {apartment.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <div className="card-actions">
          <button className="primary-button" type="button" onClick={() => onToggleCompare(apartment.id)}>
            {isSelected ? 'Remove from Comparison' : 'Add to Comparison'}
          </button>
          <button className="secondary-button" type="button" onClick={() => onToggleSave(apartment.id)}>
            {isSaved ? 'Saved' : 'Save Listing'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ApartmentCard;

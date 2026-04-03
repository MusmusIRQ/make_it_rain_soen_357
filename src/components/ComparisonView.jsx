function ComparisonView({
  apartments,
  visitTimeOptions,
  visitDateMin,
  visitDateMax,
  selectedVisitTimes,
  confirmedVisits,
  onVisitDateChange,
  onVisitTimeChange,
  onConfirmVisit,
}) {
  if (apartments.length === 0) {
    return (
      <section>
        <div className="section-heading">
          <h2>Comparison Workspace</h2>
          <p>Select up to three apartments to compare them side by side.</p>
        </div>
        <div className="empty-state">
          <h3>No apartments selected yet</h3>
          <p>
            Use the compare button on any apartment card to bring it into this decision-support
            table.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Comparison Workspace</h2>
        <p>Review the tradeoffs between your currently selected housing options.</p>
      </div>

      <div className="comparison-grid">
        {apartments.map((apartment) => (
          <article key={apartment.id} className="comparison-column">
            <h3>{apartment.name}</h3>
            <ul className="list-reset comparison-list">
              <li>
                <span>Rent</span>
                <strong>${apartment.rent.toLocaleString()}</strong>
              </li>
              <li>
                <span>Commute</span>
                <strong>{apartment.distanceMinutes} min</strong>
              </li>
              <li>
                <span>Transit</span>
                <strong>{apartment.transit}</strong>
              </li>
              <li>
                <span>Furnished</span>
                <strong>{apartment.furnished ? 'Yes' : 'No'}</strong>
              </li>
              <li>
                <span>Utilities</span>
                <strong>{apartment.utilitiesIncluded ? 'Included' : 'Extra'}</strong>
              </li>
              <li>
                <span>Quiet score</span>
                <strong>{apartment.quietScore}/10</strong>
              </li>
              <li>
                <span>Social score</span>
                <strong>{apartment.socialScore}/10</strong>
              </li>
              <li>
                <span>Safety score</span>
                <strong>{apartment.safetyScore}/10</strong>
              </li>
            </ul>

            <div className="visit-booking">
              <label className="visit-field">
                <span>Select a visit date</span>
                <input
                  type="date"
                  value={selectedVisitTimes[apartment.id]?.date || ''}
                  min={visitDateMin}
                  max={visitDateMax}
                  onChange={(event) => onVisitDateChange(apartment.id, event.target.value)}
                />
              </label>

              <label className="visit-field">
                <span>Select a visit time</span>
                <select
                  value={selectedVisitTimes[apartment.id]?.time || ''}
                  onChange={(event) => onVisitTimeChange(apartment.id, event.target.value)}
                >
                  <option value="">Choose a time</option>
                  {visitTimeOptions.map((timeOption) => (
                    <option key={timeOption} value={timeOption}>
                      {timeOption}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="primary-button visit-button"
                type="button"
                onClick={() => onConfirmVisit(apartment.id)}
                disabled={
                  !selectedVisitTimes[apartment.id]?.date || !selectedVisitTimes[apartment.id]?.time
                }
              >
                Confirm Choice
              </button>

              {confirmedVisits[apartment.id] ? (
                <p className="confirmation-note">Confirmed visit: {confirmedVisits[apartment.id]}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ComparisonView;

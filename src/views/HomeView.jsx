import { useMemo, useState } from 'react';
import ApartmentCard from '../components/ApartmentCard';
import ComparisonView from '../components/ComparisonView';
import LoginPanel from '../components/LoginPanel';
import PreferencesPanel from '../components/PreferencesPanel';
import apartments from '../data/apartments';
import mockUsers from '../data/mockUsers';

const defaultCredentials = {
  email: '',
  password: '',
};

const visitTimeOptions = ['10:00 AM', '11:30 AM', '1:00 PM', '2:00 PM', '3:30 PM', '4:00 PM'];
const visitDateMin = '2026-04-03';
const visitDateMax = '2026-05-15';

function calculateMatchScore(apartment, preferences) {
  const budgetFit =
    apartment.rent <= preferences.maxBudget
      ? 100
      : Math.max(30, 100 - (apartment.rent - preferences.maxBudget) / 5);
  const commuteFit =
    apartment.distanceMinutes <= preferences.maxCommute
      ? 100
      : Math.max(25, 100 - (apartment.distanceMinutes - preferences.maxCommute) * 6);
  const safetyFit = apartment.safetyScore * 10;
  const quietFit = apartment.quietScore * 10;
  const socialFit = apartment.socialScore * 10;

  const weightedTotal =
    budgetFit * preferences.budgetWeight +
    commuteFit * preferences.commuteWeight +
    safetyFit * preferences.safetyWeight +
    quietFit * preferences.quietWeight +
    socialFit * preferences.socialWeight;

  const maxWeight =
    preferences.budgetWeight +
    preferences.commuteWeight +
    preferences.safetyWeight +
    preferences.quietWeight +
    preferences.socialWeight;

  return Math.round(weightedTotal / maxWeight);
}

function formatVisitSchedule(visitSelection) {
  if (!visitSelection?.date || !visitSelection?.time) {
    return '';
  }

  const formattedDate = new Date(`${visitSelection.date}T12:00:00`).toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${formattedDate} - ${visitSelection.time}`;
}

function HomeView() {
  const [credentials, setCredentials] = useState(defaultCredentials);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitTimes, setSelectedVisitTimes] = useState({});
  const [confirmedVisits, setConfirmedVisits] = useState({});
  const [preferences, setPreferences] = useState(mockUsers[0].preferences);
  const [savedApartmentIds, setSavedApartmentIds] = useState(mockUsers[0].savedApartmentIds);
  const [compareApartmentIds, setCompareApartmentIds] = useState(mockUsers[0].compareApartmentIds);

  const scoredApartments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return apartments
      .filter((apartment) => {
        if (preferences.furnishedOnly && !apartment.furnished) {
          return false;
        }

        if (preferences.utilitiesIncludedOnly && !apartment.utilitiesIncluded) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchBlob = [
          apartment.name,
          apartment.neighborhood,
          apartment.transit,
          apartment.description,
          apartment.highlights.join(' '),
        ]
          .join(' ')
          .toLowerCase();

        return searchBlob.includes(normalizedQuery);
      })
      .map((apartment) => ({
        ...apartment,
        matchScore: calculateMatchScore(apartment, preferences),
      }))
      .sort((left, right) => right.matchScore - left.matchScore);
  }, [preferences, searchQuery]);

  const comparisonApartments = useMemo(() => {
    return apartments.filter((apartment) => compareApartmentIds.includes(apartment.id));
  }, [compareApartmentIds]);

  const savedApartments = useMemo(() => {
    return apartments.filter((apartment) => savedApartmentIds.includes(apartment.id));
  }, [savedApartmentIds]);

  const confirmedVisitApartments = useMemo(() => {
    return apartments.filter((apartment) => confirmedVisits[apartment.id]);
  }, [confirmedVisits]);

  const topMatch = scoredApartments[0];

  function handleCredentialsChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleLoginSubmit(event) {
    event.preventDefault();

    const matchedUser = mockUsers.find(
      (user) => user.email === credentials.email && user.password === credentials.password
    );

    if (!matchedUser) {
      setErrorMessage('Use the demo credentials shown on the page to access the prototype.');
      return;
    }

    setCurrentUser(matchedUser);
    setPreferences(matchedUser.preferences);
    setSavedApartmentIds(matchedUser.savedApartmentIds);
    setCompareApartmentIds(matchedUser.compareApartmentIds);
    setErrorMessage('');
  }

  function handleLogout() {
    setCurrentUser(null);
    setCredentials(defaultCredentials);
    setIsProfileOpen(false);
    setSelectedVisitTimes({});
    setConfirmedVisits({});
  }

  function handlePreferenceChange(event) {
    const { name, value } = event.target;
    setPreferences((current) => ({
      ...current,
      [name]: Number(value),
    }));
  }

  function handleToggleFlag(flagName) {
    setPreferences((current) => ({
      ...current,
      [flagName]: !current[flagName],
    }));
  }

  function handleToggleSave(apartmentId) {
    setSavedApartmentIds((current) =>
      current.includes(apartmentId)
        ? current.filter((id) => id !== apartmentId)
        : [...current, apartmentId]
    );
  }

  function handleToggleCompare(apartmentId) {
    setCompareApartmentIds((current) => {
      if (current.includes(apartmentId)) {
        return current.filter((id) => id !== apartmentId);
      }

      if (current.length === 3) {
        return [...current.slice(1), apartmentId];
      }

      return [...current, apartmentId];
    });
  }

  function handleVisitTimeChange(apartmentId, value) {
    setSelectedVisitTimes((current) => ({
      ...current,
      [apartmentId]: {
        ...current[apartmentId],
        time: value,
      },
    }));
  }

  function handleVisitDateChange(apartmentId, value) {
    setSelectedVisitTimes((current) => ({
      ...current,
      [apartmentId]: {
        ...current[apartmentId],
        date: value,
      },
    }));
  }

  function handleConfirmVisit(apartmentId) {
    const selectedTime = selectedVisitTimes[apartmentId];

    if (!selectedTime?.date || !selectedTime?.time) {
      return;
    }

    setConfirmedVisits((current) => ({
      ...current,
      [apartmentId]: formatVisitSchedule(selectedTime),
    }));
  }

  if (!currentUser) {
    return (
      <main className="app-shell">
        <div className="ambient-shape ambient-left" />
        <div className="ambient-shape ambient-right" />
        <div className="page-shell">
          <LoginPanel
            credentials={credentials}
            onChange={handleCredentialsChange}
            onSubmit={handleLoginSubmit}
            errorMessage={errorMessage}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="ambient-shape ambient-left" />
      <div className="ambient-shape ambient-right" />

      <div className="page-shell">
        <section className="dashboard-hero">
          <div>
            <h1>Welcome back, {currentUser.firstName}</h1>
            <p>
              Explore apartments, personalize your preferences, and compare your chosen listens.
            </p>
          </div>

          <div className="hero-actions">
            <button
              className="profile-card profile-button"
              type="button"
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="profile-icon" aria-hidden="true">
                <div className="profile-icon-head" />
                <div className="profile-icon-body" />
              </div>
              <div className="profile-meta">
                <span>Student Profile</span>
                <strong>
                  {currentUser.firstName} {currentUser.lastName}
                </strong>
                <small>{currentUser.email}</small>
              </div>
            </button>

            <div className="hero-card">
              <span>Top match right now</span>
              <strong>{topMatch ? topMatch.name : 'No current matches'}</strong>
              <small>{topMatch ? `${topMatch.matchScore}% compatibility` : 'Adjust your filters.'}</small>
            </div>
            <button className="secondary-button" type="button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </section>

        <section className="layout-grid">
          <PreferencesPanel
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            onToggleFlag={handleToggleFlag}
            resultCount={scoredApartments.length}
            savedCount={savedApartmentIds.length}
            compareCount={compareApartmentIds.length}
          />

          <div className="content-stack">
            <section className="content-panel">
              <div className="tab-row" role="tablist" aria-label="Apartment workspace tabs">
                <button
                  className={`tab-button ${activeTab === 'all' ? 'tab-button-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'all'}
                  onClick={() => setActiveTab('all')}
                >
                  All Listings
                </button>
                <button
                  className={`tab-button ${activeTab === 'saved' ? 'tab-button-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'saved'}
                  onClick={() => setActiveTab('saved')}
                >
                  Saved Listings
                </button>
                <button
                  className={`tab-button ${activeTab === 'compare' ? 'tab-button-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'compare'}
                  onClick={() => setActiveTab('compare')}
                >
                  Comparison
                </button>
              </div>

              {activeTab === 'all' ? (
                <>
                  <div className="section-heading">
                    <h2>Recommended For You</h2>
                  </div>

                  <div className="search-row">
                    <label className="search-field">
                      <span>Search apartments</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by name, neighborhood, or transit"
                      />
                    </label>
                  </div>

                  <div className="results-grid">
                    {scoredApartments.length > 0 ? (
                      scoredApartments.map((apartment) => (
                        <ApartmentCard
                          key={apartment.id}
                          apartment={apartment}
                          score={apartment.matchScore}
                          isSelected={compareApartmentIds.includes(apartment.id)}
                          isSaved={savedApartmentIds.includes(apartment.id)}
                          onToggleCompare={handleToggleCompare}
                          onToggleSave={handleToggleSave}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <h3>No matching apartments found</h3>
                        <p>Try a different search term or relax one of your current preferences.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : null}

              {activeTab === 'saved' ? (
                <>
                  <div className="section-heading">
                    <h2>Saved Listings</h2>
                    <p>A quick view of the apartments this mock student has bookmarked.</p>
                  </div>

                  <div className="saved-list">
                    {savedApartments.length > 0 ? (
                      savedApartments.map((apartment) => (
                        <div key={apartment.id} className="saved-item">
                          <div>
                            <strong>{apartment.name}</strong>
                            <span>
                              ${apartment.rent.toLocaleString()} - {apartment.distanceMinutes} min
                              - {apartment.neighborhood}
                            </span>
                          </div>
                          <button
                            className="text-button"
                            type="button"
                            onClick={() => handleToggleCompare(apartment.id)}
                          >
                            Compare
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <h3>No saved listings yet</h3>
                        <p>Use the save action on any apartment card to keep it here.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : null}

              {activeTab === 'compare' ? (
                <ComparisonView
                  apartments={comparisonApartments}
                  visitTimeOptions={visitTimeOptions}
                  visitDateMin={visitDateMin}
                  visitDateMax={visitDateMax}
                  selectedVisitTimes={selectedVisitTimes}
                  confirmedVisits={confirmedVisits}
                  onVisitDateChange={handleVisitDateChange}
                  onVisitTimeChange={handleVisitTimeChange}
                  onConfirmVisit={handleConfirmVisit}
                />
              ) : null}
            </section>
          </div>
        </section>
      </div>

      {isProfileOpen ? (
        <div className="modal-overlay" role="presentation" onClick={() => setIsProfileOpen(false)}>
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Student profile"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Student Profile</h2>
              <button
                className="text-button"
                type="button"
                onClick={() => setIsProfileOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="profile-modal-grid">
              <div className="profile-modal-card">
                <span>Name</span>
                <strong>
                  {currentUser.firstName} {currentUser.lastName}
                </strong>
              </div>
              <div className="profile-modal-card">
                <span>Email</span>
                <strong>{currentUser.email}</strong>
              </div>
            </div>

            <div className="section-heading modal-section">
              <h2>Current Decision Preferences</h2>
              <p>This summary reflects the criteria currently influencing apartment ranking.</p>
            </div>

            <div className="profile-modal-grid">
              <div className="profile-modal-card">
                <span>Budget limit</span>
                <strong>${preferences.maxBudget}</strong>
              </div>
              <div className="profile-modal-card">
                <span>Commute limit</span>
                <strong>{preferences.maxCommute} minutes</strong>
              </div>
              <div className="profile-modal-card">
                <span>Saved listings</span>
                <strong>{savedApartmentIds.length}</strong>
              </div>
              <div className="profile-modal-card">
                <span>Compared listings</span>
                <strong>{compareApartmentIds.length}</strong>
              </div>
            </div>

            <div className="section-heading modal-section">
              <h2>Confirmed Visits</h2>
              <p>Your scheduled apartment visits appear here after confirmation.</p>
            </div>

            {confirmedVisitApartments.length > 0 ? (
              <div className="confirmed-visits-list">
                {confirmedVisitApartments.map((apartment) => (
                  <div key={apartment.id} className="confirmed-visit-item">
                    <strong>{apartment.name}</strong>
                    <span>{confirmedVisits[apartment.id]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No visits confirmed yet</h3>
                <p>Confirm a visit from the comparison tab and it will appear here.</p>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default HomeView;

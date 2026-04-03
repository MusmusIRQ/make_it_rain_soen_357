function PreferencesPanel({
  preferences,
  onPreferenceChange,
  onToggleFlag,
  resultCount,
  savedCount,
  compareCount,
}) {
  return (
    <aside className="panel sidebar-panel">
      <div className="section-heading">
        <h2>Your Preferences</h2>
        <p>Adjust the criteria to match your own preferences.</p>
      </div>

      <div className="summary-strip">
        <div>
          <strong>{resultCount}</strong>
          <span>matches</span>
        </div>
        <div>
          <strong>{savedCount}</strong>
          <span>saved</span>
        </div>
        <div>
          <strong>{compareCount}</strong>
          <span>comparing</span>
        </div>
      </div>

      <label className="field">
        <span>Maximum monthly budget: ${preferences.maxBudget}</span>
        <input
          type="range"
          min="700"
          max="1500"
          step="25"
          name="maxBudget"
          value={preferences.maxBudget}
          onChange={onPreferenceChange}
        />
      </label>

      <label className="field">
        <span>Maximum commute: {preferences.maxCommute} minutes</span>
        <input
          type="range"
          min="5"
          max="35"
          step="1"
          name="maxCommute"
          value={preferences.maxCommute}
          onChange={onPreferenceChange}
        />
      </label>

      <label className="field">
        <span>Budget importance: {preferences.budgetWeight}/5</span>
        <input
          type="range"
          min="1"
          max="5"
          name="budgetWeight"
          value={preferences.budgetWeight}
          onChange={onPreferenceChange}
        />
      </label>

      <label className="field">
        <span>Commute importance: {preferences.commuteWeight}/5</span>
        <input
          type="range"
          min="1"
          max="5"
          name="commuteWeight"
          value={preferences.commuteWeight}
          onChange={onPreferenceChange}
        />
      </label>

      <label className="field">
        <span>Safety importance: {preferences.safetyWeight}/5</span>
        <input
          type="range"
          min="1"
          max="5"
          name="safetyWeight"
          value={preferences.safetyWeight}
          onChange={onPreferenceChange}
        />
      </label>

      <label className="field">
        <span>Quiet atmosphere importance: {preferences.quietWeight}/5</span>
        <input
          type="range"
          min="1"
          max="5"
          name="quietWeight"
          value={preferences.quietWeight}
          onChange={onPreferenceChange}
        />
      </label>

      <label className="field">
        <span>Social atmosphere importance: {preferences.socialWeight}/5</span>
        <input
          type="range"
          min="1"
          max="5"
          name="socialWeight"
          value={preferences.socialWeight}
          onChange={onPreferenceChange}
        />
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={preferences.furnishedOnly}
          onChange={() => onToggleFlag('furnishedOnly')}
        />
        <span>Only show furnished listings</span>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={preferences.utilitiesIncludedOnly}
          onChange={() => onToggleFlag('utilitiesIncludedOnly')}
        />
        <span>Only show listings with utilities included</span>
      </label>
    </aside>
  );
}

export default PreferencesPanel;

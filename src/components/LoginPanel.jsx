function LoginPanel({ credentials, onChange, onSubmit, errorMessage }) {
  return (
    <section className="login-panel">
      <div className="login-copy">
        <h1>RentEase</h1>
        <h2>Compare student housing with a guided decision flow</h2>
      </div>

      <form className="login-card" onSubmit={onSubmit}>
        <h3>Student Login</h3>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            placeholder="student@concordia.ca"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            placeholder="soen357"
          />
        </label>

        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

        <button className="primary-button" type="submit">
          Login
        </button>
      </form>
    </section>
  );
}

export default LoginPanel;

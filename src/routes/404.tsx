const PageNotFound = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="app-component-content">
          <h3> 404: Not Found</h3>
          <p>
            The link you tried to access doesn't seem to exist. <br/> Please verify
            and enter the correct URL.
          </p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentstack.com/docs/developers/developer-hub/about-ui-locations/"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;

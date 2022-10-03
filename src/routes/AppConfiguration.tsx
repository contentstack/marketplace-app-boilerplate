import Icon from '../images/appconfig.svg';

const AppConfigurationExtension = () => {
  return (
    <div className='app-config'>
      <div className='app-config-container'>
        <div className='app-config-icon'>
          <img src={Icon} alt='icon' />
        </div>
        <div className='app-component-content'>
          <h4>App Configuration</h4>
          <p>
            This is the iframe that contains your app configuration
            <br />
            Build you app now
          </p>
          <a target='_blank' rel="noreferrer" href='https://www.contentstack.com/docs/developers/developer-hub/app-config-location/'>Learn more</a>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationExtension;

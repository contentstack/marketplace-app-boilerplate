import Icon from '../images/appconfig.svg';
import { Link } from 'react-router-dom';

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
          <Link to='/'>Learn more</Link>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationExtension;

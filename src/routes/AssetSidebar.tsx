import Icon from '../images/assetsidebar.svg';
import { Link } from 'react-router-dom';

const AssetSidebarExtension = () => {
  return (
    <div className='asset-sidebar'>
    <div className='asset-sidebar-container'>
      <div className='asset-sidebar-icon'>
        <img src={Icon} alt='icon' />
      </div>
      <div className='app-component-content'>
        <h4>Asset Sidebar Widget</h4>
        <p>
          This is the iframe that contains your asset sidebar widget
          <br />
          Build you app now
        </p>
        <Link to='/'>Learn more</Link>
      </div>
    </div>
  </div>
  );
};

export default AssetSidebarExtension;

import Icon from '../images/assetsidebar.svg';

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
        <a target='_blank' rel="noreferrer" href='https://www.contentstack.com/docs/developers/developer-hub/asset-sidebar-location/'>Learn more</a>
      </div>
    </div>
  </div>
  );
};

export default AssetSidebarExtension;

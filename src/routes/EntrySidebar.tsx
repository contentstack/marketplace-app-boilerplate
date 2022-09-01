import Icon from '../images/sidebarwidget.svg';

const EntrySidebarExtension = () => {
  return (
    <div className='entry-sidebar'>
    <div className='entry-sidebar-container'>
      <div className='entry-sidebar-icon'>
        <img src={Icon} alt='icon' />
      </div>
      <div className='app-component-content'>
        <h4>Sidebar Widget</h4>
        <p>
          This is the iframe that contains your entry sidebar widget
          <br />
          Build you app now
        </p>
        <a target='_blank' rel="noreferrer" href='https://www.contentstack.com/docs/developers/developer-hub/sidebar-location/'>Learn more</a>
      </div>
    </div>
  </div>
  );
};

export default EntrySidebarExtension;
    
import Icon from '../images/Icon.svg';

const StackDashboardExtension = () => {
  return (
    <div className='dashboard'>
      <div className='dashboard-container'>
        <div className='dashboard-icon'>
          <img src={Icon} alt='icon' />
        </div>
        <div className='app-component-content'>
          <h4>Dashboard Widget</h4>
          <p>
            This is the iframe that contains your dashboard widget
            <br />
            Build you app now
          </p>
          <a target='_blank' rel="noreferrer" href='https://www.contentstack.com/docs/developers/developer-hub/dashboard-location/'>Learn more</a>
        </div>
      </div>
    </div>
  );
};

export default StackDashboardExtension;

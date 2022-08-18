import Icon from '../images/Icon.svg';
import { Link } from 'react-router-dom';

const StackDashboardExtension = () => {
  return (
    <div className='dashboard'>
      <div className='dashboard-container'>
        <div className='dashboard-icon'>
          <img src={Icon} alt='icon' />
        </div>
        <div className='dashboard-content'>
          <h4>Dashboard Widget</h4>
          <p>
            This is the iframe that contains your dashboard widget
            <br />
            Build you app now
          </p>
          <Link to='/'>Learn more</Link>
        </div>
      </div>
    </div>
  );
};

export default StackDashboardExtension;

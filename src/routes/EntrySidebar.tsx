import Icon from '../images/sidebarwidget.svg';
import { Link } from 'react-router-dom';

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
        <Link to='/'>Learn more</Link>
      </div>
    </div>
  </div>
  );
};

export default EntrySidebarExtension;
    
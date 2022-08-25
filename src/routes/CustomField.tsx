import Icon from '../images/customfield.svg';
import { Link } from 'react-router-dom';
import { useAppSdk } from '../hooks/useAppSdk';

const CustomFieldExtension = () => {
  const height = useAppSdk()[0];
  height?.location.CustomField?.frame.updateHeight(260);

  return (
    <div className='custom-field'>
      <div className='custom-field-container'>
        <div className='custom-field-icon'>
          <img src={Icon} alt='icon' />
        </div>
        <div className='app-component-content'>
          <h4>Custom Field</h4>
          <p>
            This is the iframe that contains your custom field
            <br />
            Build you app now
          </p>
          <Link to='/'>Learn more</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldExtension;

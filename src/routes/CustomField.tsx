import Icon from '../images/customfield.svg';
import { useAppLocation } from '../hooks/useAppLocation';

const CustomFieldExtension = () => {
  const customField = useAppLocation();
  customField.location?.frame.updateHeight(260);

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
          <a target='_blank' rel="noreferrer" href='https://www.contentstack.com/docs/developers/developer-hub/custom-field-location/'>Learn more</a>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldExtension;

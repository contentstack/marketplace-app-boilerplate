import React from 'react';
import '../style.css'
// @ts-ignore
import plugin from '../../images/plugin.svg'
const PlaceHolder = () => {
  return (
    <div className='rte-container'>
      <div className='custom-field'>
        <div className='custom-field-container'>
          <div className='custom-field-icon'>
            <img
              src={plugin}
              alt='icon'
            />
          </div>
          <div className='app-component-content'>
            <h4>RTE Plugin</h4>
            <p>Your new RTE plugin can be found on the toolbar above.</p>
          </div>
        </div>
      </div>
      <div className='app-component-content'>
        <p>
          You can also find your plugin on the <strong>hoveringToolbar</strong>{' '}
          by selecting any text. Try selecting me.
        </p>
        <a href='/'>Learn more</a>
      </div>
    </div>
  );
};

export default PlaceHolder;

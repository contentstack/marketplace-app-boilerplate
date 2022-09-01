import React from 'react';
import { Icon } from '@contentstack/venus-components';
import ContentstackSDK from '@contentstack/app-sdk';
import plugin from './public/plugin.svg'
import './index.css';

export default ContentstackSDK.init().then(async (sdk) => {
  const extensionObj = await sdk['location'];
  const RTE = await extensionObj['RTEPlugin'];
  if (!RTE) return;

  const RtePlugin = RTE('RTE Plugin', () => ({
    title: 'JSON-RTE-Plugin',
    icon: <Icon style={{ padding: '0 6px' }} icon='Edit' size='original' />,
    render: (props: any) => {
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
              You can also find your plugin on the{' '}
              <strong>hoveringToolbar</strong> by selecting any text. Try
              selecting me.
            </p>
            <a href='/'>Learn more</a>
          </div>
        </div>
      );
    },
    displayOn: ['toolbar'],
    elementType: ['block'],
  }));

  return {
    RtePlugin,
  };
});

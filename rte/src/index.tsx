import React from 'react';
import { Icon } from '@contentstack/venus-components';
import ContentstackSDK from '@contentstack/app-sdk';
import PlaceHolder from './components/placeholder';

export default ContentstackSDK.init().then(async (sdk) => {
    const extensionObj = await sdk['location'];
    const RTE = await extensionObj['RTEPlugin'];
    if (!RTE) return;
  
    return RTE('highlight', () => ({
      title: 'Highlight',
      icon: <Icon style={{ padding: '0 6px' }} icon='Edit' size='original' />,
      render: (props: any) => {
        return <PlaceHolder/>
      },
      displayOn: ['toolbar'],
      elementType: ['block'],
    }));
})
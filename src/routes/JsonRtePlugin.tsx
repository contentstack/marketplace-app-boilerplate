import React from 'react';
import { Icon } from '@contentstack/venus-components';
import { useAppSdk } from '../hooks/useAppSdk';

const JsonRtePlugin= async ()=>{
    const sdk = useAppSdk()[0];
    if (!sdk) return;
    const extensionObj = sdk['location'];
    const RTE = await extensionObj['RTEPlugin'];
}

export default JsonRtePlugin

import React, { useEffect, useState } from 'react';
import ContentstackAppSDK from '@contentstack/app-sdk';
import Extension from '@contentstack/app-sdk/dist/src/extension';
import { isNull } from 'lodash';
import { useAppSdk } from './hooks/useAppSdk';
import { useAppConfig } from './hooks/useAppConfig';
import { AppFailed } from './components/AppFailed';

type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useAppSdk();
  const [, setConfig] = useAppConfig();

  // Initialize the SDK and track analytics event
  useEffect(() => {
    (async () => {
      try {
        const appSdk: Extension = await ContentstackAppSDK.init();
        setAppSdk(appSdk);
      } catch (err) {
        setFailed(true);
      }
    })();
  }, [setFailed, setAppSdk, setConfig]);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk atom.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  if (failed) {
    return <AppFailed />;
  }

  return <>{children}</>;
};

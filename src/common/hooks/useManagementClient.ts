import { useState, useEffect } from 'react';
import { client } from '@contentstack/management';
import { useAppSdk } from './useAppSdk';

/**
 * useManagementClient Hook
 * 
 * Simple hook to get Contentstack Management SDK client instance.
 * Returns the initialized management client for direct SDK operations.
 * 
 * @returns managementClient - The initialized Management SDK client or null
 * 
 * @example
 * const managementClient = useManagementClient();
 * const appSdk = useAppSdk();
 * 
 * if (managementClient && appSdk) {
 *   const stack = await managementClient.stack({ api_key: appSdk.ids.apiKey });
 *   const entries = await stack.contentType('blog').entry().query().find();
 * }
 */
export const useManagementClient = () => {
  const appSdk = useAppSdk();
  const [managementClient, setManagementClient] = useState<ReturnType<typeof client> | null>(null);

  useEffect(() => {
    if (!appSdk) {
      setManagementClient(null);
      return;
    }

    try {
      const contentstackAdapter = appSdk.createAdapter();
      const managementClient = client({
        adapter: contentstackAdapter,
        host: appSdk.endpoints.CMA,
      });
      
      setManagementClient(managementClient);
    } catch (error) {
      console.error('Failed to initialize Management Client:', error);
      setManagementClient(null);
    }
  }, [appSdk]);

  return managementClient;
};
import { useMemo } from 'react';
import { client } from '@contentstack/management';
import { useAppSdk } from './useAppSdk';
import { safeError } from '../utils/safeError';

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

  // Derived from appSdk, so compute it instead of syncing it through state.
  return useMemo(() => {
    if (!appSdk) return null;
    try {
      return client({ adapter: appSdk.createAdapter(), host: appSdk.endpoints.CMA });
    } catch (error) {
      console.error('Failed to initialize Management Client:', safeError(error));
      return null;
    }
  }, [appSdk]);
};

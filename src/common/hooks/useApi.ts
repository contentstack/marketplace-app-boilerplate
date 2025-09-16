import { useCallback } from 'react';
import { useAppSdk } from './useAppSdk';

/**
 * useAppSdkApi Hook - Context-Aware API Hook
 * 
 * Provides structured access to Contentstack App SDK API with clear separation
 * between Contentstack CMA operations and direct API access.
 * 
 * @returns Object with callCmaApi, callDirectApi methods and ready state
 * 
 * @example
 * const { callCmaApi, callDirectApi, isApiReady } = useAppSdkApi();
 * 
 * // Contentstack CMA operations
 * const response = await callCmaApi('/v3/content_types');
 * const data = await response.json();
 * 
 * // Direct API access
 * const response = await callDirectApi('/custom-endpoint');
 * const data = await response.json();
 */
export const useAppSdkApi = () => {
  const appSdk = useAppSdk();

  /**
   * Call Contentstack CMA API
   * Automatically builds the full CMA URL and handles common patterns
   * 
   * @param cmaEndpoint - CMA endpoint (e.g., '/v3/content_types')
   * @param options - Standard RequestInit options
   * @returns Promise<Response>
   */
  const callCmaApi = useCallback(async (cmaEndpoint: string, options?: RequestInit): Promise<Response> => {
    if (!appSdk) {
      throw new Error('Contentstack App SDK is not ready');
    }
    
    const cmaUrl = `${appSdk.endpoints.CMA}${cmaEndpoint}`;
    const requestOptions: RequestInit = {
      headers: { 
        'Content-Type': 'application/json',
        ...options?.headers 
      },
      ...options,
    };

    const apiResponse = await appSdk.api(cmaUrl, requestOptions);
    
    if (!apiResponse.ok) {
      throw new Error(`Contentstack CMA API Error: ${apiResponse.status} ${apiResponse.statusText}`);
    }
    
    return apiResponse;
  }, [appSdk]);

  /**
   * Call Direct API
   * Provides direct access to appSdk.api for custom use cases
   * 
   * @param apiUrl - Full URL or endpoint path
   * @param options - Standard RequestInit options
   * @returns Promise<Response>
   */
  const callDirectApi = useCallback(async (apiUrl: string, options?: RequestInit): Promise<Response> => {
    if (!appSdk) {
      throw new Error('Contentstack App SDK is not ready');
    }
    
    const requestOptions: RequestInit = {
      headers: { 
        'Content-Type': 'application/json',
        ...options?.headers 
      },
      ...options,
    };

    const apiResponse = await appSdk.api(apiUrl, requestOptions);
    
    if (!apiResponse.ok) {
      throw new Error(`Direct API Error: ${apiResponse.status} ${apiResponse.statusText}`);
    }
    
    return apiResponse;
  }, [appSdk]);

  return { 
    callCmaApi,
    callDirectApi,
    isApiReady: !!appSdk 
  } as const;
};

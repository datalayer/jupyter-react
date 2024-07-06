/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { PageConfig } from '@jupyterlab/coreutils';
import { JupyterProps } from './Jupyter';

/**
 * The URL prefix for the kernel api.
 */
const API_KERNEL_PREFIX_URL = '/api/jupyter-server';

/**
 * Type of the Jupyter configuration.
 */
export type IJupyterConfig = {
  jupyterServerUrl: string;
  jupyterServerToken: string;
  insideJupyterLab: boolean;
  insideJupyterHub: boolean;
};

/**
 * The default Jupyter configuration.
 */
let config: IJupyterConfig = {
  jupyterServerUrl: '',
  jupyterServerToken: '',
  insideJupyterLab: false,
  insideJupyterHub: false,
};

/**
 * Datalayer configuration is loaded.
 */
let datalayerConfigLoaded = false;

/**
 * Jupyter configuration is loaded.
 */
let jupyterConfigLoaded = false;

/**
 * Setter for jupyterServerUrl.
 */
export const setJupyterServerUrl = (jupyterServerUrl: string) => {
  config.jupyterServerUrl = jupyterServerUrl;
};
/**
 * Getter for jupyterServerUrl.
 */
export const getJupyterServerUrl = () => config.jupyterServerUrl;


/**
 * Setter for jupyterServerToken.
 */
export const setJupyterServerToken = (jupyterServerToken: string) => {
  config.jupyterServerToken = jupyterServerToken;
};
/**
 * Getter for jupyterServerToken.
 */
export const getJupyterServerToken = () => config.jupyterServerToken;

/**
 * Get the datalayer configuration fully or for a particular parameter.
 *
 * @param name The parameter name
 * @returns The parameter value if {@link name} is specified, otherwise the full configuration.
 */
export function getDatalayerConfig(name?: string): any {
  if (!datalayerConfigLoaded) {
    const datalayerConfigData = document.getElementById(
      'datalayer-config-data'
    );
    if (datalayerConfigData?.textContent) {
      try {
        config = { ...config, ...JSON.parse(datalayerConfigData.textContent) };
        datalayerConfigLoaded = true;
      } catch (error) {
        console.error('Failed to parse the Datalayer configuration.', error);
      }
    }
  }
  // @ts-expect-error IJupyterConfig does not have index signature
  return name ? config[name] : config;
}

/**
 * Method to load the Jupyter configuration from the
 * host HTML page.
 */
export const loadJupyterConfig = (
  props: Pick<
    JupyterProps,
    | 'lite'
    | 'jupyterServerUrl'
    | 'collaborative'
    | 'terminals'
    | 'jupyterServerToken'
  >
) => {
  const {
    lite,
    jupyterServerUrl,
    collaborative,
    terminals,
    jupyterServerToken,
  } = props;
  if (jupyterConfigLoaded) {
    // Bail, the Jupyter config is already loaded.
    return config;
  }
  // Load the Datalayer config.
  getDatalayerConfig();
  if (datalayerConfigLoaded) {
    // There is a Datalayer config, rely on that.
    setJupyterServerUrl(
      jupyterServerUrl ??
        config.jupyterServerUrl ??
        location.protocol + '//' + location.host + '/api/jupyter-server'
    );
    setJupyterServerToken(jupyterServerToken ?? config.jupyterServerToken ?? '');
  } else {
    // No Datalayer config, look for a Jupyter config.
    const jupyterConfigData = document.getElementById('jupyter-config-data');
    if (jupyterConfigData) {
      const jupyterConfig = JSON.parse(jupyterConfigData.textContent || '');
      setJupyterServerUrl(
        jupyterServerUrl ??
          location.protocol + '//' + location.host + jupyterConfig.baseUrl
      );
      setJupyterServerToken(jupyterServerToken ?? jupyterConfig.token);
      config.insideJupyterLab = jupyterConfig.appName === 'JupyterLab';
      // Hub related information ('hubHost' 'hubPrefix' 'hubUser' ,'hubServerName').
      config.insideJupyterHub = PageConfig.getOption('hubHost') !== '';
    } else {
      // No Datalayer and no Jupyter config, rely on location...
      setJupyterServerUrl(
        jupyterServerUrl ??
          location.protocol + '//' + location.host + API_KERNEL_PREFIX_URL
      );
      setJupyterServerToken(jupyterServerToken ?? '');
    }
  }
  jupyterConfigLoaded = true;
  if (lite) {
    setJupyterServerUrl(location.protocol + '//' + location.host);
  }
  if (config.insideJupyterLab) {
    // Bail if running inside JupyterLab, we don't want to change the existing PageConfig.
    return config;
  }
  PageConfig.setOption('baseUrl', getJupyterServerUrl());
  PageConfig.setOption('wsUrl', getJupyterServerUrl().replace(/^http/, 'ws'));
  PageConfig.setOption('token', getJupyterServerToken());
  PageConfig.setOption('collaborative', String(collaborative));
  PageConfig.setOption('disableRTC', String(!collaborative));
  PageConfig.setOption('terminalsAvailable', String(terminals));
  PageConfig.setOption(
    'mathjaxUrl',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js'
  );
  PageConfig.setOption('mathjaxConfig', 'TeX-AMS_CHTML-full,Safe');
  return config;
};

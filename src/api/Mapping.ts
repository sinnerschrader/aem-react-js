import {Config} from './Compatibility';

export const mapping: {[type: string]: Config<{}>} = {};

export const MapTo = (resourceType: string, config: Config<{}>) => {
  mapping[resourceType] = config;
};

import {Config} from './Compatibility';

export const mapping: {[type: string]: Config<{}>} = {};

export const MapTo = <P = {}>(resourceType: string, config: Config<P>) => {
  mapping[resourceType] = config;
};

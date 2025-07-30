import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 100 }); // cache expires after 100 seconds

export const getCached = (key: string) => cache.get(key);
export const setCached = (key: string, value: unknown) => cache.set(key, value);
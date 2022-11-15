import crypto from 'crypto';

export const createHash = (baseString: string, seed?: string): string => {
  let hash = seed ?
    Number(seed.charCodeAt(0))
    : Math.floor(Math.random() * 100);
  
  const string = baseString + hash;

  for (let a = 1; a < string.length; a++) {
    const ch = string.charCodeAt(a) + hash;
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
  return `${seed}${hash}`;
}


export const generateSalt = (baseString?: string): string =>
baseString + crypto.randomBytes(16).toString('hex')

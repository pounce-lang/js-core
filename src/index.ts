// pounce core
import * as r from 'ramda';

export const parse = (ps: string) => r.split(' ', ps);
export const pounce = (pl: []): any[] => ([[], r.map(p => p, pl)]);
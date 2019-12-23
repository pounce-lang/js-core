
export type Json =
| string
| number
| boolean
| null
| { [property: string]: Json }
| Json[];

export type PL = Json[];

export type Word = 
| { [property: string]: Json }
| Json[];

export type Dictionary =
| Word[];

export type DefFn = (s: [], pl: PL | undefined, ws: Dictionary[] | undefined) => {};

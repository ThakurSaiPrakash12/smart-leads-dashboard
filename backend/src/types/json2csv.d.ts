/**
 * Minimal ambient declaration for json2csv@6.0.0-alpha.2.
 * The package ships no TypeScript declarations, so we declare what we use.
 */
declare module 'json2csv' {
  export interface FieldOption {
    label: string;
    value: string;
  }

  export interface ParserOptions {
    fields?: FieldOption[];
    delimiter?: string;
    eol?: string;
    header?: boolean;
    includeEmptyRows?: boolean;
  }

  export class Parser<T = unknown> {
    constructor(opts?: ParserOptions);
    parse(data: T[]): string;
  }

  export function parse<T = unknown>(data: T[], opts?: ParserOptions): string;
}

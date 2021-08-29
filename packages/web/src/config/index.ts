import development from './environments/development.json';
import production from './environments/production.json';

export class ConfigClass {
  private config: object;
  
  constructor(file?) {
    this.config = file || {};
  };

  // get
  get(path: string): string | boolean {
    return this.config[path];
  };
};

// Exporting Config instance
export const Config = new ConfigClass(development);
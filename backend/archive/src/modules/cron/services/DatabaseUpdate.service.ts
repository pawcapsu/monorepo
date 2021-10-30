import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import * as fs from 'fs';
import axios from 'axios';

import { createGzip } from 'zlib';

@Injectable()
export class DatabaseUpdateTask {
  constructor() {
    console.log("test");
  }
  
  // public fetchDatabase
  public async fetchDatabase() {

  };

  // cron DatabaseUpdate (every 12 hours)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    // Tags
    const date = new Date();
    const stringDate = `${ date.getFullYear() }-${ String(date.getMonth() + 1).padStart(2, '0') }-${ String(date.getDate()).padStart(2, '0') }`;
    
    const gzip = createGzip();
    const res = await axios.get(`https://e621.net/db_export/tag_aliases-${stringDate}.csv.gz`, {
      responseType: 'stream',
    });

    const fileStream = fs.createWriteStream('tag_aliases.csv.gz');
    res.data.pipe(gzip).pipe(fileStream);
    
    console.log('done');
  };
};
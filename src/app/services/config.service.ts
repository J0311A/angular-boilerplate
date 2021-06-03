import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configuration: AppConfig;

  constructor(private httpClient: HttpClient) {}

  setConfig(): Promise<AppConfig> {
    return this.httpClient
      .get<AppConfig>('./config.json')
      .toPromise()
      .then((config) => (this.configuration = config));
  }

  readConfig(): AppConfig {
    return this.configuration;
  }
}

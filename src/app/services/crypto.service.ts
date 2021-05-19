import { Injectable } from '@angular/core';
import enc from 'crypto-js';
import AES from 'crypto-js/aes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  // Encrypt
  encrypt(value: string): string {
    return AES.encrypt(value, environment.secret.trim()).toString();
  }
  // Decrypt
  decrypt(value: string): string {
    return AES.decrypt(value, environment.secret.trim()).toString(enc.Utf8);
  }
}

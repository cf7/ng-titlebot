import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class URLService {

  constructor() { }

  processURL(inputURL: string, suffixes: string[]): string {
    let indices: { [index: number]: string } = {};
    suffixes.forEach((s) => {
      if (inputURL.includes(s)) {
        indices[inputURL.indexOf(s)] = s;
      }
    });
    let keys: number[] = Object.keys(indices).map(e => parseInt(e));
    if (keys.length > 0) {
      let min: number = Math.min(...keys);
      let closest = indices[min];
      inputURL = inputURL.split(closest)[0] + closest;
      if (inputURL.includes('https://') || inputURL.includes('http://')) {
        inputURL = inputURL.split('://')[1];
      }
      return 'https://' + inputURL;
    } else {
      return '';
    }
  }
}

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from '../environments/environment';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

let mock: object = {};
if (!environment.production) {
  mock = new MockAdapter(axios);
  mock.onPost("/lookup").reply(200, {
    title: "<title>Mock Title</title>",
  });
}

export class AppComponent {
  title = 'Website Title Appears Here';

  suffixes = ['.com','.org','.edu','.net','.ai', '.io'];
  urlInput = new FormControl('');

  // service
  processURL(inputURL: string, suffixes: string[]) {
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

  handleSubmit() {
    alert("Clicked!");
    if (this.urlInput.value) {
      let url = this.processURL(this.urlInput.value, this.suffixes);
      if (url) {
        axios.post('/lookup', { data: url }, { timeout: 10000 })
          .then((response) => {
            if (response.data && response.data.title) {
              console.log("Success!");
              // this.setState({ 
              //   title: response.data.title,
              //   alert: false,
              //   loading: false
              // });
            } else {
              // this.setState({
              //   alert: true,
              //   alertVariant: 'warning',
              //   alertIndex: 2,
              //   loading: false
              // });
            }
          })
          .catch(err => {
            console.error(err);
          })
      }
    }
  }
}

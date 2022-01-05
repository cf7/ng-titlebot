import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from '../environments/environment';
import { URLService } from './url.service';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})



export class AppComponent implements OnInit {

  constructor(private urlService: URLService) {}

  ngOnInit() {
    let mock: any = {};
    if (!environment.production) {
      mock = new MockAdapter(axios);
      mock.onPost("/lookup").reply(200, {
        title: "Mock Title",
      });
    }
  }

  alertMessages = [ 
      "Please provide a url to a website's homepage",
      "url must have suffix (e.g. '.com')",
      "Website valid but no title found",
      "An issue occurred with the server"
    ];

  title = 'Website Title Appears Here';

  suffixes = ['.com','.org','.edu','.net','.ai', '.io'];
  urlInput = new FormControl('');

  handleSubmit() {
    if (this.urlInput.value) {
      let url = this.urlService.processURL(this.urlInput.value, this.suffixes);
      if (url) {
        axios.post('/lookup', { data: url }, { timeout: 10000 })
          .then((response) => {
            if (response.data && response.data.title) {
              this.title = response.data.title;
            } else {
              alert(this.alertMessages[2]);
            }
          })
          .catch(err => {
            console.error(err);
            alert(this.alertMessages[3]);
          })
      } else {
        alert(this.alertMessages[1]);
      }
    } else {
      alert(this.alertMessages[0]);
    }
  }
}

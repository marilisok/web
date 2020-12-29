import { Component, OnInit } from '@angular/core';
import { HttpService} from '../../http.service';

class Settings{
  tm_start: string;
  tm_end: string;
  tm_out: string;

  constructor(tm_start: string, tm_end: string, tm_out: string) {
    this.tm_start = tm_start;
    this.tm_end = tm_end;
    this.tm_out = tm_out;
  }
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [HttpService]
})
export class SettingsComponent implements OnInit {

  settings:Settings;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getSettings().subscribe((data:any)=>{
      this.settings = data;
    })
  }

  edit():void{
    this.http.changeSettings(this.settings).subscribe();
  }
}

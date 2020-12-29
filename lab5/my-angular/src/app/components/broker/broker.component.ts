import { Component, OnInit } from '@angular/core';
import { HttpService} from '../../http.service';

class Broker {
  name:string;
  money:number;
  id:number;
  constructor(name: string, money: number, id: number) {
    this.name = name;
    this.money = money;
    this.id = id;
  }
}

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css'],
  providers: [HttpService]
})

export class BrokerComponent implements OnInit {

  brokers: Broker[];
  id: number;
  name:string;
  money:number;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getBrokers().subscribe((data:any)=>{
      this.brokers = data;
    })
  }

  add(): void{
    this.id = Math.floor((100) * Math.random());
    let broker = new Broker(this.name, this.money, this.id);
    this.brokers.push(broker);
    this.http.addBroker(broker).subscribe();
  }
  delete(id): void{
    for(let broker of this.brokers){
      if(broker.id === Number(id)){
        this.brokers.splice(this.brokers.indexOf(broker), 1);
      }
    }
    this.http.deleteBroker(id).subscribe();
  }

  edit(id): void{
    let br;
    for(let broker of this.brokers){
      if(broker.id === Number(id)){
        br = broker;
      }
    }
    this.http.changeBroker(id, br).subscribe();
  }

}

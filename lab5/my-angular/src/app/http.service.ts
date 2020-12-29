import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

let PORT = 3333;

@Injectable()
export class HttpService{
  constructor(private http: HttpClient){}
  getBrokers(){
    return this.http.get('http://localhost:'+PORT+'/brokers');
  }
  getStocks(){
    return this.http.get('http://localhost:'+PORT+'/stocks');
  }
  getSettings(){
    return this.http.get('http://localhost:'+PORT+'/settings');
  }

  addBroker(body){
    return this.http.put('http://localhost:'+PORT+'/brokers', body);
  }
  addStock(body){
    return this.http.put('http://localhost:'+PORT+'/stocks', body);
  }

  deleteBroker(id){
    return this.http.delete('http://localhost:'+PORT+'/brokers/'+id);
  }

  deleteStock(id){
    return this.http.delete('http://localhost:'+PORT+'/stocks/'+id);
  }

  changeBroker(id, body){
    return this.http.post('http://localhost:'+PORT+'/broker/' + id, body);
  }

  changeSettings(body){
    return this.http.post('http://localhost:'+PORT+'/settings', body);
  }

}

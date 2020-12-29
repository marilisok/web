import { Component, OnInit } from '@angular/core';
import { HttpService} from '../../http.service';

class Stock {
  id: number;
  distribution: string;
  max: number;
  price:number;
  count: number;
  constructor(id: number, distribution: string, max: number, price:number, count: number) {
    this.id = id;
    this.distribution = distribution;
    this.max = max;
    this.price = price;
    this.count = count;
  }
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers: [HttpService]
})
export class StockComponent implements OnInit {

  stocks: Stock[];
  id: number;
  max: number;
  distribution: string;
  price:number;
  count: number;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getStocks().subscribe((data:any)=>{
      this.stocks = data;
    })
  }

  add(): void{
    this.id = Math.floor((100) * Math.random());
    let stock = new Stock(this.id, this.distribution, this.max, this.price, this.count);
    this.stocks.push(stock);
    this.http.addStock(stock).subscribe();
  }
  delete(id): void{
    for(let stock of this.stocks){
      if(stock.id === Number(id)){
        this.stocks.splice(this.stocks.indexOf(stock), 1);
      }
    }
    this.http.deleteStock(id).subscribe();
  }

}

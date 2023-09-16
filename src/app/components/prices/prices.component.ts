import { Component, OnInit } from '@angular/core'
import { Product } from 'src/app/models/product'
import { ProductService } from '../../services/product.service'

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit{
  displayedColumns: string[] = ['name', 'price'];
  products: Product[] = []

  constructor(
    private prodService: ProductService,
    ) { }

  ngOnInit(): void {
    this.prodService.getProducts().subscribe((res: Product[]) => {
      this.products = res.filter((obj) => {
          return obj.show === true
      })
    })
  }
}

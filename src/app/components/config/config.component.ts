import { Component, OnInit } from '@angular/core'
import { Product } from 'src/app/models/product'
import { ProductService } from '../../services/product.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent  implements OnInit{
  displayedColumns: string[] = ['show', 'name', 'price'];
  products: Product[] = []
  show = new FormControl(true)
  name = new FormControl('')
  price = new FormControl(0)

  constructor(
    private prodService: ProductService,
    ) { }

  ngOnInit(): void {
    this.prodService.getProducts().subscribe((res: Product[]) => {
      this.products = res.sort((a, b)  => Number(b.show) - Number(a.show))
    })
  }

  addProduct() {
    console.log(this.name)
  }

  saveProduct() {

  }

  savePrice(event: any, id: string) {
    const amount = this.strToNumber(event.target.value)
    this.prodService.changePrice(id, amount)
  }

  saveShow(event: any, id: string) {
    this.prodService.changeShow(id, event.target.checked)
  }

  strToNumber(val: string) : number {
    const num = val.replace('.', '').replace(',', '.')
    return +num
  }

}


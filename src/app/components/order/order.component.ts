import { Component, OnInit } from '@angular/core'
import { Product } from 'src/app/models/product'
import { ProductService } from '../../services/product.service'
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
displayedColumns: string[] = ['quantity', 'name', 'price', 'total'];
  sale: Sale[] = []
  produtSold = new Set<Sale>()
  finalPrice = 0

  constructor(
    private prodService: ProductService,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.prodService.getProducts().subscribe((res: Product[]) => {
      var sale: Sale[] = []
      res.forEach(element => {
        sale.push({
          id: element.id,
          product: element.name,
          quant: 0,
          price: element.price,
          total: 0,
        })
        this.sale = sale
      })     
    })
  }

  onchange (event: any, el: Sale) {
    const int = event.target.value ? event.target.value  : 0
    el.quant = +int
    el.total = el.quant * el.price
    if (int == 0 ) this.produtSold.delete(el)
    else this.produtSold.add(el)
    this.getTotal()
  }
  
  order() {
    const dialogRef = this.dialog.open(userDialog,
      {
        disableClose: true, 
        autoFocus: true,
      })
    dialogRef.afterClosed().subscribe(res => {
      const msg = this.getOrderTxt(res).replace(' ', '%20')
      window.open('https://wa.me/5514998358112?text=' + msg)
    })
    }

  getOrderTxt(user: User) : string {
    var txt = 'Pedido: ' + '%0A'
    txt = txt + 'CLiente: ' + user.name + '%0A'
    txt = txt + 'Telefone:' + user.phone + '%0A'
    txt = txt + 'Endereço:' + user.address + ' - '
    txt = txt + user.complement + ' - '
    txt = txt + user.neighborhood + ' - '
    txt = txt + user.city + '%0A%0A'
    this.sale.forEach(element => {
      if (element.quant > 0) {
        txt = txt + element.quant.toString()
        txt = txt + " %20" + element.product
        txt = txt + "%0A"
      }
    })
    txt = '%0A' + txt + 'Valor total: R$ ' + this.finalPrice.toLocaleString('pt-BR', { style: "currency", currency: "BRL" })
    return txt
  }

  getTotal() {
    var total = 0
    this.sale.forEach(el => {
      total = total + el.total
    });
    this.finalPrice = total
  } 
}


interface Sale {
  id: string
  product: string,
  quant: number,
  price: number,
  total: number,
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //condition true
    const isSubmitted = form && form.submitted;
    //false
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

//Dialog Component
@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.html',
  styleUrls: ['./order.component.scss']
})
export class userDialog implements OnInit {
  form!: FormGroup
  user: User = {
    name: '',
    phone: '',
    address: '',
    complement: '',
    neighborhood: '',
    city: 'Botucatu',
  }
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<userDialog>,
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group(this.user)
  }

  dlgForm!: FormGroup
  nameFormControl = new FormControl('', [
  Validators.required,   
  ]);
  priceFormControl = new FormControl('', [
    Validators.required,
  ]);
  matcher = new MyErrorStateMatcher();

  isMatch() {
    return this.matcher
  }

  onSave() {
    this.dialogRef.close(this.form.value) 
  }

  onBack() {
    this.dialogRef.close()
  }
}

interface User {
  name: string,
  phone: string,
  address: string,
  complement: string,
  neighborhood: string,
  city: string,
}
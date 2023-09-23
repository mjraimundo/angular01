import { Component, Inject, OnInit } from '@angular/core'
import { Product } from 'src/app/models/product'
import { ProductService } from '../../services/product.service'
import {ErrorStateMatcher} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { NgForm, FormControl, Validators, FormGroupDirective, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent  implements OnInit {
  displayedColumns: string[] = ['show', 'name', 'price'];
  products: Product[] = []

  constructor(
    private prodService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.prodService.getProducts().subscribe((res: Product[]) => {
      this.products = res.sort((a, b)  => Number(b.show) - Number(a.show))
    })
  }

  addProduct() {
    const item: Product = {
      id: '',
      name: '',
      price: 0,
      show: false,
    }
    const dialogRef = this.dialog.open(addDialog,
      {
        width: '450px',
        disableClose: true, 
        autoFocus: true,
        data:{
          product: item,
          isAdd: true
        } 
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) this.prodService.addProduct(res)
      })
  }

  editProduct(item: Product) {
    const dialogRef = this.dialog.open(addDialog,
      {
      width: '450px',
      disableClose: true, 
      autoFocus: true,
      data:{
        product:item,
        isAdd: false
      } 
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        dialogRef.close
        if (res.delete) this.deleteProduct(item)
        else this.prodService.updateProduct(res)
      }
    })
  }

  deleteProduct(item: Product) {
    this.snackBar.open('O produto ' + item.name +' será excluído', 'Cancelar', {duration: 3000})
    .afterDismissed().subscribe(reason => {
      if (reason.dismissedByAction) {
        this.editProduct(item)
      } else {
      this.prodService.deleteProduct(item.id)
      }
    })
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
  selector: 'add-dialog',
  templateUrl: 'add-dialog.html',
  styleUrls: ['./config.component.scss']
})
export class addDialog implements OnInit {
  form!: FormGroup
  product: Product
  title = 'Editar Produto'
  isAdd = false

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<addDialog>,
    @Inject(MAT_DIALOG_DATA) data:any) {
      this.product = data.product,
      this.isAdd = data.isAdd
    }
 
  ngOnInit(): void {
      this.form = this.fb.group(this.product)
      if (this.isAdd) this.title = 'Adicionar Produto'
  }

  /*Form validations*/
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

  save() {
    this.dialogRef.close(this.form.value) 
  }
//Dialog close function 
  onNoClick(): void {
    this.dialogRef.close()
  }

  onDelete() {
    const send = {id: this.product.id, delete: true}
    this.dialogRef.close(send) 
  }
}
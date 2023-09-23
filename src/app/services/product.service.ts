import { Injectable } from '@angular/core';
import {
  Firestore, addDoc, collection, collectionData, query,
  doc, docData, deleteDoc, setDoc, orderBy, updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) { }

  getProducts(): Observable<Product[]> {
    const coll = collection(this.firestore, 'products')
    const ref = query(coll, orderBy('name'))
    return collectionData(ref, { idField: 'id' }) as Observable<Product[]>
  }

  getProductByID(id: string) {
    const ref = doc(this.firestore, 'products/${id}')
    return docData(ref, { idField: 'id' }) as Observable<Product>
  }

  addProduct(product: Product) {
    const prod = {
      name: product.name,
      price: product.price,
      show: product.show,
    }
    const ref = collection(this.firestore, 'products')
    return addDoc(ref, prod)
  }

  updateProduct(product: Product) {
    const ref = doc(this.firestore, `products/${product.id}`)
    return setDoc(ref, product)
  }

  changePrice(id: string, amount: number) {
    const docRef = doc(this.firestore, `products/${id}`);
    return updateDoc(docRef, { price: amount });
  }

  changeShow(id: string, visible: boolean) {
    const docRef = doc(this.firestore, `products/${id}`);
    return updateDoc(docRef, { show: visible });
  }

  deleteProduct(id: string) {
    const ref = doc(this.firestore, `products/${id}`)
    return deleteDoc(ref)
  }

}

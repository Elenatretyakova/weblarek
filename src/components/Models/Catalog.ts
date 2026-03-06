import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.products = [];
    this.selectedProduct = null;
    this.events = events;
  }

  //Методы:

  //сохранение массива товаров полученного в параметрах метода;

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalog:changed");
  }

  //получение массива товаров из модели;

  getProducts(): IProduct[] {
    return this.products;
  }

  //получение одного товара по его id;

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  //сохранение товара для подробного отображения;

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("product:selected", product);
  }

  // получение товара для подробного отображения.

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}

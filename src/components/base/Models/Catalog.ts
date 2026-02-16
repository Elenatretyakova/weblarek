import { IProduct } from "../../../types";

export class Catalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;

  constructor() {
    this.products = [];
    this.selectedProduct = null;
  }

  //Методы:

  //сохранение массива товаров полученного в параметрах метода;

  setProducts(products: IProduct[]): void {
    this.products = products;
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
  }

  // получение товара для подробного отображения.

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}

import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
  private items: IProduct[];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.items = [];
    this.events = events;
  }

  //Методы:

  //получение массива товаров, которые находятся в корзине;

  getItems(): IProduct[] {
    return this.items;
  }

  //добавление товара, который был получен в параметре, в массив корзины;

  addItem(product: IProduct): void {
    if (!this.checkHasItem(product.id)) {
      this.items.push(product);
      this.events.emit("cart:changed");
    }
  }

  //удаление товара, полученного в параметре из массива корзины;

  deleteItem(product: IProduct): void {
    this.items = this.items.filter((item) => item.id !== product.id);
    this.events.emit("cart:changed");
  }

  //очистка корзины;

  clearCart(): void {
    this.items = [];
    this.events.emit("cart:changed");
  }

  //получение стоимости всех товаров в корзине;

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  //получение количества товаров в корзине;

  getItemsCount(): number {
    return this.items.length;
  }

  //проверка наличия товара в корзине по его id, полученного в параметр метода.

  checkHasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}

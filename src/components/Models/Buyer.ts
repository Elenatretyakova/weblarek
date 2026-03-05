import { IBuyer, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private payment: TPayment;
  private address: string;
  private email: string;
  private phone: string;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events = events;
  }

  // Методы:

  //сохранение данных в модели;

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("buyer:changed");
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyer:changed");
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyer:changed");
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyer:changed");
  }

  //получение всех данных покупателя;

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  //очистка данных покупателя;

  clearData(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events.emit("buyer:changed");
  }

  // валидация данных.

  checkForm() {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (this.payment === "") {
      errors.payment = "Не выбран вид оплаты";
    }
    if (this.address === "") {
      errors.address = "Необходимо указать адрес";
    }
    if (this.email === "") {
      errors.email = "Укажите адрес электронной почты";
    }
    if (this.phone === "") {
      errors.phone = "Укажите номер телефона";
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      isValid,
      errors,
    };
  }
}

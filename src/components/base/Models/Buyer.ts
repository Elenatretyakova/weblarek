import { IBuyer, TPayment } from "../../../types";

export class Buyer {
  private payment: TPayment;
  private address: string;
  private email: string;
  private phone: string;

  constructor() {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  // Методы:

  //сохранение данных в модели;

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
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
  }

  // валидация данных.

  checkForm() {
    const errors: any = {};

    if (this.payment === "") {
      errors.payment = "Не выбран вид оплаты";
    }
    if (this.address === "") {
      errors.address = "Укажите адрес";
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

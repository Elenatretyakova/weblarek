import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IFormPaymentActions, TPayment } from "../../types";

// Форма со способом оплаты и адресом
export class FormPayment extends Form {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormPaymentActions) {
    super(container);
    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      actions?.onPaymentSelect?.("card");
    });

    this.cashButton.addEventListener("click", () => {
      actions?.onPaymentSelect?.("cash");
    });

    this.addressInput.addEventListener("input", () => {
      actions?.onAddressInput?.(this.addressInput.value);
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
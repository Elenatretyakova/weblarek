import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import {
  IBuyer,
  TPayment,
  IFormPaymentActions,
  IFormContactsActions,
} from "../../types";

interface IForm extends Partial<IBuyer> {
  errors?: string;
  valid?: boolean;
}

export class Form extends Component<IForm> {
  protected errorsElement: HTMLElement;
  protected submitButtonEl: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.submitButtonEl = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
    this.errorsElement.classList.toggle("hidden", !value);
  }

  set submitDisabled(value: boolean) {
    this.submitButtonEl.disabled = value;
  }
}

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

// форма с полями для ввода почты и телефона
export class FormContacts extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormContactsActions) {
    super(container);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      actions?.onEmailInput?.(this.emailInput.value);
    });

    this.phoneInput.addEventListener("input", () => {
      actions?.onPhoneInput?.(this.phoneInput.value);
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}

import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IFormContactsActions } from "../../types";

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


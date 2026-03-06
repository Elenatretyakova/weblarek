import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IBuyer } from "../../types";

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

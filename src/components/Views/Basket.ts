import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IBasketActions } from "../../types";

interface IBasket {
  title: string;
  button: string;
  price: number;
  items?: HTMLElement[];
}

export class Basket extends Component<IBasket> {
  protected titleElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected priceElement: HTMLElement;
  protected listElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      ".modal__title",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set button(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set items(value: HTMLElement[]) {
    this.listElement.innerHTML = "";
    value.forEach((item) => this.listElement.appendChild(item));
  }
}

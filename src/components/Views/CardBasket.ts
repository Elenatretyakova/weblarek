import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { ICardActions } from "../../types";

//карточка товара в корзине

export class CardBasket extends Card {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete.card__button",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set button(value: string) {
    this.buttonElement.textContent = value;
  }
}
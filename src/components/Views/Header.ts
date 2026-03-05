import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

// Класс отвечает за отображение на главной странице корзины со счетчиком в шапке

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}

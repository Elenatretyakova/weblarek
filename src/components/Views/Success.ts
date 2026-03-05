import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ISuccessActions } from "../../types";

interface ISuccess {
  title: string;
  description: number;
  button: string;
}

export class Success extends Component<ISuccess> {
  protected titleElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected actions?: ISuccessActions,
  ) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      ".order-success__title",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set description(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }

  set button(value: string) {
    this.buttonElement.textContent = value;
  }
}

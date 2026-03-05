import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

// Класс отвечает за отображение модального окна

export class Modal extends Component<IModal> {
  private contentElement: HTMLElement;
  private buttonClose: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.buttonClose = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.buttonClose.addEventListener("click", () => {
      this.events.emit("modal:close");
    });
    this.container.addEventListener("click", (e: MouseEvent) => {
      if (e.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }

  set content(items: HTMLElement) {
    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(items);
  }

  set visible(value: boolean) {
    this.container.classList.toggle("modal_active", value);
  }
}

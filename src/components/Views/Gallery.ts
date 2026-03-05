import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IGallery {
  catalog: HTMLElement[];
}

// Класс отвечает за отображение списка товаров на главной странице

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = ensureElement<HTMLElement>(
      ".gallery",
      this.container,
    );
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.innerHTML = "";
    items.forEach((item) => this.catalogElement.appendChild(item));
  }
}

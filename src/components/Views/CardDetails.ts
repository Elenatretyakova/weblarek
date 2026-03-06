import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { CDN_URL } from "../../utils/constants";

export class CardDetails extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const className =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this.categoryElement.className = `card__category ${className}`;
  }

  set image(value: string) {
    this.imageElement.src = CDN_URL + value;
    this.imageElement.alt = "Изображение товара";
  }
}
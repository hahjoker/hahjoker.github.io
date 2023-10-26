class InfiniteScroll {
  constructor() {
    this.container = document.querySelector(".projects");
    this.titles = [...document.querySelectorAll("h2")];
    this.clonesHeight = 0;
    this._addClonedItems();

    this._addEventListeners();
    this._updateScroll();
  }

  _addClonedItems() {
    const titleHeight = this.titles[0].getBoundingClientRect().height;
    const maxFittingItems = Math.ceil(window.innerHeight / titleHeight);

    const clonedTitles = this.titles
      .filter((title, index) => index < maxFittingItems)
      .map((title) => title.cloneNode(true));

    this.clonesHeight = titleHeight * clonedTitles.length;
    clonedTitles.forEach((title) => this.container.appendChild(title));
  }

  _currentScroll() {
    const currentContainerScroll =
      (this.container.pageYOffset || this.container.scrollTop) -
      (this.container.clientTop || 0);
    return currentContainerScroll;
  }

  scrollPosition(position) {
    this.container.scrollTop = position;
  }

  _highlightTitle() {
    this.container.querySelectorAll("h2").forEach((title) => {
      const { top, bottom, height } = title.getBoundingClientRect();
      const isInMiddle =
        top < window.innerHeight / 2 && bottom > window.innerHeight / 2;

      if (isInMiddle) {
        title.classList.add("active");
      } else {
        title.classList.remove("active");
      }
    });
  }

  _updateScroll(event) {
    this.current =
      (this.container.pageYOffset || this.container.scrollTop) -
      (this.container.clientTop || 0);

    if (this.clonesHeight + this.current >= this.container.scrollHeight) {
      this.scrollPosition(1);
    } else if (this.current <= 0) {
      this.scrollPosition(this.container.scrollHeight - this.clonesHeight);
    }

    this._highlightTitle();
  }

  _addEventListeners() {
    this.container.addEventListener("scroll", this._updateScroll.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new InfiniteScroll();
});

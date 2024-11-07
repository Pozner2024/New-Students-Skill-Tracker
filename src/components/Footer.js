import Section from "../common/Section";

export default class Footer extends Section {
  constructor() {
    super({ id: "footer", customClass: "site-footer" });
  }

  render() {
    return `<section id="${this.id}" class="${this.id} ${this.customClass}">
              <footer>© 2024 All looks good and you are the best! </footer>
            </section>`;
  }
}

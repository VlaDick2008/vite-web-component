import "./normalize.css";

class FileUploader extends HTMLElement {
	private shadow: ShadowRoot;

	constructor() {
		super();

		this.shadow = this.attachShadow({ mode: "open" });
		this.render();
	}

	private render(): void {
		// Стилизация
		const style = document.createElement("style");
		style.textContent = `
      .formContainer {
        background-color: red;
        width: 100px;
        height: 100px;
      }
    `;
		this.shadow.appendChild(style);

		// Контейнер формы
		const formContainer = document.createElement("div");
		formContainer.className = "formContainer";

		// Форма
		const form = document.createElement("form");
		form.id = "uploadForm";
		formContainer.appendChild(form);

		this.shadow.appendChild(formContainer);
	}
}

customElements.define("file-uploader", FileUploader);

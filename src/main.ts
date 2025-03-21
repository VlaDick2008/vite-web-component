import "./normalize.css";
import cross from "/cross.svg?url";

class FileUploader extends HTMLElement {
	private shadow: ShadowRoot;
	private isTitleWriten: boolean;

	constructor() {
		super();

		this.isTitleWriten = false;
		this.shadow = this.attachShadow({ mode: "open" });
		this.render();
	}

	private render(): void {
		// Стилизация
		const style = document.createElement("style");
		style.textContent = `
      .formContainer {
        background: linear-gradient(180deg, rgba(95,92,240,1) 0%, rgba(221,220,252,1) 69%, rgba(255,255,255,1) 100%);
        display: flex;
        flex-direction: column;
        border-radius: 16px;
				padding: 13px;
				color: white;
				text-align: center;
				gap: 5px;
				width: 300px;
      }
			.closeButton {
				background: rgba(255, 255, 255, 0.3);
				border: none;
				padding: 5px;
				line-height: 0;
				border-radius: 9999px;
				cursor: pointer;
				font-size: 26px;
				color: white;
				transition: all 0.2s ease-in-out;
				align-self: flex-end;
			}
			.closeButton:hover {
				background: rgba(255, 255, 255, 0.4);
			}
			.headlineWrapper {
				display: flex;
				flex-direction: column;
			}
      .headlineOne {
        font-size: 20px;
        font-weight: 500;
				margin: 0;
				padding: 0;
      }
      .headlineTwo {
        font-size: 14px;
        font-weight: 300;
				margin: 0;
				padding: 0;
      }
			.fileNameInputWrapper {
				position: relative;
				width: 100%;
				
			}
			.fileNameInput {
				font-size: 17px;
				font-weight: 500;
				border-radius: 10px;
				padding: 6px 9px;
				border-color: #A5A5A5;
				border-width: 1px;
				width: 92%;
				color: #A5A5A5;
				transition: all 0.2s ease-in-out;
			}
			.fileNameInput:focus {
				outline: none;
			}
			.clearFieldButton {
				position: absolute;
				right: 2px;
				top: 2px;
				background: none;
				border: none;
				cursor: pointer;
				font-size: 26px;
				color: #A5A5A5;
				transition: all 0.2s ease-in-out;
			}
    `;
		this.shadow.appendChild(style);

		// Контейнер формы
		const formContainer = document.createElement("div");
		formContainer.className = "formContainer";

		// Кнопка закрытия формы
		const closeButton = document.createElement("button");
		const closeCrossIcon = document.createElement("img");
		closeCrossIcon.src = cross;
		closeCrossIcon.alt = "Clear";
		closeCrossIcon.style.filter = "invert(100%) saturate(100%)";
		closeButton.className = "closeButton";
		closeButton.appendChild(closeCrossIcon);
		closeButton.addEventListener("click", () => {
			console.log("close");
		});

		formContainer.appendChild(closeButton);

		// Заголовки
		const headlineWrapper = document.createElement("div");
		headlineWrapper.className = "headlineWrapper";

		const headlineOne = document.createElement("h1");
		headlineOne.className = "headlineOne";
		headlineOne.textContent = "Загрузочное окно";

		const headlineTwo = document.createElement("h2");
		headlineTwo.className = "headlineTwo";
		headlineTwo.textContent = "Перед загрузкой дайте имя файлу";

		headlineWrapper.appendChild(headlineOne);
		headlineWrapper.appendChild(headlineTwo);

		formContainer.appendChild(headlineWrapper);

		// Поле имени файла
		const fileNameInputWrapper = document.createElement("div");
		fileNameInputWrapper.className = "fileNameInputWrapper";

		const clearFieldButton = document.createElement("button");
		const clearCrossIcon = document.createElement("img");
		clearCrossIcon.src = cross;
		clearCrossIcon.alt = "Clear";
		clearCrossIcon.style.filter = "invert(40%)";
		clearFieldButton.appendChild(clearCrossIcon);
		clearFieldButton.className = "clearFieldButton";

		const fileNameInput = document.createElement("input");
		fileNameInput.type = "text";
		fileNameInput.id = "fileName";
		fileNameInput.placeholder = "Название файла";
		fileNameInput.className = "fileNameInput";

		fileNameInput.addEventListener("input", () => {
			this.isTitleWriten = !!fileNameInput.value;
			fileNameInput.style.color = this.isTitleWriten ? "#5F5CF0" : "#A5A5A5";
			clearCrossIcon.style.filter = this.isTitleWriten
				? "invert(37%) sepia(92%) saturate(5000%) hue-rotate(226deg) brightness(90%) contrast(97%)"
				: "invert(40%)";
			headlineTwo.textContent = this.isTitleWriten
				? "Перенесите ваш файл в область ниже"
				: "Перед загрузкой дайте имя файлу";
		});

		clearFieldButton.onclick = () => {
			fileNameInput.value = "";
			this.isTitleWriten = false;
			headlineTwo.textContent = "Перед загрузкой дайте имя файлу";
		};

		fileNameInputWrapper.appendChild(fileNameInput);
		fileNameInputWrapper.appendChild(clearFieldButton);

		formContainer.appendChild(fileNameInputWrapper);

		// Форма
		const form = document.createElement("form");
		form.id = "uploadForm";
		formContainer.appendChild(form);

		this.shadow.appendChild(formContainer);
	}
}

customElements.define("file-uploader", FileUploader);

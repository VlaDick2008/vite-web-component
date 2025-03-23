import "./normalize.css";
import cross from "/cross.svg?url";
import drop from "/docs-pic.svg?url";

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
		// == Вёрстка ==
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
				gap: 10px;
				width: 300px;
				position: relative;
				box-shadow: 1px 1px 25px 0px rgba(0,0,0,0.75);
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
				position: absolute;
				right: 13px;
			}
			.closeButton:hover {
				background: rgba(255, 255, 255, 0.4);
			}
			.headlineWrapper {
				display: flex;
				flex-direction: column;
				margin-top: 20px;
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
				border: 1px solid #A5A5A5;
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
			.dropZone {
				width: 100%;
				padding: 50px 0;
				gap: 22px;
				background: rgba(255, 255, 255, 0.3);
				border: 1px solid #A5A5A5;
				border-radius: 30px;
				display: flex;
				flex-direction: column-reverse;
				cursor: pointer;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				color: #5F5CF0;
			}
			.submitButton {
				background-color: #5F5CF0;
				width: 100%;
				padding: 17px 0;
				margin-top: 10px;
				border-radius: 9999px;
				border: none;
				color: white;
				font-size: 20px;
				cursor: pointer;
				transition: all 0.2s ease-in-out;
			}
			.submitButton:hover {
				background-color: #3e3ed8;
			}
			.submitButton:disabled {
				background-color: #BBB9D2;
				cursor: not-allowed;
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
		fileNameInput.setAttribute("form", "uploadForm");
		fileNameInput.placeholder = "Название файла";
		fileNameInput.className = "fileNameInput";

		fileNameInputWrapper.appendChild(fileNameInput);
		fileNameInputWrapper.appendChild(clearFieldButton);

		formContainer.appendChild(fileNameInputWrapper);

		// Форма
		const form = document.createElement("form");
		form.id = "uploadForm";
		formContainer.appendChild(form);

		// Поле для файла
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = ".txt,.json,.csv";
		fileInput.style.display = "none";

		const dropZone = document.createElement("div");
		dropZone.className = "dropZone";
		dropZone.textContent = "Перенесите ваш в файл в эту область";

		const dropZoneImg = document.createElement("img");
		dropZoneImg.src = drop;
		dropZoneImg.alt = "Drop";

		dropZone.appendChild(dropZoneImg);

		form.appendChild(fileInput);
		form.appendChild(dropZone);

		this.shadow.appendChild(formContainer);

		// Кнопка отправки
		const submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.className = "submitButton";
		submitButton.textContent = "Отправить";
		submitButton.disabled = !this.isTitleWriten;
		form.appendChild(submitButton);

		// == Функционал ==
		// Кнопка закрытия формы
		closeButton.addEventListener("click", () => {
			console.log("close");
		});

		// Изменение цвета в зависимости от наличия текста
		fileNameInput.addEventListener("input", () => {
			this.isTitleWriten = !!fileNameInput.value;

			fileNameInput.style.color = this.isTitleWriten ? "#5F5CF0" : "#A5A5A5";
			clearCrossIcon.style.filter = this.isTitleWriten
				? "invert(37%) sepia(92%) saturate(5000%) hue-rotate(226deg) brightness(90%) contrast(97%)"
				: "invert(40%)";
			headlineTwo.textContent = this.isTitleWriten
				? "Перенесите ваш файл в область ниже"
				: "Перед загрузкой дайте имя файлу";

			submitButton.disabled = !this.isTitleWriten;
		});

		// Кнопка очистки поля имени файла
		clearFieldButton.onclick = () => {
			fileNameInput.value = "";
			fileNameInput.style.color = "#A5A5A5";
			clearCrossIcon.style.filter = "invert(40%)";
			this.isTitleWriten = false;
			headlineTwo.textContent = "Перед загрузкой дайте имя файлу";
		};

		// Отправка формы
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			this.handleUpload();
		});

		// Обработка файла в input
		fileInput.addEventListener("change", () => {
			console.log("file change");
		});
	}

	private handleUpload(): void {}
}

customElements.define("file-uploader", FileUploader);

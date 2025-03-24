import axios from "axios";

import "./normalize.css";
import cross from "/cross.svg?url";
import drop from "/docs-pic.svg?url";

class FileUploader extends HTMLElement {
	private shadow: ShadowRoot;
	private isTitleWriten: boolean;
	private formSendStatus: boolean | unknown;
	private apiRes:
		| {
				message: string;
				filename: string;
				nameField: string;
				timestamp: string;
		  }
		| { error: string };

	constructor() {
		super();

		this.isTitleWriten = false;
		this.apiRes = { error: "" };
		this.shadow = this.attachShadow({ mode: "open" });
		this.render();
	}

	private render(): void {
		// == Вёрстка ==
		// Стилизация
		const style = document.createElement("style");
		style.textContent = `
      .formContainer {
        background: linear-gradient(to bottom, #5F5CF0 0%, #DDDCFC 43%, #FFFFFF 100%);
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
				transition: background-color 0.2s ease-in-out;
      }
			.closeButton {
				background: rgba(255, 255, 255, 0.3);
				border: none;
				padding: 8px;
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
        font-weight: 600;
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
				right: 6px;
				top: -1px;
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
				flex: 1;
				background: rgba(255, 255, 255, 0.3);
				border: 1px solid #A5A5A5;
				border-radius: 30px;
				display: flex;
				flex-direction: column-reverse;
				cursor: pointer;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				font-weight: 400;
				color: #5F5CF0;
				transition: all 0.3s ease-out;
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
			.progressBarWrapper {
				border: 1px solid #A5A5A5;
				border-radius: 10px;
				justify-content: space-between;
				align-items: center;
				padding: 3px;
				margin-top: 10px;
				background-color: white;
				display: flex;
				color: #5F5CF0;
				gap: 15px;
				visibility: hidden;
				position: absolute;
			}
			.progressBarIndicator {
				background-color: #5F5CF0;
				border-radius: 10px;
				height: 30px;
				width: 55px;
			}
			.progressBarLabel {
				font-size: 10px;
				border: none;
				background-color: white;
			}
			.progressBar {
				width: 100%;
				height: 10px;
			}
			.progressBarCancelButton {
				background: none;
				border: none;
				cursor: pointer;
				font-size: 26px;
				filter: invert(37%) sepia(92%) saturate(5000%) hue-rotate(226deg) brightness(90%) contrast(97%);
				transition: all 0.2s ease-in-out;
				line-height: 0;
			}
			.responceBlock {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				display: none;
				transition: all 0.2s ease-in-out;
				padding: 50px 0;
			}
			.responceBlockHeading {
				font-size: 20px;
				font-weight: 600;
			}
			.responceBlockDescription {
				font-size: 14px;
				font-weight: 300;
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
		fileNameInput.id = "fileNameInput";
		fileNameInput.setAttribute("form", "uploadForm");
		fileNameInput.placeholder = "Название файла";
		fileNameInput.className = "fileNameInput";

		fileNameInputWrapper.appendChild(fileNameInput);
		fileNameInputWrapper.appendChild(clearFieldButton);

		formContainer.appendChild(fileNameInputWrapper);

		// Форма
		const form = document.createElement("form");
		form.id = "uploadForm";
		form.style.display = "flex";
		form.style.flexDirection = "column";
		formContainer.appendChild(form);

		// Поле для файла
		const fileInput = document.createElement("input");
		fileInput.id = "fileInput";
		fileInput.type = "file";
		fileNameInput.setAttribute("form", "uploadForm");
		fileInput.accept = ".txt,.json,.csv";
		fileInput.disabled = true;
		fileInput.style.display = "none";

		const dropZone = document.createElement("div");
		dropZone.className = "dropZone";
		dropZone.style.opacity = "0.5";
		dropZone.style.cursor = "not-allowed";

		const dropZoneImg = document.createElement("img");
		dropZoneImg.src = drop;
		dropZoneImg.alt = "Drop";

		const dropZoneText = document.createElement("span");
		dropZoneText.textContent = "Перенесите ваш в файл в эту область";

		dropZone.appendChild(dropZoneText);
		dropZone.appendChild(dropZoneImg);

		form.appendChild(fileInput);
		form.appendChild(dropZone);

		// Полоса загрузки
		const progressBarWrapper = document.createElement("div");
		progressBarWrapper.className = "progressBarWrapper";

		const progressBarIndicator = document.createElement("div");
		progressBarIndicator.className = "progressBarIndicator";

		const progressBarInnerWrapper = document.createElement("div");
		progressBarInnerWrapper.style.display = "flex";
		progressBarInnerWrapper.style.flexDirection = "column";
		progressBarInnerWrapper.style.alignItems = "baseline";
		progressBarInnerWrapper.style.width = "100%";

		const progressBar = document.createElement("progress");
		progressBar.className = "progressBar";
		progressBar.max = 100;
		progressBar.value = 0;

		const progressBarLabelWrapper = document.createElement("div");
		progressBarLabelWrapper.style.display = "flex";
		progressBarLabelWrapper.style.justifyContent = "space-between";
		progressBarLabelWrapper.style.width = "100%";
		const progressBarLabel = document.createElement("span");
		progressBarLabel.className = "progressBarLabel";
		const progressBarLabelPercent = document.createElement("span");
		progressBarLabelPercent.className = "progressBarLabel";

		const progressBarCancelButton = document.createElement("button");
		progressBarCancelButton.className = "progressBarCancelButton";
		const progressBarCancelCrossIcon = document.createElement("img");
		progressBarCancelCrossIcon.src = cross;
		progressBarCancelCrossIcon.alt = "Clear";

		progressBarLabelWrapper.appendChild(progressBarLabel);
		progressBarCancelButton.appendChild(progressBarCancelCrossIcon);
		progressBarLabelWrapper.appendChild(progressBarLabelPercent);
		progressBarInnerWrapper.appendChild(progressBarLabelWrapper);
		progressBarInnerWrapper.appendChild(progressBar);

		progressBarWrapper.appendChild(progressBarIndicator);
		progressBarWrapper.appendChild(progressBarInnerWrapper);
		progressBarWrapper.appendChild(progressBarCancelButton);

		form.appendChild(progressBarWrapper);

		// Кнопка отправки
		const submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.className = "submitButton";
		submitButton.textContent = "Отправить";
		submitButton.disabled = true;
		form.appendChild(submitButton);

		const responseBlock = document.createElement("div");
		responseBlock.className = "responceBlock";
		const responseBlockHeading = document.createElement("h2");
		responseBlockHeading.className = "responceBlockHeading";
		const responseBlockDescription = document.createElement("span");
		responseBlockDescription.className = "responceBlockDescription";

		responseBlock.appendChild(responseBlockHeading);
		responseBlock.appendChild(responseBlockDescription);

		formContainer.appendChild(responseBlock);

		this.shadow.appendChild(formContainer);

		// == Функционал ==
		// Кнопка закрытия формы
		closeButton.addEventListener("click", () => {
			this.isTitleWriten = false;
			this.formSendStatus = undefined;

			fileInput.value = "";
			fileNameInput.value = "";
			headlineTwo.textContent = "Перед загрузкой дайте имя файлу";
			submitButton.disabled = true;

			formContainer.style.background = "";
			headlineWrapper.style.display = "flex";
			fileNameInputWrapper.style.display = "flex";
			form.style.display = "flex";
			responseBlock.style.display = "none";

			fileNameInputWrapper.style.translate = "translateY(-20px)";
			fileNameInputWrapper.style.opacity = "1";
			fileNameInputWrapper.style.visibility = "";
			fileNameInputWrapper.style.position = "";

			dropZone.style.opacity = "0.5";
			dropZone.style.cursor = "not-allowed";

			progressBarWrapper.style.visibility = "hidden";
			progressBarWrapper.style.position = "absolute";
		});

		// Изменение цвета в зависимости от наличия текста и отслеживание ввода имени файла
		fileNameInput.addEventListener("input", () => {
			this.isTitleWriten = !!fileNameInput.value;

			if (this.isTitleWriten) {
				fileInput.disabled = false;
				dropZone.style.opacity = "1";
				dropZone.style.cursor = "pointer";
			} else {
				fileInput.disabled = true;
				dropZone.style.opacity = "0.5";
				dropZone.style.cursor = "not-allowed";
			}

			fileNameInput.style.color = this.isTitleWriten ? "#5F5CF0" : "#A5A5A5";
			clearCrossIcon.style.filter = this.isTitleWriten
				? "invert(37%) sepia(92%) saturate(5000%) hue-rotate(226deg) brightness(90%) contrast(97%)"
				: "invert(40%)";
			headlineTwo.textContent = this.isTitleWriten
				? "Перенесите ваш файл в область ниже"
				: "Перед загрузкой дайте имя файлу";

			if (fileInput.files && fileInput.files.length > 0 && this.isTitleWriten) {
				submitButton.disabled = false;
			}
		});

		// Кнопка очистки поля имени файла
		clearFieldButton.onclick = () => {
			this.isTitleWriten = false;
			fileInput.disabled = true;
			fileNameInput.value = "";
			fileNameInput.style.color = "#A5A5A5";
			clearCrossIcon.style.filter = "invert(40%)";
			headlineTwo.textContent = "Перед загрузкой дайте имя файлу";
			dropZone.style.opacity = "0.5";
			dropZone.style.cursor = "not-allowed";
			submitButton.disabled = true;
		};

		// Отправка формы
		form.addEventListener("submit", (e) => {
			e.preventDefault();

			submitButton.disabled = true;
			fileInput.disabled = true;
			if (this.isTitleWriten && fileInput.files && fileInput.files.length > 0) {
				this.handleUpload(e, fileInput.files[0], fileNameInput.value);

				fileInput.value = "";
				fileNameInput.value = "";
				return;
			}
		});

		// Обработка файла в input и dropZone и отслеживание ввода имени файла
		fileInput.addEventListener("change", () => {
			if (!fileInput.files || fileInput.files.length <= 0) {
				dropZoneText.textContent = "Перенесите ваш в файл в эту область";
				return;
			}

			if (!this.isTitleWriten) {
				submitButton.disabled = true;
				return;
			}

			if (fileInput.disabled) {
				dropZoneText.textContent = "Дайте имя вашему файлу";
				return;
			}

			if (!this.validateFile(fileInput.files[0])[1]) {
				dropZoneText.textContent = this.validateFile(fileInput.files[0])[0];
				return;
			}

			// Анимации при загрузке файла
			fileNameInputWrapper.style.translate = "translateY(20px)";
			fileNameInputWrapper.style.opacity = "0";
			fileNameInputWrapper.style.position = "absolute";
			fileNameInputWrapper.style.transition = "all 0.3s ease-out";

			setTimeout(() => {
				fileNameInputWrapper.style.visibility = "hidden";
			}, 300);

			progressBarWrapper.style.visibility = "visible";
			progressBarWrapper.style.position = "relative";
			progressBarWrapper.style.transition = "all 0.3s ease-out";

			progressBarLabel.textContent = `${fileNameInput.value}.${this.validateFile(fileInput.files[0])[0]}`;

			progressBarAnimation();
		});
		dropZone.addEventListener("click", (e) => {
			fileInput.click();
		});
		dropZone.addEventListener("dragover", (e) => {
			e.preventDefault();
			dropZone.style.opacity = "0.5";
		});
		dropZone.addEventListener("dragleave", (e) => {
			e.preventDefault();
			if (!fileInput.disabled) {
				dropZone.style.opacity = "1";
			}
		});
		dropZone.addEventListener("drop", (e) => {
			e.preventDefault();

			if (fileInput.disabled) {
				dropZoneText.textContent = "Дайте имя вашему файлу";
				return;
			}

			dropZone.style.opacity = "1";

			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
				const file = e.dataTransfer.files[0];
				const isFileValid = this.validateFile(file);

				if (!isFileValid[1]) {
					dropZoneText.textContent = isFileValid[0];
					return;
				}

				const dt = new DataTransfer();
				dt.items.add(file);
				fileInput.files = dt.files;
				fileInput.dispatchEvent(new Event("change"));
			}
		});

		// Анимация полосы загрузки и связаная с ней логика
		const progressBarAnimation = () => {
			// Смотритель для отслеживания прогресса
			const progressObserver = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (
						mutation.type === "attributes" &&
						mutation.attributeName === "value"
					) {
						if (progressBar.value === 100) {
							submitButton.disabled = false;
						}
					}
				}
			});

			progressObserver.observe(progressBar, {
				attributes: true,
			});

			// Анимация
			let progress = 0;
			const progressInterval = setInterval(() => {
				if (progress < 100) {
					progress++;
					progressBar.value = progress;
					progressBarLabelPercent.textContent = `${progress}%`;
				} else {
					clearInterval(progressInterval);
				}
			}, 1);
		};

		// Кастомный ивент для отображения ответа от API
		this.addEventListener("responseBlock", () => {
			const apiResArray = Object.entries(this.apiRes).map(
				([key, value]) => `${key}: ${value}`,
			);
			responseBlockDescription.textContent = apiResArray.join("\n");

			if (this.formSendStatus) {
				responseBlockHeading.textContent = "Файл успешно загружен";
				formContainer.style.background =
					"linear-gradient(to bottom, #5F5CF0, #8F8DF4)";
			} else {
				responseBlockHeading.textContent = "Ошибка в загрузке файла";
				formContainer.style.background =
					"linear-gradient(to bottom, #F05C5C, #8F8DF4)";
			}

			headlineWrapper.style.display = "none";
			fileNameInputWrapper.style.display = "none";
			form.style.display = "none";

			responseBlock.style.display = "flex";
		});
	}

	// Проверка на валидность файла. Возвращает строку для отображения в drag and drop окне в случае ошибки, и тип файла в случае успеха
	private validateFile(file: File): [string, boolean] {
		const allowedExtensions = ["txt", "json", "csv"];
		const fileExtention = file.name.split(".").pop()?.toLowerCase();

		if (!fileExtention || !allowedExtensions.includes(fileExtention)) {
			return ["Неверный формат файла", false];
		}
		if (file.size > 1024) {
			return ["Файл слишком большой", false];
		}
		return [fileExtention, true];
	}

	// Отправка файла
	private async handleUpload(e: Event, file: File, fileName: string) {
		const responseBlock = new CustomEvent("responseBlock");
		try {
			if (!file || !fileName) {
				throw new Error();
			}

			const formData = new FormData();
			formData.append("file", file);
			formData.append("name", fileName);

			await axios
				.post(
					"https://file-upload-server-mc26.onrender.com/api/v1/upload",
					{
						file: file,
						name: fileName,
					},
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					},
				)
				.then((res) => {
					this.apiRes = res.data;
					this.formSendStatus = true;
					return;
				})
				.catch((err) => {
					this.apiRes = err.response.data;
					this.formSendStatus = false;
					throw new Error();
				});

			this.formSendStatus = true;
		} catch (err) {
			console.error("Error sending file");
			this.formSendStatus = false;
			return;
		} finally {
			this.dispatchEvent(responseBlock);
		}
	}
}

customElements.define("file-uploader", FileUploader);

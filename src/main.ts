import "./style.css";

class FileUploader extends HTMLElement {
	// biome-ignore lint: Web Component requires constructor with super()
	constructor() {
		super();
	}
}

customElements.define("file-uploader", FileUploader);

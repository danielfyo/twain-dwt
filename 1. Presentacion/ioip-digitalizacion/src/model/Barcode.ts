export class Barcode {
    constructor() {
        this.barcodeId = undefined;
        this.format = undefined;
        this.formatCode = undefined;
        this.value = undefined;
        this.barcodeBase64 = undefined;
        this.xPositio = undefined;
        this.yPosition = undefined;
    }

    barcodeId?: number;
    format?: string;
    formatCode?: number;
    value?: string;
    barcodeBase64?: string;
    xPositio?: number;
    yPosition?: number
}
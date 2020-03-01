import { Barcode } from './Barcode';
export class SheetDto {
    constructor() {
        this.sheetId = undefined;
        this.sheetBase64 = undefined;
        this.barcodes = undefined;
        this.paragraphFromOcr = undefined;
    }

    sheetId?: number;
    sheetBase64?: string;
    barcodes?: Barcode[];
    paragraphFromOcr?: string[];
}
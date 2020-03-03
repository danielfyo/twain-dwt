export class DigitalizationRequest {
    constructor() {
        this.sourceIndex = undefined;
        this.showUi = undefined;
        this.pixelType = undefined;
        this.resolution = undefined;
        this.adf = undefined;
    }

    sourceIndex?: number;
    showUi?: boolean;
    duplex?: boolean;
    pixelType?: number;
    resolution?: string;
    adf?: string;
}
import React, { Component } from 'react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib';
import { DigitalizationRequest } from '../../model/DigitalizationRequest';
export class ConfirmationPanel extends Component<any, any> {

    setPanelScanState(panelScan: any) {
        this.setState(panelScan);
    }

    addImage() {

        let scanRequest = new DigitalizationRequest();
        scanRequest.sourceIndex = this.props.source_onchange;
        scanRequest.adf = this.props.source_onchange;
        scanRequest.pixelType = this.props.source_onchange;
        scanRequest.resolution = this.props.source_onchange;
        scanRequest.showUi = this.props.source_onchange;
        
        this.props.handleAddImage(this.props.source_onchange);
        this.hidePanel();
    }

    hidePanel() {
        this.setState(
            {
                panelScan:
                {
                    isOpen: false
                }
            });
    }

    constructor(props: any) {
        super(props);

        this.state = {
            panelScan: {
                isOpen: false
            }
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <Panel
                    isOpen={this.state.panelScan.isOpen}
                    hasCloseButton={true}
                    closeButtonAriaLabel="Cerrar"
                    headerText={this.state.panelScan.panelTitle}
                    onRenderFooterContent={() =>
                        <div className='ms-Grid-row'>
                            <div className='ms-Grid-col'>
                                <DefaultButton
                                    iconProps={{ iconName: 'Back' }}
                                    onClick={() => this.hidePanel()}>
                                    Volver
                </DefaultButton>
                                &nbsp;&nbsp;
              <PrimaryButton
                                    iconProps={{ iconName: 'Accept' }}
                                    onClick={() => this.addImage()}>Digitalizar</PrimaryButton>
                            </div>
                        </div>
                    }
                >
                    <p>{this.state.panelScan.panelDescription}</p>

                    <div id="ScanWrapper">
                        <div id="divScanner" className="divinput">
                            <ul className="PCollapse">
                                <li>
                                    <div className="divType">
                                        <div className="mark_arrow expanded"></div>
                                        Adquirir imágenes desde escáner</div>
                                    <div id="div_ScanImage" className="divTableStyle">
                                        <ul id="ulScaneImageHIDE">
                                            <li>
                                                <label htmlFor="source">
                                                    <p>Seleccione la fuente:</p>
                                                </label>
                                                <select id="source" style={{ position: "relative" }} onChange={this.props.source_onchange}>
                                                    <option value="0">Buscando dispositivos compatibles..</option></select>
                                            </li>
                                            <li id="divProductDetail">
                                                <ul id="divTwainType">
                                                    <li>
                                                        <label id="lblShowUI" htmlFor="ShowUI">
                                                            <input type="checkbox" id="ShowUI" onChange={this.props.showUi}/>Avanzado
                                            </label>
                                                        <label htmlFor="ADF">
                                                            <input type="checkbox" id="ADF"  onChange={this.props.adf}/>Alim. auto.
                                            </label>
                                                        <label htmlFor="Duplex">
                                                            <input type="checkbox" id="Duplex" onChange={this.props.duplex}/>Dob. cara
                                            </label>
                                                    </li>
                                                    <li>Color:
                                            <label htmlFor="BW" style={{ marginLeft: "5px" }}>
                                                            <input type="radio" id="BW" name="PixelType" />B y N
                                            </label>
                                                        <label htmlFor="Gray">
                                                            <input type="radio" id="Gray" name="PixelType" />Esc. Grises
                                            </label>
                                                        <label htmlFor="RGB">
                                                            <input type="radio" id="RGB" name="PixelType" />Color
                                            </label>
                                                    </li>
                                                    <li>
                                                        <span>Resolución:</span>
                                                        <select id="Resolution">
                                                            <option value="500">500</option>
                                                            <option value="400">400</option>
                                                            <option value="300">300</option>
                                                            <option value="200">200</option>
                                                            <option value="100">100</option>
                                                            <option value="100">50</option>
                                                        </select>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <div id="tblLoadImage" style={{ visibility: "hidden" }}>
                                            <a href="return false" className="ClosetblLoadImage"><img src="Images/icon-ClosetblLoadImage.png" alt="Close tblLoadImage" /></a>
                                            <p>Por favor instale un dispositivo compatible con TWAIN:</p>
                                            <p>
                                                <a target="_blank" rel="noopener noreferrer" href="http://www.twain.org">Referencia TWG </a>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>


                        <div id="divUpload" className="divinput mt30" style={{ position: "relative" }}>
                            <ul>
                                <li className="toggle">Guardar documentos</li>
                                <li>
                                    <p>Nombre de archivo:</p>
                                    <input type="text" id="txt_fileName" />
                                </li>
                                <li style={{ paddingRight: "0" }}>
                                    <label htmlFor="imgTypebmp">
                                        <input type="radio" value="bmp" name="ImageType" id="imgTypebmp" onClick={this.props.rd_onclick} />
                                        BMP</label>
                                    <label htmlFor="imgTypejpeg">
                                        <input type="radio" value="jpg" name="ImageType" id="imgTypejpeg" onClick={this.props.rd_onclick} />
                                        JPEG</label>
                                    <label htmlFor="imgTypetiff">
                                        <input type="radio" value="tif" name="ImageType" id="imgTypetiff" onClick={this.props.rdTIFF_onclick} />
                                        TIFF</label>
                                    <label htmlFor="imgTypepng">
                                        <input type="radio" value="png" name="ImageType" id="imgTypepng" onClick={this.props.rd_onclick} />
                                        PNG</label>
                                    <label htmlFor="imgTypepdf">
                                        <input type="radio" value="pdf" name="ImageType" id="imgTypepdf" onClick={this.props.rdPDF_onclick} />
                                        PDF</label>
                                </li>
                                <li>
                                    <label htmlFor="MultiPageTIFF">
                                        <input type="checkbox" id="MultiPageTIFF" />
                                        Multi-página TIFF</label>
                                    <label htmlFor="MultiPagePDF">
                                        <input type="checkbox" id="MultiPagePDF" />
                                        Multi-página PDF</label>
                                </li>
                                <li>
                                    <button id="btnSave" className="btnOrg" onClick={() => { this.props.saveUploadImage('local') }} >Descargar</button>
                                    <button id="btnUpload" className="btnOrg" onClick={() => { this.props.saveUploadImage('server') }} >Cargar</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Panel>
            </div>
        );
    };
}
export default ConfirmationPanel;
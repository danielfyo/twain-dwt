import React from 'react';
import ReactDOM from 'react-dom';

import './WebTwain.css';
import WebBarcode from '../barcode/WebBarcode';

import Dynamsoft from 'dwt';
import $ from 'jquery';

class UI extends React.Component {
    render() {
        return (
            <div id="DWTcontainer" className="container">
                <div id="DWTcontainerTop">
                    <div id="divEdit">
                        <ul className="operateGrp">
                            <li><img src="Images/ShowEditor.png" title="Mostrar editor de imagen" alt="Mostrar Editor" id="btnEditor" onClick={this.props.btnShowImageEditor_onclick} /> </li>
                            <li><img src="Images/RotateLeft.png" title="Rotar a la izquierda" alt="Rotar a la izquierda" id="btnRotateL" onClick={this.props.btnRotateLeft_onclick} /> </li>
                            <li><img src="Images/RotateRight.png" title="Rotar a la derecha" alt="Rotate Right" id="btnRotateR" onClick={this.props.btnRotateRight_onclick} /> </li>
                            <li><img src="Images/Rotate180.png" alt="Rotar 180" title="Rotar 180" onClick={this.props.btnRotate180_onclick} /> </li>
                            <li><img src="Images/Mirror.png" title="Espejo horizontal" alt="Espejo horizontal" id="btnMirror" onClick={this.props.btnMirror_onclick} /> </li>
                            <li><img src="Images/Flip.png" title="Espejo vertical" alt="Espejo vertical" id="btnFlip" onClick={this.props.btnFlip_onclick} /> </li>
                            <li><img src="Images/RemoveSelectedImages.png" title="Eliminar imagen" alt="Eliminar imagen" id="DW_btnRemoveCurrentImage" onClick={this.props.btnRemoveCurrentImage_onclick} /></li>
                            <li><img src="Images/RemoveAllImages.png" title="Eliminar todas las imagenes" alt="Eliminar todas las imagenes" id="DW_btnRemoveAllImages" onClick={this.props.btnRemoveAllImages_onclick} /></li>
                            <li><img src="Images/ChangeSize.png" title="Cambiar tamaño de imagen" alt="Cambiar tamaño" id="btnChangeImageSize" onClick={this.props.btnChangeImageSize_onclick} /> </li>
                            <li><img src="Images/Crop.png" title="Recortar" alt="Recortar" id="btnCrop" /></li>
                            <li id="btnBarcode"><img src="Images/barcode.png" title="Código de barras" alt="OCR"  /></li>
                            <li id="btnOcr"><img src="Images/ocr.png" title="OCR" alt="OCR"  /></li>
                        </ul>
                        <div id="ImgSizeEditor" style={{ visibility: "hidden" }}>
                            <ul>
                                <li>
                                    <label htmlFor="img_height">Nuevo alto :
                                        <input type="text" id="img_height" style={{ width: "50%" }} size="10" />
                                        pixel</label>
                                </li>
                                <li>
                                    <label htmlFor="img_width">Nuevo ancho :&nbsp;
                                        <input type="text" id="img_width" style={{ width: "50%" }} size="10" />
                                        pixel</label>
                                </li>
                                <li>Metodo de interpolación:
                                    <select size="1" id="InterpolationMethod">

                                        <option value="1">Vecíno más cercano</option><option value="2">Doble línea</option><option value="3">Bicúbico</option></select>
                                </li>
                                <li style={{ textAlign: "center" }}>
                                    <input type="button" value="  Aceptar " id="btnChangeImageSizeOK" onClick={this.props.btnChangeImageSizeOK_onclick} />
                                    <input type="button" value=" Cancelar " id="btnCancelChange" onClick={this.props.btnCancelChange_onclick} />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div id={this.props.containerId}></div>
                    <div id="btnGroupBtm" className="clearfix">
                        <div className="ct-lt">
                        <button id="DW_btnFirstImage" onClick={this.props.btnFirstImage_onclick}> |&lt; </button>
                            &nbsp;
                        <button id="DW_btnPreImage" onClick={this.props.btnPreImage_onclick}> &lt; </button>
                            &nbsp;&nbsp; Página: &nbsp;
                        <input type="text" size="2" id="DW_CurrentImage" readOnly="readonly" />
                            &nbsp; de &nbsp;
                        <input type="text" size="2" id="DW_TotalImage" readOnly="readonly" />
                            &nbsp;&nbsp;
                        <button id="DW_btnNextImage" onClick={this.props.btnNextImage_onclick}> &gt; </button>
                            &nbsp;
                        <button id="DW_btnLastImage" onClick={this.props.btnLastImage_onclick}> &gt;| </button>
                        </div>
                        <div className="ct-rt">Modo de visualizaión:
                        <select size="1" id="DW_PreviewMode" onChange={this.props.setlPreviewMode}>
                                <option value="0">1X1</option>
                                <option value="1">2X2</option>
                                <option value="2">3X3</option>
                                <option value="3">4X4</option>
                                <option value="4">5X5</option>
                            </select>
                        </div>
                    </div>
                </div>
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
                                            
                                            <select size="1" id="source" style={{ position: "relative" }} onChange={this.props.source_onchange}>
                                                <option value="0">Buscando dispositivos compatibles..</option></select>
                                            <select size="1" id="webcamsource" style={{ position: "relative" }} onChange={this.props.source_onchange}>
                                                <option value="0">Buscando dispositivos compatibles..</option></select>
                                        </li>
                                        <li id="divProductDetail">
                                            <ul id="divTwainType">
                                                <li>
                                                    <label id="lblShowUI" htmlFor="ShowUI">
                                                        <input type="checkbox" id="ShowUI" />Avanzado&nbsp;
                                                </label>
                                                    <label htmlFor="ADF">
                                                        <input type="checkbox" id="ADF" />Alim. auto.&nbsp;
                                                </label>
                                                    <label htmlFor="Duplex">
                                                        <input type="checkbox" id="Duplex" />Duplex
                                                </label>
                                                </li>
                                                <li>Color:
                                                <label htmlFor="BW" style={{ marginLeft: "5px" }}>
                                                        <input type="radio" id="BW" name="PixelType" />B&amp;W
                                                </label>
                                                    <label htmlFor="Gray">
                                                        <input type="radio" id="Gray" name="PixelType" />Gray
                                                </label>
                                                    <label htmlFor="RGB">
                                                        <input type="radio" id="RGB" name="PixelType" />Color
                                                </label>
                                                </li>
                                                <li>
                                                    <span>Resolución:</span>
                                                    <select size="1" id="Resolution">
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                        <option value="300">300</option>
                                                    </select>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="tc">
                                            <button id="btnScan" onClick={this.props.acquireImage} style={{ color: "rgb(255, 255, 255)", backgroundColor: "rgb(80, 168, 225)", cursor: "pointer" }}>Escanear</button>
                                        </li>
                                    </ul>
                                    <div id="tblLoadImage" style={{ visibility: "hidden" }}>
                                        <a href="return false" className="ClosetblLoadImage"><img src="Images/icon-ClosetblLoadImage.png" alt="Close tblLoadImage" /></a>
                                        <p>Por favor instale un dispositivo compatible con TWAIN:</p>
                                        <p>
                                            <a target="_blank" rel="noopener noreferrer" href="http://www.twain.org">TWG</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li id="liLoadImage">
                                <div className="divType">
                                    <div className="mark_arrow collapsed"></div>
                                    Cargar imagenes o Pdf</div>
                                <div id="div_LoadLocalImage" style={{ display: "none" }} className="divTableStyle">
                                    <ul>
                                        <li className="tc">
                                            <button className="btnOrg" onClick={this.props.btnLoadImagesOrPDFs_onclick} >Cargar</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id="divUpload" className="divinput mt30" style={{ position: "relative" }}>
                        <ul>
                            <li className="toggle">Guardar documentos</li>
                            <li>
                                <p>Nombre de archivo:</p>
                                <input type="text" size="20" id="txt_fileName" />
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
                                    <input type="checkbox" id="MultiPageTIFF" disabled="" />
                                    Multi-página TIFF</label>
                                <label htmlFor="MultiPagePDF">
                                    <input type="checkbox" id="MultiPagePDF" disabled="" />
                                    Multi-página PDF</label>
                            </li>
                            <li>
                                <button id="btnSave" className="btnOrg" onClick={() => { this.props.saveUploadImage('local') }} >Descargar</button>
                                <button id="btnUpload" className="btnOrg" onClick={() => { this.props.saveUploadImage('server') }} >Cargar</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="DWTcontainerBtm" style={{ textAlign: "left" }} className="clearfix">
                    <div id="DWTemessageContainer"></div>
                    <div id="divNoteMessage"> </div>
                </div>
            </div>
        );
    }
}

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    
    DWObject = null;
    containerId = 'dwtcontrolContainer';
    productKey = 't0141cQMAAJxnh4Yp1hYz6iW67PSArOVbdY/p5u2Vmw8F73QqYY1s84+ZUw30+OUWFnwz5ukkpI5e7UxA2Gg0ctzT/bL3IZEco29mOYT0ZMJk6khg1HtrPoz9MYv8zCVOnWnEhWKjCWOxYdiPwpu9Iu75NpowFhuG/SR6PpOukYTRhLHYEO/G2p+CFe5+AKpw';
    _strTempStr = '';
    re = /^\d+$/;
    strre = /^[\s\w]+$/;
    refloat = /^\d+\.*\d*$/i;
    _iLeft = 0;
    _iTop = 0;
    _iRight = 0;
    _iBottom = 0;
    DWTSourceCount = 0;
    componentDidMount() {
        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => {

            this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain(this.containerId);
            if (this.DWObject) {
                this.DWObject.RegisterEvent("OnPostTransfer", () => {
                    console.log('OnPostTransfer');
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnPostLoad", () => {
                    console.log('OnPostLoad');
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnPostAllTransfers", () => {
                    console.log('OnPostAllTransfers');
                    this.DWObject.CloseSource();
                    this.updatePageInfo();
                    this.checkErrorString();
                });
                this.DWObject.RegisterEvent('OnImageAreaSelected', (index, left, top, right, bottom) => {
                    console.log('OnImageAreaSelected');
                    this._iLeft = left;
                    this._iTop = top;
                    this._iRight = right;
                    this._iBottom = bottom;
                });
                this.DWObject.RegisterEvent('OnImageAreaDeselected', (index) => {
                    console.log('OnImageAreaDeselected');
                    this._iLeft = 0;
                    this._iTop = 0;
                    this._iRight = 0;
                    this._iBottom = 0;
                });
                this.DWObject.RegisterEvent("OnGetFilePath", (bSave, count, index, path, name) => {
                    console.log('OnGetFilePath');                    
                 });
                this.DWObject.RegisterEvent("OnTopImageInTheViewChanged", (index) => {
                    console.log('OnTopImageInTheViewChanged');
                    document.querySelectorAll('canvas').forEach(item=>{
                        console.log("ok");//item.toDataURL());
                    });
                    this.searchBarcodeInImage();
                    this._iLeft = 0;
                    this._iTop = 0;
                    this._iRight = 0;
                    this._iBottom = 0;
                    this.DWObject.CurrentImageIndexInBuffer = index;
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnMouseClick", () => {
                    console.log('OnMouseClick');
                    this.DWObject.SetViewMode(1,1);
                    this.updatePageInfo();
                });
                $('#DWTNonInstallContainerID').hide();

                var twainsource = document.getElementById("source");
                if (!twainsource) {
                    twainsource = document.getElementById("webcamsource");
                }
                console.log(this.DWObject.GetSourceNameItems());
                var vCount = this.DWObject.SourceCount;
                this.DWTSourceCount = vCount;

                if (twainsource) {
                    twainsource.options.length = 0;
                    for (var i = 0; i < vCount; i++) {
                        twainsource.options.add(new Option(this.DWObject.GetSourceNameItems(i), i));
                    }
                }
                var liNoScanner = document.getElementById("pNoScanner");

                if (vCount === 0) {
                    if (liNoScanner) {
                        if (Dynamsoft.Lib.env.bWin) {

                            liNoScanner.style.display = "block";
                            liNoScanner.style.textAlign = "center";
                        }
                        else
                            liNoScanner.style.display = "none";
                    }
                }
                if (vCount > 0) {
                    this.source_onchange(false);
                }

                if (Dynamsoft.Lib.env.bWin)
                    this.DWObject.MouseShape = false;

                var btnScan = document.getElementById("btnScan");
                if (btnScan) {
                    if (vCount === 0)
                        document.getElementById("btnScan").disabled = true;
                    else {
                        document.getElementById("btnScan").disabled = false;
                        document.getElementById("btnScan").style.color = "#fff";
                        document.getElementById("btnScan").style.backgroundColor = "#50a8e1";
                        document.getElementById("btnScan").style.cursor = "pointer";
                    }
                }

                if (!Dynamsoft.Lib.env.bWin && vCount > 0) {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "none";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "none";
                }
                else {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "";
                }

                for (i = 0; i < document.links.length; i++) {
                    if (document.links[i].className === "ShowtblLoadImage") {
                        document.links[i].onclick = this.showtblLoadImage_onclick;
                    }
                    if (document.links[i].className === "ClosetblLoadImage") {
                        document.links[i].onclick = this.closetblLoadImage_onclick;
                    }
                }
                if (vCount === 0) {
                    if (Dynamsoft.Lib.env.bWin) {
                        if (document.getElementById("aNoScanner") && window['bDWTOnlineDemo']) {
                            if (document.getElementById("div_ScanImage").style.display === "")
                                this.showtblLoadImage_onclick();
                        }
                        if (document.getElementById("Resolution"))
                            document.getElementById("Resolution").style.display = "none";
                    }
                }
                else {
                    var divBlank = document.getElementById("divBlank");
                    if (divBlank)
                        divBlank.style.display = "none";
                }
                this.updatePageInfo();
                this.setDefaultValue();
                this.setlPreviewMode();
            }
        });
        this.initiateInputs();
        this.HideLoadImageForLinux();
        this.InitMessageBody();
        this.InitDWTdivMsg(false);
        this.loadDWT();

        $("ul.PCollapse li>div").click(function () {
            if ($(this).next().css("display") === "none") {
                $(".divType").next().hide("normal");
                $(".divType").children(".mark_arrow").removeClass("expanded");
                $(".divType").children(".mark_arrow").addClass("collapsed");
                $(this).next().show("normal");
                $(this).children(".mark_arrow").removeClass("collapsed");
                $(this).children(".mark_arrow").addClass("expanded");
            }
        });

    }

    loadDWT() {
        Dynamsoft.WebTwainEnv.ProductKey = this.productKey;
        Dynamsoft.WebTwainEnv.Trial = true;
        Dynamsoft.WebTwainEnv.ResourcesPath = "https://tst.dynamsoft.com/libs/dwt/15.0";
        Dynamsoft.WebTwainEnv.Containers = [{ 
            ContainerId: this.containerId, 
            Width: '583px', 
            Height: '660px', 
        }];
        Dynamsoft.WebTwainEnv.Load();
    }

    appendMessage(strMessage) {
        this._strTempStr += strMessage;
        var _divMessageContainer = document.getElementById("DWTemessage");
        if (_divMessageContainer) {
            _divMessageContainer.innerHTML = this._strTempStr;
            _divMessageContainer.scrollTop = _divMessageContainer.scrollHeight;
        }
    }

    updatePageInfo() {
        if (document.getElementById("DW_TotalImage"))
            document.getElementById("DW_TotalImage").value = this.DWObject.HowManyImagesInBuffer;
        if (document.getElementById("DW_CurrentImage"))
            document.getElementById("DW_CurrentImage").value = this.DWObject.CurrentImageIndexInBuffer + 1;
    }

    checkErrorString() {
        return this.checkErrorStringWithErrorCode(this.DWObject.ErrorCode, this.DWObject.ErrorString);
    }

    checkErrorStringWithErrorCode(errorCode, errorString, responseString) {
        if (errorCode === 0) {
            this.appendMessage("<span style='color:#cE5E04'><b>" + errorString + "</b></span><br />");

            return true;
        }
        if (errorCode === -2115) 
            return true;
        else {
            if (errorCode === -2003) {
                var ErrorMessageWin = window.open("", "ErrorMessage", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
                ErrorMessageWin.document.writeln(responseString); 
            }
            this.appendMessage("<span style='color:#cE5E04'><b>" + errorString + "</b></span><br />");
            return false;
        }
    }

    acquireImage() {
        var cIndex = document.getElementById("source").selectedIndex;
        if (cIndex < 0)
            return;

        this.DWObject.SelectSourceByIndex(cIndex);
        this.DWObject.CloseSource();
        this.DWObject.OpenSource();
        this.DWObject.IfShowUI = document.getElementById("ShowUI").checked;

        var i;
        for (i = 0; i < 3; i++) {
            if (document.getElementsByName("PixelType").item(i).checked === true)
                this.DWObject.PixelType = i;
        }
        if (this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error definiendo el valor para el color: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }
        this.DWObject.Resolution = document.getElementById("Resolution").value;
        if (this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error definiendo el valor de la resolución: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }

        var bADFChecked = document.getElementById("ADF").checked;
        this.DWObject.IfFeederEnabled = bADFChecked;
        if (bADFChecked === true && this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error definiendo el valor ADF alimentador automático: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }

        var bDuplexChecked = document.getElementById("Duplex").checked;
        this.DWObject.IfDuplexEnabled = bDuplexChecked;
        if (bDuplexChecked === true && this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error definiendo el valor duplex: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }
        if (Dynamsoft.Lib.env.bWin || (!Dynamsoft.Lib.env.bWin && this.DWObject.ImageCaptureDriverType === 0))
            this.appendMessage("Color: " + this.DWObject.PixelType + "<br />Resolución: " + this.DWObject.Resolution + "<br />");
        this.DWObject.IfDisableSourceAfterAcquire = true;
        this.DWObject.AcquireImage();

    }

    searchBarcodeInImage(){
        console.log(document.querySelectorAll('canvas'));
        ReactDOM.render(<WebBarcode title="Códigos de barras identificados" barcode={document.querySelectorAll('canvas')[3].toDataURL()}/>, document.getElementById('btnBarcode'));
    }

    btnLoadImagesOrPDFs_onclick() {
        var OnPDFSuccess = () => {
            this.appendMessage("Imágen cargada con éxito.<br/>");
            this.updatePageInfo();
        };

        var OnPDFFailure = (errorCode, errorString) => {
            this.checkErrorStringWithErrorCode(errorCode, errorString);
        };

        this.DWObject.IfShowFileDialog = true;
        this.DWObject.Addon.PDF.SetResolution(200);
        this.DWObject.Addon.PDF.SetConvertMode(1);
        this.DWObject.LoadImageEx("", 5, OnPDFSuccess, OnPDFFailure);
    }

    checkIfImagesInBuffer() {
        if (this.DWObject.HowManyImagesInBuffer === 0) {
            this.appendMessage("No hay imagen en el buffer.<br />")
            return false;
        }
        else
            return true;
    }

    btnShowImageEditor_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.ShowImageEditor();
    }

    btnRotateRight_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.RotateRight(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Rotar a la derecha: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnRotateLeft_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.RotateLeft(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Rotar a la izquierda: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnRotate180_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.Rotate(this.DWObject.CurrentImageIndexInBuffer, 180, true);
        this.appendMessage('<b>Rotar 180: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnMirror_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.Mirror(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Espejo horizontal: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnFlip_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.Flip(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Espejo vertical: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnCrop_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        if (this._iLeft !== 0 || this._iTop !== 0 || this._iRight !== 0 || this._iBottom !== 0) {
            this.DWObject.Crop(
                this.DWObject.CurrentImageIndexInBuffer,
                this._iLeft, this._iTop, this._iRight, this._iBottom
            );
            this._iLeft = 0;
            this._iTop = 0;
            this._iRight = 0;
            this._iBottom = 0;
            this.appendMessage('<b>Recortar: </b>');
            if (this.checkErrorString()) {
                return;
            }
            return;
        } else {
            this.appendMessage("<b>Recortar: </b>falló.por favor defina primero el área a recortar.<br />");
        }
    }

    btnChangeImageSize_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        switch (document.getElementById("ImgSizeEditor").style.visibility) {
            case "visible": document.getElementById("ImgSizeEditor").style.visibility = "hidden"; break;
            case "hidden": document.getElementById("ImgSizeEditor").style.visibility = "visible"; break;
            default: break;
        }
   
        var iWidth = this.DWObject.GetImageWidth(this.DWObject.CurrentImageIndexInBuffer);
        if (iWidth !== -1)
            document.getElementById("img_width").value = iWidth;
        var iHeight = this.DWObject.GetImageHeight(this.DWObject.CurrentImageIndexInBuffer);
        if (iHeight !== -1)
            document.getElementById("img_height").value = iHeight;
    }

    btnCancelChange_onclick() {
        document.getElementById("ImgSizeEditor").style.visibility = "hidden";
    }

    btnChangeImageSizeOK_onclick() {
        document.getElementById("img_height").className = "";
        document.getElementById("img_width").className = "";
        if (!this.re.test(document.getElementById("img_height").value)) {
            document.getElementById("img_height").className += " invalid";
            document.getElementById("img_height").focus();
            this.appendMessage("Por favor ingrese un valor válido: <b>alto</b>.<br />");
            return;
        }
        if (!this.re.test(document.getElementById("img_width").value)) {
            document.getElementById("img_width").className += " invalid";
            document.getElementById("img_width").focus();
            this.appendMessage("Por favor ingrese un valor válido: <b>ancho</b>.<br />");
            return;
        }
        this.DWObject.ChangeImageSize(
            this.DWObject.CurrentImageIndexInBuffer,
            document.getElementById("img_width").value,
            document.getElementById("img_height").value,
            document.getElementById("InterpolationMethod").selectedIndex + 1
        );
        this.appendMessage('<b>Cambiar tamaño: </b>');
        if (this.checkErrorString()) {
            document.getElementById("ImgSizeEditor").style.visibility = "hidden";
            return;
        }
    }

    source_onchange(bWebcam) {
        if (document.getElementById("divTwainType"))
            document.getElementById("divTwainType").style.display = "";

        if (document.getElementById("source")) {
            var cIndex = document.getElementById("source").selectedIndex;
            if (Dynamsoft.Lib.env.bMac) {
                var strSourceName = this.DWObject.GetSourceNameItems(cIndex);
                if (strSourceName.indexOf("ICA") === 0) {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "none";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "none";
                } else {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "";
                }
            }
            else
                this.DWObject.SelectSourceByIndex(cIndex);
        }
    }

    render() {
        return (
            <UI
                containerId={this.containerId}
                acquireImage={() => this.acquireImage()}
                btnLoadImagesOrPDFs_onclick={() => this.btnLoadImagesOrPDFs_onclick()}
                btnShowImageEditor_onclick={() => this.btnShowImageEditor_onclick()}
                btnRotateLeft_onclick={() => this.btnRotateLeft_onclick()}
                btnRotateRight_onclick={() => this.btnRotateRight_onclick()}
                btnRotate180_onclick={() => this.btnRotate180_onclick()}
                btnMirror_onclick={() => this.btnMirror_onclick()}
                btnFlip_onclick={() => this.btnFlip_onclick()}
                btnCrop_onclick={() => this.btnCrop_onclick()}
                btnChangeImageSize_onclick={() => this.btnChangeImageSize_onclick()}
                btnCancelChange_onclick={() => this.btnCancelChange_onclick()}
                btnChangeImageSizeOK_onclick={() => this.btnChangeImageSizeOK_onclick()}
                saveUploadImage={(_type) => this.saveUploadImage(_type)}
                btnFirstImage_onclick={() => this.btnFirstImage_onclick()}
                btnPreImage_wheel={() => this.btnPreImage_wheel()}
                btnNextImage_wheel={() => this.btnNextImage_wheel()}
                btnPreImage_onclick={() => this.btnPreImage_onclick()}
                btnNextImage_onclick={() => this.btnNextImage_onclick()}
                btnLastImage_onclick={() => this.btnLastImage_onclick()}
                btnRemoveCurrentImage_onclick={() => this.btnRemoveCurrentImage_onclick()}
                btnRemoveAllImages_onclick={() => this.btnRemoveAllImages_onclick()}
                setlPreviewMode={() => this.setlPreviewMode()}
                rdTIFF_onclick={() => this.rdTIFF_onclick()}
                rdPDF_onclick={() => this.rdPDF_onclick()}
                rd_onclick={() => this.rd_onclick()}
            />
        );
    }

    HideLoadImageForLinux() {
        var o = document.getElementById("liLoadImage");
        if (o) {
            if (Dynamsoft.Lib.env.bLinux)
                o.style.display = "none";
            else
                o.style.display = "";
        }
    }

    InitMessageBody() {
        var MessageBody = document.getElementById("divNoteMessage");
        if (MessageBody) {
            var ObjString = "<div><p>Sistemas operativos y Exploradores web soportados: </p>Internet Explorer 8 o superior (32 bit/64 bit), cualquier versión de Google Chrome (32 bit/64 bit), cualquier versión de Firefox en Windows; Safari, Chrome y Firefox en Mac OS X 10.7 o superior; Chrome y Firefox v27 o superior (64 bit) en Ubuntu 16.04+, Debian 8+";
            ObjString += ".</div>";

            MessageBody.style.display = "";
            MessageBody.innerHTML = ObjString;
        }
    }

    InitDWTdivMsg(bNeebBack) {
        var DWTemessageContainer = document.getElementById("DWTemessageContainer");
        if (DWTemessageContainer) {
            var objString = "";
            if (bNeebBack) {
                objString += "<p className='backToDemoList'><a className='d-btn bgOrange' href =\"online_demo_list.aspx\">Back</a></p>";
            }
            objString += "<div id='DWTdivMsg' className='clearfix'>";
            objString += "Log de transacciones: <br/>"
            objString += "<div id='DWTemessage'>";
            objString += "</div></div>";

            DWTemessageContainer.innerHTML = objString;

            var _divMessageContainer = document.getElementById("DWTemessage");
            _divMessageContainer.ondblclick = function () {
                this.innerHTML = "";
                this._strTempStr = "";
            }
        }
    }

    initiateInputs() {
        var allinputs = document.getElementsByTagName("input");
        for (var i = 0; i < allinputs.length; i++) {
            if (allinputs[i].type === "checkbox") {
                allinputs[i].checked = false;
            }
            else if (allinputs[i].type === "text") {
                allinputs[i].value = "";
            }
        }
        if (Dynamsoft.Lib.env.bIE === true && Dynamsoft.Lib.env.bWin64 === true) {
            var o = document.getElementById("samplesource64bit");
            if (o)
                o.style.display = "inline";

            o = document.getElementById("samplesource32bit");
            if (o)
                o.style.display = "none";
        }
    }

    setDefaultValue() {
        var vRgb = document.getElementById("RGB");
        
        if (vRgb)
            vRgb.checked = true;

        var varImgTypepdf2 = document.getElementById("imgTypepdf2");
        if (varImgTypepdf2)
            varImgTypepdf2.checked = true;
        var varImgTypepdf = document.getElementById("imgTypepdf");
        if (varImgTypepdf)
            varImgTypepdf.checked = true;

        var d = new Date();
        var _strDefaultSaveImageName = 
            d.getFullYear()+""+
            d.getMonth()+""+
            d.getDate()+""+
            d.getHours()+""+
            d.getMinutes()+""+
            d.getSeconds();

        var _txtFileNameforSave = document.getElementById("txt_fileNameforSave");
        if (_txtFileNameforSave)
            _txtFileNameforSave.value = _strDefaultSaveImageName;

        var _txtFileName = document.getElementById("txt_fileName");
        if (_txtFileName)
            _txtFileName.value = _strDefaultSaveImageName;

        var _chkMultiPageTIFF_save = document.getElementById("MultiPageTIFF_save");
        if (_chkMultiPageTIFF_save)
            _chkMultiPageTIFF_save.disabled = true;
        var _chkMultiPagePDF_save = document.getElementById("MultiPagePDF_save");
        if (_chkMultiPagePDF_save)
            _chkMultiPagePDF_save.disabled = true;
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        if (_chkMultiPageTIFF)
            _chkMultiPageTIFF.disabled = true;
        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        if (_chkMultiPagePDF)
            _chkMultiPagePDF.disabled = true;
    }

       saveUploadImage(type) {
        if (type === 'local') {
            this.btnSave_onclick();
        } else if (type === 'server') {
            this.btnUpload_onclick()
        }
    }

    btnSave_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        var i, strimgType_save;
        var NM_imgType_save = document.getElementsByName("ImageType");
        for (i = 0; i < 5; i++) {
            if (NM_imgType_save.item(i).checked === true) {
                strimgType_save = NM_imgType_save.item(i).value;
                break;
            }
        }
        this.DWObject.IfShowFileDialog = true;
        var _txtFileNameforSave = document.getElementById("txt_fileName");
        if (_txtFileNameforSave)
            _txtFileNameforSave.className = "";
        var bSave = false;

        var strFilePath = _txtFileNameforSave.value + "." + strimgType_save;

        var OnSuccess = () => {
            this.appendMessage('<b>Guardar imágen: </b>');
            this.checkErrorStringWithErrorCode(0, "Corrécto.");
        };

        var OnFailure = (errorCode, errorString) => {
            this.checkErrorStringWithErrorCode(errorCode, errorString);
        };

        var _chkMultiPageTIFF_save = document.getElementById("MultiPageTIFF");
        var vAsyn = false;
        if (strimgType_save === "tif" && _chkMultiPageTIFF_save && _chkMultiPageTIFF_save.checked) {
            vAsyn = true;
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                bSave = this.DWObject.SaveAllAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
            }
            else {
                bSave = this.DWObject.SaveSelectedImagesAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
            }
        }
        else if (strimgType_save === "pdf" && document.getElementById("MultiPagePDF").checked) {
            vAsyn = true;
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                bSave = this.DWObject.SaveAllAsPDF(strFilePath, OnSuccess, OnFailure);
            }
            else {
                bSave = this.DWObject.SaveSelectedImagesAsMultiPagePDF(strFilePath, OnSuccess, OnFailure);
            }
        }
        else {
            switch (i) {
                case 0: bSave = this.DWObject.SaveAsBMP(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 1: bSave = this.DWObject.SaveAsJPEG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 2: bSave = this.DWObject.SaveAsTIFF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 3: bSave = this.DWObject.SaveAsPNG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 4: bSave = this.DWObject.SaveAsPDF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                default: break;
            }
        }

        if (vAsyn === false) {
            if (bSave)
                this.appendMessage('<b>Guardar imagen: </b>');
            if (this.checkErrorString()) {
                return;
            }
        }
    }
    
    btnUpload_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        var i, strHTTPServer, strActionPage, strImageType;

        var _txtFileName = document.getElementById("txt_fileName");
        if (_txtFileName)
            _txtFileName.className = "";

        strHTTPServer = "localhost";
        this.DWObject.IfSSL = false;
        this.DWObject.HTTPPort = 5000;


        strActionPage = "/api/Digitalizacion/CreateIFromFileToBase64Embedded";
        for (i = 0; i < 5; i++) {
            if (document.getElementsByName("ImageType").item(i).checked === true) {
                strImageType = i;
                break;
            }
        }

        var fileName = _txtFileName.value;
        var replaceStr = "<";
        fileName = fileName.replace(new RegExp(replaceStr, 'gm'), '&lt;');
        var uploadfilename = fileName + "." + document.getElementsByName("ImageType").item(i).value;

        var OnSuccess = (httpResponse) => {
            console.log(httpResponse);
            this.appendMessage('<b>Cagar: </b>');
            this.checkErrorStringWithErrorCode(0, "Corrécto.");
        };

        var OnFailure = (errorCode, errorString, httpResponse) => {
            console.log(httpResponse);
            this.checkErrorStringWithErrorCode(errorCode, errorString, httpResponse);
        };

        if (strImageType === 2 && document.getElementById("MultiPageTIFF").checked) {
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                this.DWObject.HTTPUploadAllThroughPostAsMultiPageTIFF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
            else {
                this.DWObject.HTTPUploadThroughPostAsMultiPageTIFF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
        }
        else if (strImageType === 4 && document.getElementById("MultiPagePDF").checked) {
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                this.DWObject.HTTPUploadAllThroughPostAsPDF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
            else {
                this.DWObject.HTTPUploadThroughPostAsMultiPagePDF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
        }
        else {
            this.DWObject.HTTPUploadThroughPostEx(
                strHTTPServer,
                this.DWObject.CurrentImageIndexInBuffer,
                strActionPage,
                uploadfilename,
                strImageType,
                OnSuccess, OnFailure
            );
        }
    }

    btnFirstImage_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = 0;
        this.updatePageInfo();
    }

    btnPreImage_wheel() {
        if (this.DWObject.HowManyImagesInBuffer !== 0)
            this.btnPreImage_onclick()
    }

    btnNextImage_wheel() {
        if (this.DWObject.HowManyImagesInBuffer !== 0)
            this.btnNextImage_onclick()
    }

    btnPreImage_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        else if (this.DWObject.CurrentImageIndexInBuffer === 0) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer - 1;
        this.updatePageInfo();
    }
    btnNextImage_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        else if (this.DWObject.CurrentImageIndexInBuffer === this.DWObject.HowManyImagesInBuffer - 1) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer + 1;
        this.updatePageInfo();
    }


    btnLastImage_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.HowManyImagesInBuffer - 1;
        this.updatePageInfo();
    }

    btnRemoveCurrentImage_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.RemoveAllSelectedImages();
        if (this.DWObject.HowManyImagesInBuffer === 0) {
            document.getElementById("DW_TotalImage").value = this.DWObject.HowManyImagesInBuffer;
            document.getElementById("DW_CurrentImage").value = "";
            return;
        }
        else {
            this.updatePageInfo();
        }
    }


    btnRemoveAllImages_onclick() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.RemoveAllImages();
        document.getElementById("DW_TotalImage").value = "0";
        document.getElementById("DW_CurrentImage").value = "";
    }

    setlPreviewMode() {
        var varNum = parseInt(document.getElementById("DW_PreviewMode").selectedIndex + 1);
        var btnCrop = document.getElementById("btnCrop");
        if (btnCrop) {
            var tmpstr = btnCrop.src;
            if (varNum > 1) {
                tmpstr = tmpstr.replace('Crop.', 'Crop_gray.');
                btnCrop.src = tmpstr;
                btnCrop.onclick = function () { };
            }
            else {
                tmpstr = tmpstr.replace('Crop_gray.', 'Crop.');
                btnCrop.src = tmpstr;
                btnCrop.onclick = () => { this.btnCrop_onclick(); };
            }
        }

        this.DWObject.SetViewMode(varNum, varNum);
        if (Dynamsoft.Lib.env.bMac || Dynamsoft.Lib.env.bLinux) {
            return;
        }
        else if (document.getElementById("DW_PreviewMode").selectedIndex !== 0) {
            this.DWObject.MouseShape = true;
        }
        else {
            this.DWObject.MouseShape = false;
        }
    }

    rdTIFF_onclick() {
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.disabled = false;
        _chkMultiPageTIFF.checked = false;

        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.checked = false;
        _chkMultiPagePDF.disabled = true;
    }

    rdPDF_onclick() {
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.checked = false;
        _chkMultiPageTIFF.disabled = true;

        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.disabled = false;
        _chkMultiPagePDF.checked = true;

    }

    rd_onclick() {
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.checked = false;
        _chkMultiPageTIFF.disabled = true;

        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.checked = false;
        _chkMultiPagePDF.disabled = true;
    }
}

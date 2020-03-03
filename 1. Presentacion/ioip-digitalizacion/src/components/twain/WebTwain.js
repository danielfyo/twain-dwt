import { DwtSource } from './../../model/DwtSource';
// #region imports
import React from 'react';

import './WebTwain.css';

import Dynamsoft, {EnumDWT_ImageType} from 'dwt';
import $ from 'jquery';  
// #endregion imports

class UI extends React.Component {
    
    render() {
        return (
        <div id="webTwainMain">
            <div id="DWTcontainer" className="container">
                <div id="DWTcontainerTop">
                    
                    <div id="ImgSizeEditor"  className={(!this.props.stateProp.showResizer) ? 'hidden' : ''}>
                        <ul>
                            <li>
                                <label>Nuevo alto:
                                    <input type="text" id="img_height" size="10"/>
                                    px</label>
                            </li>
                            <li>
                                <label >Nuevo ancho :&nbsp;
                                    <input type="text" id="img_width" size="10"/>
                                    px</label>
                            </li>
                            <li>Método de interpolación:
                                <select size="1" id="InterpolationMethod">
                                    <option value=""></option>
                                </select>
                            </li>
                            <li>
                                <input type="button" value="REDIMENSIONAR" id="btnChangeImageSizeOK" onClick={this.resizeByCoordinates}/>
                                <input type="button" value="   CANCELAR  " id="btnCancelChange" onClick={this.cancelResizeImage}/>
                            </li>
                        </ul>
                    </div>
                    
                    <div id={this.props.containerId}></div>
                    
                    <div id="btnGroupBtm" className="clearfix">
                        <div className="ct-lt">
                        <button id="DW_btnFirstImage" onClick={this.props.goToFirstImage}> |&lt; </button>
                            &nbsp;
                        <button id="DW_btnPreImage" onClick={this.props.goToPrevoiusImage}> &lt; </button>
                            &nbsp;&nbsp; Página: &nbsp;
                        <input type="text" size="2" id="DW_CurrentImage" readOnly="readonly" />
                            &nbsp; de &nbsp;
                        <input type="text" size="2" id="DW_TotalImage" readOnly="readonly" />
                            &nbsp;&nbsp;
                        <button id="DW_btnNextImage" onClick={this.props.goToNextImage}> &gt; </button>
                            &nbsp;
                        <button id="DW_btnLastImage" onClick={this.props.goToLastImage}> &gt;| </button>
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
            </div>
        </div>);
    }
}

export default class DWT extends React.Component {
    
    // #region veriables globales
    DWObject = null;
    DWObjectLargeViewer = null;
    containerId = 'dwtcontrolContainer';
    productKey = 't0140cQMAAE8LWxVAHxlESW7JnSwHi4Gr4r8Df5baQ3boMjBgBMs//zRwatGJL1nxpE28FANXQu6g5e+JrEeOe47+lYwiv8iO4Z3pu9BZTJhMHw0Mvb9eu7E/puvPXOr0WSu+KDZMGIuNhHkIb/aGOPNpmDAWGwnzJDIfRddowjBhLDaCe2NaWy3NPlCFrqA=';
    _strTempStr = '';
    re = /^\d+$/;
    strre = /^[\s\w]+$/;
    refloat = /^\d+\.*\d*$/i;
    _iLeft = 0;
    _iTop = 0;
    _iRight = 0;
    _iBottom = 0;
    DWTSourceCount = 0;
    isVideoOn = true;
    // #region veriables globales

    constructor(props) {
        super(props);
        this.state = {
            showResizer: false
        };
    }
    
    addImageToPreview(image, index) {
        this.props.handleAddImageToPreview(image, index);
    }

    updateSourceServiceList(sourceList){
        this.props.handleUpdateSourceServiceList(sourceList);
    }

    componentDidMount() {

        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => {
            this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain(this.containerId);
            
            if (this.DWObject) {

                this.DWObject.RegisterEvent("OnPostTransfer", () => {
                    this.DWObject.SetSelectedImageIndex(this.DWObject.CurrentImageIndexInBuffer, this.DWObject.CurrentImageIndexInBuffer);
                    this.DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
                    let image = this.DWObject.SaveSelectedImagesToBase64Binary();
                    this.addImageToPreview(this.completeDataUri(image), this.DWObject.CurrentImageIndexInBuffer + 1);
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnPostLoad", () => {
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnPostAllTransfers", () => {
                    this.DWObject.CloseSource();
                    this.updatePageInfo();
                    this.checkErrorString();
                });
                this.DWObject.RegisterEvent('OnImageAreaSelected', (index, left, top, right, bottom) => {

                    this._iLeft = left;
                    this._iTop = top;
                    this._iRight = right;
                    this._iBottom = bottom;
                });
                this.DWObject.RegisterEvent('OnImageAreaDeselected', (index) => {

                    this._iLeft = 0;
                    this._iTop = 0;
                    this._iRight = 0;
                    this._iBottom = 0;
                });
                this.DWObject.RegisterEvent("OnGetFilePath", (bSave, count, index, path, name) => {
               
                 });
                this.DWObject.RegisterEvent("OnTopImageInTheViewChanged", (index) => {
                    this._iLeft = 0;
                    this._iTop = 0;
                    this._iRight = 0;
                    this._iBottom = 0;
                    
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnMouseClick", () => {
                    console.log('OnMouseClick');
                    this.DWObject.SetViewMode(1,1);
                    this.updatePageInfo();
                });

                
                /*let twainsource = this.props.handleGetSelectionIndex();
                
                this.DWTSourceCount = this.DWObject.SourceCount;
                if (twainsource) {
                    twainsource.options.length = 0;
                    for (let i = 0; i < this.DWTSourceCount; i++) {
                        twainsource.options.add(new Option(this.DWObject.GetSourceNameItems(i), i));
                    }
                }
                
                
                console.log(twainsource);
                */

                for (let i = 0; i < this.DWObject.SourceCount; i++) {
                    let newSource = new DwtSource();
                    newSource.SourceName = this.DWObject.GetSourceNameItems(i);
                    newSource.DwtSourceId = i;
                    this.updateSourceServiceList(newSource);
                }

                let liNoScanner = document.getElementById("pNoScanner");

                if (this.DWTSourceCount === 0) {
                    if (liNoScanner) {
                        if (Dynamsoft.Lib.env.bWin) {

                            liNoScanner.style.display = "block";
                            liNoScanner.style.textAlign = "center";
                        }
                        else
                            liNoScanner.style.display = "none";
                    }
                }
                if (this.DWTSourceCount > 0) {
                    this.source_onchange(false);
                }

                if (Dynamsoft.Lib.env.bWin)
                    this.DWObject.MouseShape = false;

                let btnScan = document.getElementById("btnScan");
                if (btnScan) {
                    if (this.DWTSourceCount === 0)
                        document.getElementById("btnScan").disabled = true;
                    else {
                        document.getElementById("btnScan").disabled = false;
                        document.getElementById("btnScan").style.color = "#fff";
                        document.getElementById("btnScan").style.backgroundColor = "#50a8e1";
                        document.getElementById("btnScan").style.cursor = "pointer";
                    }
                }

                if (!Dynamsoft.Lib.env.bWin && this.DWTSourceCount > 0) {
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

                for (let i = 0; i < document.links.length; i++) {
                    if (document.links[i].className === "ShowtblLoadImage") {
                        document.links[i].onclick = this.showtblLoadImage_onclick;
                    }
                    if (document.links[i].className === "ClosetblLoadImage") {
                        document.links[i].onclick = this.closetblLoadImage_onclick;
                    }
                }
                if (this.DWTSourceCount === 0) {
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
                    let divBlank = document.getElementById("divBlank");
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

        $("ul.PCollapse li>div").click(() => {
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
            Width: '586px', 
            Height: '660px',

        }];

        Dynamsoft.WebTwainEnv.Load();
    }

    appendMessage(strMessage) {
        this._strTempStr += strMessage;
        let _divMessageContainer = document.getElementById("DWTemessage");
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
                let ErrorMessageWin = window.open("", "ErrorMessage", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
                ErrorMessageWin.document.writeln(responseString); 
            }
            this.appendMessage("<span style='color:#cE5E04'><b>" + errorString + "</b></span><br />");
            return false;
        }
    }

    // #region Metodos operativos DWT
    acquireImage(index) {
        if (index < 0)
            return;

        this.DWObject.SelectSourceByIndex(index);
        this.DWObject.CloseSource();
        this.DWObject.OpenSource();
        this.DWObject.IfShowUI = document.getElementById("ShowUI").checked;

        let i;
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

        let bADFChecked = document.getElementById("ADF").checked;
        this.DWObject.IfFeederEnabled = bADFChecked;
        if (bADFChecked === true && this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error definiendo el valor ADF alimentador automático: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }

        let bDuplexChecked = document.getElementById("Duplex").checked;
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
    
    completeDataUri(base64String){
        return 'data:image/png;base64,' + base64String;
    }

    imageEncode (arrayBuffer) {
        return 'data:image/png;base64,' + btoa(unescape(encodeURIComponent(arrayBuffer))) + '';
    }

    searchBarcodeInImage() {        
        // TODO: implementar
    }
    
    uploadFileFromDisk() {
        let OnPDFSuccess = () => {
            this.appendMessage("Imágen cargada con éxito.<br/>");
            this.updatePageInfo();
        };

        let OnPDFFailure = (errorCode, errorString) => {
            this.checkErrorStringWithErrorCode(errorCode, errorString);
            this.appendMessage(errorString + ".<br/>");
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

    // #endregion Metodos operativos DWT

    editSelectetImage() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.ShowImageEditor();
    }

    rotateRight() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.RotateRight(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Rotar a la derecha: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    rotateLeft() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.RotateLeft(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Rotar a la izquierda: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    rotate180() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.Rotate(this.DWObject.CurrentImageIndexInBuffer, 180, true);
        this.appendMessage('<b>Rotar 180: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    horizontalMirror() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.Mirror(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Espejo horizontal: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    verticalMirror() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.Flip(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Espejo vertical: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    cropImage() {
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

    resizeImage() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.setState({
            showResizer: true 
        });
   
        let iWidth = this.DWObject.GetImageWidth(this.DWObject.CurrentImageIndexInBuffer);
        if (iWidth !== -1)
            document.getElementById("img_width").value = iWidth;
        let iHeight = this.DWObject.GetImageHeight(this.DWObject.CurrentImageIndexInBuffer);
        if (iHeight !== -1)
            document.getElementById("img_height").value = iHeight;
    }

    cancelResizeImage() {
        this.setState({
            showResizer: false 
        });
    }

    resizeByCoordinates() {
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

    source_onchange(cIndex) {
        /*if (document.getElementById("divTwainType"))
            document.getElementById("divTwainType").style.display = "";

        if (Dynamsoft.Lib.env.bMac) {
            let strSourceName = this.DWObject.GetSourceNameItems(cIndex);
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
            this.DWObject.SelectSourceByIndex(cIndex);*/
    }

    render() {
        return (
            <UI
                stateProp = {this.state}
                containerId={this.containerId}
                // Adquire images
                acquireImage={(index) => this.acquireImage(index)}
                uploadFileFromDisk={() => this.uploadFileFromDisk()}
                // Edit
                editSelectetImage={() => this.editSelectetImage()}
                // Rotate
                rotateLeft={() => this.rotateLeft()}
                rotateRight={() => this.rotateRight()}
                rotate180={() => this.rotate180()}
                // Mirror
                horizontalMirror={() => this.horizontalMirror()}
                verticalMirror={() => this.verticalMirror()}
                // Delete pages
                removeCurrentImage={() => this.removeCurrentImage()}
                removeAllImages={() => this.removeAllImages()}
                
                // Resize
                cropImage={() => this.cropImage()}
                resizeImage={() => this.resizeImage()}
                
                // Resize actions
                cancelResizeImage={() => this.cancelResizeImage()}
                resizeByCoordinates={() => this.resizeByCoordinates()}
                
                // pages navigation
                goToFirstImage={() => this.goToFirstImage()}
                goToPreviousImageWheel={() => this.goToPreviousImageWheel()}
                goToPrevoiusImage={() => this.goToPrevoiusImage()}
                gotoNextImageWheel={() => this.gotoNextImageWheel()}
                goToNextImage={() => this.goToNextImage()}
                goToLastImage={() => this.goToLastImage()}

                saveUploadImage={(_type) => this.saveUploadImage(_type)}
                
                setlPreviewMode={() => this.setlPreviewMode()}
                rdTIFF_onclick={() => this.rdTIFF_onclick()}
                rdPDF_onclick={() => this.rdPDF_onclick()}
                rd_onclick={() => this.rd_onclick()}
            />
        );
    }

    HideLoadImageForLinux() {
        let o = document.getElementById("liLoadImage");
        if (o) {
            if (Dynamsoft.Lib.env.bLinux)
                o.style.display = "none";
            else
                o.style.display = "";
        }
    }

    InitMessageBody() {
        let MessageBody = document.getElementById("divNoteMessage");
        if (MessageBody) {
            let ObjString = "<div><p>Sistemas operativos y Exploradores web soportados: </p>Internet Explorer 8 o superior (32 bit/64 bit), cualquier versión de Google Chrome (32 bit/64 bit), cualquier versión de Firefox en Windows; Safari, Chrome y Firefox en Mac OS X 10.7 o superior; Chrome y Firefox v27 o superior (64 bit) en Ubuntu 16.04+, Debian 8+";
            ObjString += ".</div>";

            MessageBody.style.display = "";
            MessageBody.innerHTML = ObjString;
        }
    }

    InitDWTdivMsg(bNeebBack) {
        let DWTemessageContainer = document.getElementById("DWTemessageContainer");
        if (DWTemessageContainer) {
            let objString = "";
            if (bNeebBack) {
                objString += "<p className='backToDemoList'><a className='d-btn bgOrange' href =\"online_demo_list.aspx\">Back</a></p>";
            }
            objString += "<div id='DWTdivMsg' className='clearfix'>";
            objString += "<div id='DWTemessage'>";
            objString += "</div></div>";

            DWTemessageContainer.innerHTML = objString;

            let _divMessageContainer = document.getElementById("DWTemessage");
            _divMessageContainer.ondblclick = () => {
                this.innerHTML = "";
                this._strTempStr = "";
            }
        }
    }

    initiateInputs() {
        let allinputs = document.getElementsByTagName("input");
        for (let i = 0; i < allinputs.length; i++) {
            if (allinputs[i].type === "checkbox") {
                allinputs[i].checked = false;
            }
            else if (allinputs[i].type === "text") {
                allinputs[i].value = "";
            }
        }
        if (Dynamsoft.Lib.env.bIE === true && Dynamsoft.Lib.env.bWin64 === true) {
            let o = document.getElementById("samplesource64bit");
            if (o)
                o.style.display = "inline";

            o = document.getElementById("samplesource32bit");
            if (o)
                o.style.display = "none";
        }
    }

    setDefaultValue() {
        let vRgb = document.getElementById("RGB");
        
        if (vRgb)
            vRgb.checked = true;

        let varImgTypepdf2 = document.getElementById("imgTypepdf2");
        if (varImgTypepdf2)
            varImgTypepdf2.checked = true;
        let varImgTypepdf = document.getElementById("imgTypepdf");
        if (varImgTypepdf)
            varImgTypepdf.checked = true;

        let d = new Date();
        let _strDefaultSaveImageName = 
            d.getFullYear()+""+
            d.getMonth()+""+
            d.getDate()+""+
            d.getHours()+""+
            d.getMinutes()+""+
            d.getSeconds();

        let _txtFileNameforSave = document.getElementById("txt_fileNameforSave");
        if (_txtFileNameforSave)
            _txtFileNameforSave.value = _strDefaultSaveImageName;

        let _txtFileName = document.getElementById("txt_fileName");
        if (_txtFileName)
            _txtFileName.value = _strDefaultSaveImageName;

        let _chkMultiPageTIFF_save = document.getElementById("MultiPageTIFF_save");
        if (_chkMultiPageTIFF_save)
            _chkMultiPageTIFF_save.disabled = true;
        let _chkMultiPagePDF_save = document.getElementById("MultiPagePDF_save");
        if (_chkMultiPagePDF_save)
            _chkMultiPagePDF_save.disabled = true;
        let _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        if (_chkMultiPageTIFF)
            _chkMultiPageTIFF.disabled = true;
        let _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        if (_chkMultiPagePDF) {
            _chkMultiPagePDF.disabled = false;
            _chkMultiPagePDF.checked = true;
        }
        let _chkShowUI = document.getElementById("ShowUI");
        if (_chkShowUI) {
            _chkShowUI.disabled = false;
            _chkShowUI.checked = true;
        }
        let _chkADF = document.getElementById("ADF");
        if (_chkADF) {
            _chkADF.disabled = false;
            _chkADF.checked = true;
        }
        let _chkDuplex = document.getElementById("Duplex");
        if (_chkDuplex) {
            _chkDuplex.disabled = false;
            _chkDuplex.checked = true;
        }
    }

    saveBpmImage(){
        let _chkimgTypebmp = document.getElementById("imgTypebmp");
        if (_chkimgTypebmp) {
            _chkimgTypebmp.checked = true;
        }
        this.btnSave_onclick();
    }

    saveJpegImage(){
        let _chkimgTypejpeg = document.getElementById("imgTypejpeg");
        if (_chkimgTypejpeg) {
            _chkimgTypejpeg.checked = true;
        }
        this.btnSave_onclick();
    }

    savePngImage(){
        let _chkimgTypepng = document.getElementById("imgTypepng");
        if (_chkimgTypepng) {
            _chkimgTypepng.checked = true;
        }
        this.btnSave_onclick();
    }

    saveJpegTiff(complete){
        let _chkimgTypetiff = document.getElementById("imgTypetiff");
        
        if (_chkimgTypetiff) {
            _chkimgTypetiff.checked = true;
            document.getElementById("MultiPageTIFF").checked = complete;
        }
        
        this.btnSave_onclick();
    }

    savePdf(complete){
        let _chkimgTypepdf = document.getElementById("imgTypepdf");
        
        if (_chkimgTypepdf) {
            _chkimgTypepdf.checked = true;
            document.getElementById("MultiPagePDF").checked = complete;
        }
        
        this.btnSave_onclick();
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
        let i, strimgType_save;
        let NM_imgType_save = document.getElementsByName("ImageType");
        for (i = 0; i < 5; i++) {
            if (NM_imgType_save.item(i).checked === true) {
                strimgType_save = NM_imgType_save.item(i).value;
                break;
            }
        }
        this.DWObject.IfShowFileDialog = true;
        let _txtFileNameforSave = document.getElementById("txt_fileName");
        if (_txtFileNameforSave)
            _txtFileNameforSave.className = "";
        let bSave = false;

        let strFilePath = _txtFileNameforSave.value + "." + strimgType_save;

        let OnSuccess = () => {
            this.appendMessage('<b>Guardar imágen: </b>');
            this.checkErrorStringWithErrorCode(0, "Corrécto.");
        };

        let OnFailure = (errorCode, errorString) => {
            this.checkErrorStringWithErrorCode(errorCode, errorString);
        };

        let _chkMultiPageTIFF_save = document.getElementById("MultiPageTIFF");
        let vAsyn = false;
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
        let i, strHTTPServer, strActionPage, strImageType;

        let _txtFileName = document.getElementById("txt_fileName");
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

        let fileName = _txtFileName.value;
        let replaceStr = "<";
        fileName = fileName.replace(new RegExp(replaceStr, 'gm'), '&lt;');
        let uploadfilename = fileName + "." + document.getElementsByName("ImageType").item(i).value;

        let OnSuccess = (httpResponse) => {
            console.log(httpResponse);
            this.appendMessage('<b>Cagar: </b>');
            this.checkErrorStringWithErrorCode(0, "Corrécto.");
        };

        let OnFailure = (errorCode, errorString, httpResponse) => {
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

    goToFirstImage() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = 0;
        this.updatePageInfo();
    }

    goToPreviousImageWheel() {
        if (this.DWObject.HowManyImagesInBuffer !== 0)
            this.goToPrevoiusImage()
    }

    gotoNextImageWheel() {
        if (this.DWObject.HowManyImagesInBuffer !== 0)
            this.goToNextImage()
    }

    goToPrevoiusImage() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        else if (this.DWObject.CurrentImageIndexInBuffer === 0) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer - 1;
        this.updatePageInfo();
    }

    goToNextImage() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        else if (this.DWObject.CurrentImageIndexInBuffer === this.DWObject.HowManyImagesInBuffer - 1) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer + 1;
        this.updatePageInfo();
    }

    goToLastImage() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.HowManyImagesInBuffer - 1;
        this.updatePageInfo();
    }

    removeCurrentImage() {
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

    removeAllImages() {
        if (!this.checkIfImagesInBuffer()) {
            return;
        }
        this.DWObject.RemoveAllImages();
        document.getElementById("DW_TotalImage").value = "0";
        document.getElementById("DW_CurrentImage").value = "";
    }

    setlPreviewMode() {
        let varNum = parseInt(document.getElementById("DW_PreviewMode").selectedIndex + 1);
        let btnCrop = document.getElementById("btnCrop");
        if (btnCrop) {
            let tmpstr = btnCrop.src;
            if (varNum > 1) {
                tmpstr = tmpstr.replace('Crop.', 'Crop_gray.');
                btnCrop.src = tmpstr;
                //btnCrop.onclick = () { };
            }
            else {
                tmpstr = tmpstr.replace('Crop_gray.', 'Crop.');
                btnCrop.src = tmpstr;
                btnCrop.onclick = () => { this.cropImage(); };
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
        let _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.disabled = false;
        _chkMultiPageTIFF.checked = true;

        let _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.checked = false;
        _chkMultiPagePDF.disabled = true;
    }

    rdPDF_onclick() {
        let _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.checked = false;
        _chkMultiPageTIFF.disabled = true;

        let _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.disabled = false;
        _chkMultiPagePDF.checked = true;

    }

    rd_onclick() {
        let _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.checked = false;
        _chkMultiPageTIFF.disabled = true;

        let _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.checked = false;
        _chkMultiPagePDF.disabled = true;
    }
}

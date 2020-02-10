import React from 'react';
import ReactDOM from 'react-dom';

import './WebTwain.css';
import WebBarcode from '../barcode/WebBarcode';

import Dynamsoft from 'dwt';
import $ from 'jquery';
import axios from 'axios';
  
class UI extends React.Component {
    render() {
        return (
        <div id="webTwainMain">
            <div id="DWTcontainer" className="container">
                <div id="DWTcontainerTop">
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
            </div>
        </div>);
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

                    //this.searchBarcodeInImage();
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
            Width: '586px', 
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
    
    imageEncode (arrayBuffer) {
        return 'data:image/png;base64,' + btoa(unescape(encodeURIComponent(arrayBuffer))) + '';
    }

    searchBarcodeInImage(){        
        const url = 'http://127.0.0.1:18622/' + this.DWObject.GetImagePartURL(this.DWObject.CurrentImageIndexInBuffer).replace(':/','');
        axios.get(url)
        .then(res => {
            const img = this.imageEncode(res.data);
            ReactDOM.render(
                <WebBarcode 
                    title="Códigos de barras identificados" 
                    barcode={ 
                        //img
                        'data:image/png;base64,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' + 
                        '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' + 
                        '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' + 
                        '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' + 
                        '56stcqUN05fXy14hU5B1XhRFMd4E48l6Hu+fzl+1OSaTrfai0Wg0bpL8IRNNlq7MC/mwc46YRjv9anMwczWFKQfMlP1KdubJKnXOOefk+GLm8SJPWjUYDPaZb1mWzFemLx+btryyFLIgMuuqMbLm81E2bvPkz7P+oNoBrizsvttdPiy7x+bljdm2797/THP1glerd79/grbv1ecfOaDGi7nrBCinR2be/XlVrXpoIGZWSg37g+c973mbly8nSVKWpTEmaCJZUWit77zzzg996ENpmn70ox/9+Z//+a2trR/6oR96wxvekHa7v/D617///e/vdru/8Ru/8bKXv5zL8ju/8zv/7u/+7sYnPenTn/50p5sS0Wg0stZaa4mov73ze7/3e+94+9t3dnastdN2oc994QudTudzn/vcq171qq2trZe+9KXvete70m73/e9731vf+tYsy37pl37pX917LzG/+tWv/vjHP54myZ7T8UQveclL3vnOd3aXekRyHDmjjSIqy9J7H0fx5fX1f/WqV33+85/Xeuol2g9MWV5ivuuuu774xS8mSUJEWZZ9y7d8ywMPPFB6F7S809bz1AZp/Yd/+If/9Nu+jYhufcpTlFK33377Jz7xCRtFH/voR++7777BYHDvvff+ypveNBwMfvmXf/n//tCHpk3Je3/HHXd84IMfPL22lhe51tpau3tFEdFgp/+a17zmT//0T621H/7wh+/49m8f9PvPfvaznXPPfOYzP/GJT7CiPZeXiIwx3vthlq2trb37P/7mi170omrWn/zkJ//XH/+36+vraZJorSUqyrJcWlr6yZ/+6Xvuuae3vCR/IqtOKeW9l8304IMPvvKVr3RZHsdxWZak9fd///e/+a1vKcvyjW984/vf894bbrjhV3/1V196111RHJMiIiqKIoqiPVfC+39r6n6VZZlSau3s2Y9//OM33fwkWWNKKaUUybmVyBiT5/mb3vSm9/yHd+85XyIaz5qpyPM/eeCBn/u5n7tw4cLS0tKey6u1lsX85te/8d3f/d3rFy8yc5IkeVnedddd999//9LysrR8e2vrzW9+8+//7u+ura39yq/8yl3f9V3VfC9cuPDC//l5ey5vXpbMvLq6+jM/8zM/8iM/QkT33Xffxz72sTiOg7bvtP354f/xyJ5//q773/GBD3xgc3Mzz/NOp+Oc01rL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' + 
                        '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' + 
                        'l+8t0rX1fKWptl2fb2ttb61KlTcj1RdePGA1mTpZNJjbuGk0bKrKsN1O/3B4OB7CTOOat1LHsXj3eGKl2KPFdE+SiT6wqrjZpE7LX7lfTM/ES1c07bb91kyI6qIceqZ+n9eM9kIqLYWqu17ANJkiilijyXoQVZmVmWyQ5w7tw5Zo6iaGtra5xARHLsyH/v3tyyxqyx1Wf2JN33KIqqHJXVLteRNEnc0WjknNPGjEYj2Q+VUrKKnjAAOwd1z2zqygKYxpWlnFirY2/Pj8mo/c7OzvLy8rgD5L1cpFf3t+TOgeSUdLayLJNuBE/uYG1sbcVx7J3TxkjfS3obRCRdlnEnxjk5LXY6nX6/L5NdXl6WU6SEopzTq77OaDSqmpplmXQOBoNBURTKWiaW0TDvnDEmSZLhcNjv9+VmUhRFVUbKibLIMqVUmqbSVGk877qTJD0/SbIkSVipsixJqTzLoiiScCqLwkaRMabX641PcFpbrSVm5FS7s7MjIZokSdXpLMtShptIj/t5WmlSsnQkN1Ro1zmUvc+ybDAYOOfSNC3yXNvJ1QlTlmXee1k/slqUUiaKpLchSy2jndLO7e3tThx3u93hcFj1qCT9TPTEk0w1AGut7XQ6O1vbsqWGw2Ecx/IJ732WZcvLy0WWsfexjWjXPSrZf+S6p+o6T9uvZKVZa31ZypaqcnpP1aCCbIs8y+I49t4rM76ei23E3hdZZq2VOK9mHcWxrHPZFnIdliTJ1tZWZMxwODx16lR/OIyiiCeHjzHGOyfLUm10Hvc99zu+qkGFanw1juN+v5+kaVmWRZ5Lq6SvWRZFp9MZ75Bm3CfO81zW0rRVsXCQZ3BQ1UCTsXZlZeWGG26Qy+1pQxOf//zntdb/+I//+LSnPa3f73e7XTk1p2l67tw5rfXp06flLsLa2tott9yS5/nTnvY06ZrIgSrXm1EU3XzzzQ888MDZs2clQuRvbRzt7Ow897nPXe4tKa1XV1ftZNym0+ksLS198YtfvPHGG2VYTw77hx56SCZ+2223xXF8/vz5Bz/1qTLPz507p5Tq9/tPfepTB4PB6dOnP/nnfx53U2vtnXfeSUS9Xu+mm24a524UbWxsPPWpTx0Oh9JZkXaWZRlF0a233trv95dXVpaWlm644YZOp2O1PnXq1HA43N7e7na7csHuvY+S5OGHHx4Oh3meP/3pT8/z/MYbb3zooYe891/72tdkOr1er1qfz3jGMzY3N8+cOeOcW15e/vrXv97r9WS8sSzLM2fOjG8ijseDufTOGCO3l7TWOo5Pnz590003SYAprU+dOnXrrbfGcXzmzJnPfvazJrLSEcxH2ebm5u233151U2SFO+Y8z7vdLhFlWfY3f/M31tpHH330zjvvzPNcMW9vb585c0Ye/ymKYmVlRbavn3RrqnE8IpKbkWma3nrLUy5cuPDUpz61LMs0TT/5l38po77PesYz4zh+/PHHH/rMZzxRkiRZlpFWRmm5lpIIX15e/vY77zTaTNuv0iSRiNra2VlaWqq66dPO47fffntZlktLSxJRn/nMZ2SEMC8L8izN0ESPP/740259ap7nnsb7/4ULF/7yL/7Csb/jjjtWVlbKsnz44Yd3dnZ2traf8YxnrCwtFUWxvb19o7VJkvzVX/2VUuqGG264/RnPyLLs5ptvvv3220+dOrW0tFS1jYmzLLvlllv2bKfcTHXObWxsfOqTn4zjuNvtPvOZzyycW1lZkXGOm266KUmS1dVV2TfW19e//OUv99KuHDhKqQsXLuzTBTxydY8HIs/goKrLau/czs7O+vo6TZ5S2/PzP/iDPyjXp8PhMEmSJz/5yfLnRVFcunSpKIr19XVXlsbazc3Nb37zm51O57777nv+858vz1OURSGjVOz9Rz7ykde//vUXLlzw3ss08zwnrXq93q/92q+9/LtfpogGg8Fjjz2W5/kXv/hFY8wXvvCFV77ylV/60peISO60f/HLX/7IRz6S53mWZUSktX7b2962tbW1urIivYper/dbv/Vby6urf/vQQ/fcc89mf+clL3nJ+973vk7SybLs0UcfHd9MUipN0x/+4R++66670m73CUu9ubGxvLJCRDs7O+fPn4+i6O7v/d63vOUtJo5/4XWv+/3f//3qIY6tnZ3Xve51Ozs7vV5va2ur2+1+6Utf+sxnPiN9R1lpo9EoG43iOM7z/OGHHzbGvP71r/+eu+/Oh8Pv+Z7v+fu//3sZNZUhUFljNB7n09EkOcZ3s5zf2Ni4cOGC9PBGw2GWZRcvXiyK4m//9m8///nPZ0UuY6RGaWttf3s7TdPqzplSirSWrSmjWPfcc09Zls95znP+4A/+IOl0PvHRj772ta+VfonsJzs7O945bQ1N0qvakWjyzEu/39/a2Hzxi1/83ve+13v/wQ9+8NWvfnWWZVmWrXR7/X7/0f/rV0vvRqMRac3M8iiN9C2kh/qiF73o/vvvT9N02n7Fzsk+UDg3GAxW4mj3rcprPfzww51OJ89zpfWg33/zm9/85S9/eWtr69SpU1mWKaXI+06nY7XZ2trq9XqFK6Wz/u53v/ud73yniezb3va2u+++W2v96le/+hvf+IYm9dBDD62ePv2V//7fX/aylznmr3zlK3/+53/uvb/77rvf+ta3pt3uvffe+xOveU1/Z6e3tESKyrL0xJGNut3uV7/61T3bKRd83vv3vve9b3/726MoGg6HS0tLjrnf78tQx+OPP64mjzuayH72s5+97777fOl+4Ad+4MMf/rA25g2/8Asf+tCHrnfoLwzkGRxUdQqoHoqTE+W06zu5o5Dn+dLSUp7n468zy9CQ9756eE8u5/M8v/nmm6M4zkYjOePLV5TWcRx/4xvfqJ6nkJEcTzwcDjudjgzubW9vZ1kmGbBy+vSZM2dkptWtdYkNZk7TVNogY4zb29tpmkr/aXl1NRsMbrzxxp2dnSiOmLnT6ZBnGagZ30wi2tzc7Ha7EmYyKkXy1LW1y8vLPHnWUYbs4jg2cUze53ne6XTkTok8GiDjmVmWdbvd6skR6erJPTZZvWryZL98kojiNJXvyjP90ueQZtB4NTPLYCMp6bOy8s654XAoV+6dNJVbVnL9PhqN5LxsjOlv73Q6HRlk85Pn3cuy9JM7NHILUFbIY489lnQ6o+FQhnllFPfKrVbZglfnB08e4ZPHT4os39nZkWuXTqczGAyUUktLS64oO51OlmWOvQzPyqM0zjnZPay1Ozs7Eio0eY7x2v3KTh5dcVf/emFapMkQpXyl2+tdunSpLMvV1VW5OxjHsWLO89wpXY3gybBBXhREpLyXEdrxtlOKPctwcZZlzDwcDnu9ngwvW2ujOHZlKfuSbNzxYxpERDQcDvc5HmXvkjt2MkZdFIVcfejJDwN41w8G5BnL8T4TRftPfxEhzyBAFTDV8wtVp+1amonZx9b6spTHrImZJk/9VVOrzv6sKC8Lzz5JO0RETCx34nn8nIJRypdlZIxi4tKxIqM0eSYiYu50u/J7IDaaFG0PB6X31W05IiLn5PkCX5aKKLaWvGciuR9mrZWb1XE33Xh023YSxcTOTxpBpHUpQ4vMnTiWx/iU1jaOxrdkIuu919YQE3tvtZbfK2TyKJ3' + 
                        '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' + 
                        '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' + 
                        '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' + 
                        'e5PJBFGj995ZS12ysW2asiyHw+FoNIoVd3H/zzk3HA6VUvgJfYdKiahtGvQCA4Qbi6IoyxJKwO0IRqd5vK7GT7ctSG7r1q0HFxfBW23TULcLSL16nBhISSkHg0FMIANSSrAs5tXCwoJSKs4cIsrzvCgKeGBoHUnayO6c8+A9JsxgMHDOWWOC99YY1qWOsyzL8/zAgQMUwmg0Wm89olxTt22e53mea63runbWUgh1XU/dwa7Sp6oqTHhMY6yRLMvWIzNoD6MAV4w9ukh4cyLFZwlPALHwYX5+/vTTTz/mmGO2b99+1llnGWNuuummBx56qKoqmJgQwtlnn42SvA984AOTyURKedppp5Vleccdd3zwgx80xrzuda97wQteUJTly172spe+9KVNVd14440PPvgg4jNkrly3xwNX8cQTTzz33HONMb/4i78YVxcScyeddNLc3Bzn/OUvf3lZlsaY4WhkjZFimsOMWwhbtmw57bTTRoMBwoiiKM4888yTTjoJMVPcMOdSHjx48M///M8feeQRWGfO+a5du373d3/XWrt7924hpTXmE5/4xL333ss5/4M/+AP4wkVZOmsHg8EznvEMxtjOU0/dvXu39/7nL7hAZRl4vV/BIaU8/fTT52dnYdlDCCeffPKuXbu2bNkSuiJJVBg+8sgjt99++5euv15K2Zppud173/tekFZeFLpt99x5x5VXXsk5P+2UU9/ylrfMz88/5znPISJi7MQTT3zOc56jm+ad73wn59yFcPnll1dNfcIJJ7znPe+hmMDM8wsuuIC8H41GyF4uLi7edttt9913X1mW55577rHHHgvNIwU6GA6dtYJPt5qOPfbYnTt3EtGWLVv67nxeFBdffHFRFEtLS9u3b/fO5Xl+zjnnhC6oMs7dfffdf/zHf3zgwIHBYKC1Lsvyoosu2n3mWXme79ixA+OL6Hnbtm1nnnnmcccdh+26PM9vueWW+++/f//+/fPz83GiElGW57/1W7+ltT5w4MCf/MmfWGurqkLXGGOnnnrq3Nzc8ccfT0TO2i1btjz72c+eTi3Ox+PxcDg8lPlkbN++fX/5X//Ptm050THHHLNjxw7qqk937ty5a9eutm1vu+22u+66qyxL+CXL4/HCwgL2F4mIMTY7O7tz506l1HHHHYcYi4dgjcmL4tWvfvVLXvKSEMKZZ57pvR+Px7t3715zMf7whz/84Ac/qLV+4IEHzjvvvMlkMhwOwdann376jh07lsdj+GF33nnnlVdeOR6PkaUosnxxcfHEE09cWFio63q9Ko9XvepVWZbdc8893//BDw4ePHj88cfzR79zsgmR+CzhCSAm+quq2rNnzx133PH+97//f3nzmymEL11//Xe/+13GmG5aCsSIff/WW3FX/BBx47e+5Zw766yzXvhzP0eMfu0NryciCnTllVc++OCDMQqM0R7uciGcunPnm99yKXXGJXRb6MH7vXv3/sd//Adj7K+v/NTc3BxukZmK+Sjq4o/9+/fv2bNHdI+1FN7/f/z+M57xjMhk0ysD/eOXvvTWt761vx9+2WWXvfktl/ap9POfuxbt/umf/uk0OxSIc261vu2WWxhju55x+pvfcim4k9i0bDp6/VJKCrRnzx7eNe1CKAaDj/3FXzDBkTINFBgxFohCuPjii2/81remOvGBMfbtW743Go0gcJbnD913///12c957y983ev+5E//FK1gq++BBx74t3/7NyL6kwsueOaznrWyvAzbvWPHjvf87+8h1tVeMjrjWc8841nPnI5W1+73brmFMfb+yy9/1pln4rIIoQ5ZkvF4vGfPHgSa8dUFxhgxetMlb6ZeWURg9N3v/Zt4tIW88VvfwgdPxBj7hZf+J7b7bArh7r179+7dyxgTjMGz+cu/+ivGeaDpeH3qv//15z73uRBCVVXUhfWQ8w0XX0REK0vLZ599tupeh5iW4TDinO846SQiElIuLi7efPPNiJit9yGEpmlE7xWC8Xj8mc98hjEmOZ/mYztv6Zf+839+86WXEtHFF130/R/8gHUTCXmGQz1krKqq22+/nYhOP/10IiK8RCE4MXr1a3617wQIJW+++WZaCyzQd264MbAuDO3S0UT0o7vvvu+++xjqj4jppv30VVezJ0hF137+80T0/dtu+8R/+28hhMFggPn2hB7yE0bKNyYk/PRik7vbRwSeXh1u3PpP2/gmPktISEhIOBqQ+Cwh4QjDZi+aPgJxpKv0SJE/nX+WkJCQkJDw2Eh8lpBwhCEt2h87jnSVHinyp/fPEhISEhISHhuJzxISEhISjgYkPktI+OnFJn+d6IjA06vDjVv/aRvfxGcJCT+9+Gl7P+mpQHr/bPMg8VlCQkJCwtGAxGcJCUcYjpSXjY4gHOkqPVLkT++fJSQkJCQkPDYSnyUkHGFIi/bHjiNdpUeK/On9s4SEhISEhMdG4rOEhISEhKMBic8SEn568dP2ftJTgfT+2eZB4rOEhJ9e/LS9n/RUIL1/tnmQ+CwhISEh4WhA4rOEhCMMR8rLRkcQjnSVHinyp/fPEhISEhISHhuJzxISjjCkRftjx5Gu0iNF/vT+WUJCQkJCwmMj8VlCQkJCwtGAxGcJTwDOOSIK3htjvPfW2ukPjFlrOefGGCLyzhGRlNI5p5TinAsh8Nl7H0LgnOMCa8yq5+OZIYQ8z51znHMXgrbWE3nviYgCkQ+MGHWv1wTvnXOMMSEE55wxhjJl/BfXMMYYMQpEgYwxjLHWGBeC9V5yoZvWGYtfGTFGzBlLRNZ7670n4lI2WuMzWmfEvHOMcxcCl9J6T0Scc1zCOA8hMMaccyIQC0Q+cMa9dehpX3tGaymltdYYgy4IIdBTRoz5wANjYapnqA69894755SQU+GJgvfW+8BYgBLwPyLGWPAeo8AYg06cc0KIqa78ulv1wXvqdGitVUrhYtyIKRE/eO+llN57yIkrpz0NxAJhFILznHEWyBmL53DOOedSSsaY954xxokk5z7OMe8FY5mU0A90i+ejO1xKF4KJ8hiLcUTr1lopZQghhKC1JiITvMizRuvAGBOCiJy1UBGGg4XgjFGMkw+YG+SDEtI5p7X2REIp6z06i+dD2977tm2ZEJ4IE0O3LZ7gjMVA4C4T539XWL+qwp6tD54p7V2jNaZxURQO68cYLD1oKT4zhIB5pZRqmgY6x09CCIhUFAVjTEqptSZGzjsuhcxUYEScEWc+bOrSk8RnCY8XWOf4XJblYDDIssx7D/ZSSgkhsiwLIXAhiMhaC9vkvTfGwNaDzEIIxhhjDB44XcPeK6XyPM+yzDkXQlBK4VeYsCzLrLVojkLANYwx1hGAtVZrDZtFRGiOOtNPRM5aIoIRz7KMMcY5b9t2NBpBEt22RGSNEVKGTh6lVF3XRVGAjzvrPO2m915rverFVVBslIQYAyXgFtgamFdjjMoyrXVRFHmeQ2lVVTHOpxzDGBF554L3wXvfWXDeQWstoSjvGedFUUCeEMK0XXwggsJDCDB8QghQuzGG8XVNAePcGoMrYYJxcTSF1LOVuOAQ34SAudE9i7VNE1UUQoABxSTRWldVxRjLsoxz7pxDo9QRqhBCa621tt04ss59cc41TYN7tda+YzUhJUYWFO' + 
                        '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VVZVkS0XA0etvb3nbJJZdwzv/sz/5sZWXlkUce+Y3f+I22bbdt2/bxj398OBz+3M/93DXXXJPn+T/+4z9ibhRFERhJKd/5zndecMEFUCxUccopp6w5Luc973mvfe1rnXPXXnvtd77zHWPMaDQiImvMjh07hsPheDx+05vedPDgwdFodNJJJymlTj/99Le85S3xCdbaz33uc//2ne+AiZFOf/vb337iiSdOY3rGzjjjjM985jPe+5mZGcToT9xy/OSQ+Czh8SIaLyQDl5eXtdb33XefzLK77roLW8pa66WlpeOOO05I+eCDD1ZVFUI455xzZJ4fOHDgnnvuwUYa0hcPPvyw1rocDpBXVEo99/nPQzVBpCLGGPnw8MMPP/DAA/Cpv//97zPGXv/61x9KygXyzi0uLiLMgrMcHwJi45yfccYZXIjg/cknn3zaaac550S3Z/be9773Rz/6EfxQhIw33XSTUmrLli0XvPjFFIK1Frs111133S233AJ6w+3nnXeeVCpu2CBHFLwfj8f79+8nIufcXXfdFUJYWlryzgVG2AukLpizxpz/oheRcyQEOeeJHnrooVtvvVUp9cADD/S6GYjo4MGDDz3wwNSYWhdCICmccyeffDLs6czs7It+/ueJ6Nvf/vbtt9/uvX/44YebupZSTiaTO++8U0p57733xuzxww8/fOqpp268LxK8f+SRR+655x5cX1XVzMyMfPRW0GQy+d73vue9z8W07OL+Bx+01o5mZxCiEWO33XbbwYMHUTpkjVleXj5w4EBTVdA8vscW18LCwvNf+IK+DM99/vOIaDKZ3HPPPZiE3jkuRPQkth1//Lbjjw/eX3vttTfccANcorquXfBIYxLR+eefz4W47eab9+7dWzXN9u3bn/Oc52BWYHvMWvvv//7voUsweO8PHDhQ1/VoNLLet2174MABTIk4f2699dZ9+/Yh6whRd+/eDRfkfe973759+7Isu/HGG4UQi4uLw9GIiGZmZs455xyp1E033XTnnXeOx2MhhAueMTaZTBB9TqNzKfft27fmoJz73Oc+//nPJ6Lrrrtu3759nPOqqpy1nPNHHnnkBz/4QVmWmIHIKLrgT9px8nPOOxfeHvZN/5//9wt79+5FFCilzLLs1FNP3X3OOdQV6WRZ9rznPS+WDvUz4U8CT3U+MPFZwuNFzEsgfTQej5VSg8EgMIbFDJYCgvfYZ67rWuY5ESEBhW15' + 
                        '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' + 
                        'J08t6Px+PRaLSxYGu2u15/8f3h4xs1sErPmBiRgeLn9bBef/tSxSHD3IY8kE1KiQngvV9zfNfj9Q307L0HM6GPzjlM1z5VxGm26plxHcWfIGd/Ha0nzwbrNw5rJKf15rOUcr31uwEQG0WCj583uH7VsEZ+WrWO+leiF/2erqdnmKnEZ5sdxpho17Bin+iQ9d3DPm1ElxCZjb47vMpgcc6xGNq2ZYxh0iNLED3N/j4H57w/WVe1GxEF2JjMokgIrZA/iasOovYFXk8/UcJ4cd9F6IsdzdB64cvhtmkVR1JnqmI0hkXovUeku0EwtEobq7gEaof+YfpX9WuDCLUvZH/IHg+LHN7uKhPW72/8hnrju4GeqTcobdtiwj+eKdHvL56/psO3Sof9IPLw8X2c82e94O9wmjHGEJFSCvYXIdTh62jVuMc/15MncsCq9buKXfoK2WA+r7d+DwdIxXvfz3NsrDdjDPpLj/ZN11xHG8zeNfXc/ynx2WYHphpW4OPJPxwOzF0MP/J1fXt9uM9Y17VSChnCpmnKslzPUMYphWqI6IDDBY70s6rdyIKxgzHr8ji1Qd2igk54hz7Frnkvsn/9XkCx0dD3DR+IMzqA0c3Hr2gXYh9u2lYlrw4n7A3WbYx4ovlbb6Soi+QiWQJIisaxiLkv3BJTx/F73LWB/Vqz3f6U6Pf3cAKO47umnuMDYzC3MfrOQb+/MarGkK2KivqGDvdSx8Frju/jbxfUi24ePg8PnxsbrCPqJagxsutN5qjbw2dFDL9ibhM6gWOxZn/XXL+PZ2ujHxo+JvpqiUnINdcRMvNIZsKhh2Br6hnPhL1KfLap0batUiqGR/Sk/i3XNf3uaFlCt8mBhYoVS+u4P9QlrJHWOzzP0J+Ra9rHNS84PLjp43DHf1Vs8ZiR2eF6iJ5BTNnxbjcO9L8qw7kqKRpVBBNgre3vFPZTi1BRDGi01kKIjY3Umv1aL3hCFpHWij6jwGuyafxmveh5Y0BLa/Y3Jh4PH9819QyD2L99Y1OOUT68v/1eRDFiSiNyatzF7BPMqvHdAIe3u162bb2cBL48fB1FY01EfS5cb1aj0TXXb3xa/8r1+tufWo+5fqmXMVrlXK53fXTH8eeqzA0dto7Wk2HjrOY0Z7PmbwmbBHmeI/aPMQR74iAirTURoTQI2floQfATlkGc3DBPyJNgx4i6MnelVFEUkKrv6/luq5m6RPx67eJL3lUH4MsNXDxI1TQNmoiPpc424bPvbeSsCTizuBd+n+tKrvuLP89zdL//ZDxhmtNgLO5wYBXFEAfmKdqsqCLcwjkvigILG8rcANAkgItj99E6PNM8z6NRwK9xo6ivQCLCaEalRVaw1vbbOhzrtbtefzcY3zX1HOd2bGs9yscIrtffOGPjxX2LD/89hBAJeIPx3WApHd4u64WVMe4BZ/Q1Rl3ktN46glRKKURU1HM318QG6xfZkbiWIep6/d1g/a4JpVS8Ed8gU7KenPiVerkE6sLxNddRTPlIKXEBNLaenqlnr1J8lpCQkJBwNCDFZwkJCQkJRwMSnyUkJCQkHA1IfJaQkJCQcDQg8VlCQkJCwtGA/w+/zzJlXSryEAAAAABJRU5ErkJggg=='
                     }
                />,
                document.getElementById('btnBarcode')
            );
        })
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

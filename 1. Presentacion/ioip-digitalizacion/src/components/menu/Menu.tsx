// #region imports
import React, { Component } from 'react';

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { loadTheme } from 'office-ui-fabric-react';
import * as socketio from "socket.io-client";
import logo from '../../logo.png';

import './Menu.css';
import { Sheet } from '../../model/Sheet';

// #endregion imports

initializeIcons();

export class Menu extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            panelScan: props.isOpen
        }
        /*const socket = socketio.connect("192.168.0.37:8888");

        socket.on('connect', (msg: any) => {
            console.log("connect:" + msg)
        });
        socket.on('event', (msg: any) => {
            console.log(msg)
        });
        socket.on('disconnect', (msg: any) => {
            console.log(msg)
        });
        socket.on('message', (msg: any) => {
            console.log(msg)
        });

        socket.on('callback', (msg: any) => {
            console.log(msg)
        });

        console.log('abriendo puerto');
        socket.open();
        console.log('enviando');
        //socket.send('GET');
        //socket.send('/');
        //socket.send('HTTP/1.1');
        console.log('emitiendo');
        //socket.emit('hello', 'helloworld');
        console.log('cerrando');
        socket.close(); 
        console.log('desconectando');
        socket.disconnect();
        console.log('desconectado');
*/
        let currentTheme = this.props.theme;
        loadTheme(currentTheme);

        this.state = {
            appName: '',
            sheets: undefined
        }

        this.setState({
            appName: this.props.tittle,
        });

        // #region binding
        this.addImage = this.addImage.bind(this);
        this.upload = this.upload.bind(this);
        this.download = this.download.bind(this);
        this.uploadFileFromDisk = this.uploadFileFromDisk.bind(this);
        // #endregion binding
    }

    // #region linkers
    addImage() {
        this.props.handleAddImage();
    }

    download() {
        this.props.handleDownload();
    }

    upload() {
        this.props.handleUpload();
    }

    uploadFileFromDisk() {
        this.props.handleUploadFileFromDisk();
    }

    handleEditImage() {
        this.props.handleEditImage();
    }

    handleRotateLeft() {
        this.props.handleRotateLeft();
    }

    handleRotateRight() {
        this.props.handleRotateRight();
    }

    handleRotate180() {
        this.props.handleRotate180();
    }

    handleVerticalMirror() {
        this.props.handleVerticalMirror();
    }

    handleHorizontalMirror() {
        this.props.handleHorizontalMirror();
    }

    handleRemoveCurrentImage() {
        this.props.handleRemoveCurrentImage();
    }

    handleRemoveAllImages() {
        this.props.handleRemoveAllImages();
    }

    handleCropImage() {
        this.props.handleCropImage();
    }

    handleResizeImage() {
        this.props.handleResizeImage();
    }

    handleSaveBpm() {
        this.props.handleSaveBpm();
    }

    handleSaveJpeg() {
        this.props.handleSaveJpeg();
    }

    handleSavePng() {
        this.props.handleSavePng();
    }

    handleSaveTiff(complete: boolean) {
        this.props.handleSaveTiff(complete);
    }

    handleSavePdf(complete: boolean) {
        this.props.handleSavePdf(complete);
    }

    handleSetPanelScanState(panelScan: any){
        this.props.handleSetPanelScanState(panelScan);
    }
    // #endregion linkers

    getSheets(): Sheet[] {
        return (this.state?.sheets as Sheet[]);
    }

    getBarcodesLengt(): number {
        const barcodesLenght = this.getSheets()?.filter(sheet => sheet.barcodes);
        return (barcodesLenght) ? barcodesLenght.length : 0;
    }

    getOcrRecognizedLength(): number {
        const ocrLenght = this.getSheets()?.filter(sheet => sheet.paragraphFromOcr);
        return (ocrLenght) ? ocrLenght.length : 0;
    }

    render() {

        return (<>
            <header className="App-header">
                <div className="Complete-Logo">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h3>{this.props.tittle}</h3>
                </div>
                <div className="Menubar">
                    <CommandBar
                    isSearchBoxVisible={ false }
                        items={
                            [
                                {
                                    key: 'add',
                                    text: 'Agregar',
                                    iconProps: { iconName: 'Add' },
                                    split: true,
                                    ariaLabel: 'Agregar',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'scanFile',
                                                text: 'Desde escaner',
                                                iconProps: { iconName: 'ImagePixel' },
                                                split: true,
                                                ariaLabel: 'Desde escaner',
                                                onClick: () => {
                                                    this.handleSetPanelScanState({panelScan: {
                                                        isOpen: true
                                                    }});
                                                    //this.addImage();
                                                },
                                            },
                                            {
                                                key: 'addFileFromDisk',
                                                text: 'Desde archivo',
                                                iconProps: { iconName: 'OpenFile' },
                                                split: true,
                                                ariaLabel: 'Desde archivo en el disco',
                                                onClick: () => {
                                                    this.uploadFileFromDisk();
                                                },
                                            },
                                            {
                                                key: 'takePicture',
                                                text: 'Desde cámara',
                                                iconProps: { iconName: 'Camera' },
                                                split: true,
                                                ariaLabel: 'Desde camara',
                                            }
                                        ]
                                    }
                                },
                                {
                                    key: 'editItem',
                                    text: 'Editar',
                                    iconProps: { iconName: 'EditPhoto' },
                                    split: true,
                                    ariaLabel: 'Editar',
                                    onClick: () => {
                                        this.handleEditImage();
                                    },
                                },
                                {
                                    key: 'rotate',
                                    text: 'Rotar',
                                    iconProps: { iconName: 'Rotate' },
                                    split: true,
                                    ariaLabel: 'Rotar',
                                    subMenuProps: {
                                        items: [{
                                            key: 'rotateLeftItem',
                                            text: 'Rotar a la izquierda',
                                            iconProps: { iconName: 'Rotate90CounterClockwise' },
                                            split: true,
                                            ariaLabel: '',
                                            onClick: () => {
                                                this.handleRotateLeft();
                                            },
                                        },
                                        {
                                            key: 'rotateRightItem',
                                            text: 'Rotar a la derecha',
                                            iconProps: { iconName: 'Rotate90Clockwise' },
                                            split: true,
                                            ariaLabel: '',
                                            onClick: () => {
                                                this.handleRotateRight();
                                            },
                                        },
                                        {
                                            key: 'rotateItem',
                                            text: 'Rotar 180°',
                                            iconProps: { iconName: 'Rotate' },
                                            split: true,
                                            ariaLabel: '',
                                            onClick: () => {
                                                this.handleRotate180();
                                            },
                                        }]
                                    }
                                },
                                {
                                    key: 'mirror',
                                    text: 'Espejo.',
                                    iconProps: { iconName: 'AlignHorizontalCenter' },
                                    split: true,
                                    ariaLabel: 'Espejo',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'horizontalMirrorItem',
                                                text: 'Espejo horizontal',
                                                iconProps: { iconName: 'AlignHorizontalCenter' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleHorizontalMirror();
                                                },
                                            },
                                            {
                                                key: 'verticalMirrorItem',
                                                text: 'Espejo vertical',
                                                iconProps: { iconName: 'AlignVerticalCenter' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleVerticalMirror();
                                                },
                                            }
                                        ]
                                    }
                                },
                                {
                                    key: 'delete',
                                    text: 'Borrar página',
                                    iconProps: { iconName: 'Delete' },
                                    split: true,
                                    ariaLabel: 'Borrar',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'deleteOneItem',
                                                text: 'Borrar página',
                                                iconProps: { iconName: 'Delete' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleRemoveCurrentImage();
                                                },
                                            },
                                            {
                                                key: 'deleteAllItem',
                                                text: 'Borrar todas las páginas',
                                                iconProps: { iconName: 'DeleteTable' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleRemoveAllImages();
                                                },
                                            }
                                        ]
                                    }
                                },
                                {
                                    key: 'resize',
                                    text: 'Cambiar tamaño',
                                    iconProps: { iconName: 'SizeLegacy' },
                                    split: true,
                                    ariaLabel: '',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'resizeItem',
                                                text: 'Redimensionar',
                                                iconProps: { iconName: 'SizeLegacy' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleResizeImage();
                                                },
                                            },
                                            {
                                                key: 'trimItem',
                                                text: 'Recortar',
                                                iconProps: { iconName: 'Trim' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleCropImage();
                                                },
                                            },
                                        ]
                                    }
                                },
                                {
                                    key: 'decodeBarcodeItem',
                                    text: 'Cod. barras (' + this.getBarcodesLengt() + ')',
                                    iconProps: {
                                        //iconName: 'GenericScanFilled'
                                        iconName: 'QRCode'
                                    },
                                    split: true,
                                    disabled: this.getBarcodesLengt() < 1,
                                    href: 'https://dev.office.com/fabric',
                                    subMenuProps: {
                                        items: [
                                            { key: 'item1', text: 'Item One' },
                                            { key: 'item2', text: 'Item Two' }
                                        ]
                                    }
                                },
                                {
                                    key: 'decodeOcrItem',
                                    text: 'Ocr (' + this.getOcrRecognizedLength() + ')',
                                    iconProps: {
                                        iconName: 'TextOverflow'
                                    },
                                    split: true,
                                    disabled: this.getBarcodesLengt() < 1,
                                    href: 'https://dev.office.com/fabric',
                                    subMenuProps: {
                                        items: [
                                            { key: 'item1', text: 'Item One' },
                                            { key: 'item2', text: 'Item Two' }
                                        ]
                                    }
                                },
                                {
                                    key: 'downloadFile',
                                    text: 'Descargar',
                                    ariaLabel: 'Descargar',
                                    iconProps: { iconName: 'Download' },
                                    iconOnly: true,
                                    disabled: false,
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'downloadBmp',
                                                iconProps: { iconName: 'FileImage' },
                                                 text: 'BMP',
                                                 onClick: () => {
                                                    this.handleSaveBpm();
                                                },
                                            },
                                            { 
                                                key: 'downloadJpeg', 
                                                iconProps: { iconName: 'FileImage' }, 
                                                text: 'JPEG' ,
                                                onClick: () => {
                                                    this.handleSaveJpeg();
                                                },
                                            },
                                            { 
                                                key: 'downloadPng', 
                                                iconProps: { iconName: 'FileImage' }, 
                                                text: 'PNG' ,
                                                onClick: () => {
                                                    this.handleSavePng();
                                                },
                                            },
                                            { 
                                                key: 'downloadTiffCurrent', 
                                                iconProps: { iconName: 'FileTemplate' }, 
                                                text: 'TIFF, Página',
                                                onClick: () => {
                                                    this.handleSaveTiff(false);
                                                },
                                            },
                                            { 
                                                key: 'downloadTiffAll', 
                                                iconProps: { iconName: 'FileTemplate' }, 
                                                text: 'TIFF, Todo',
                                                onClick: () => {
                                                    this.handleSaveTiff(true);
                                                },
                                            },
                                            { 
                                                key: 'downloadPdfCurrent', 
                                                iconProps: { iconName: 'PDF' }, 
                                                text: 'PDF, Página',
                                                onClick: () => {
                                                    this.handleSavePdf(false);
                                                },
                                            },
                                            { 
                                                key: 'downloadPdfAll', 
                                                iconProps: { iconName: 'PDF' }, 
                                                text: 'PDF, Todo',
                                                onClick: () => {
                                                    this.handleSavePdf(true);
                                                },
                                            },
                                        ]
                                    }
                                },
                                {
                                    key: 'processPdf',
                                    text: 'Procesar',
                                    ariaLabel: 'Procesar',
                                    iconProps: { iconName: 'PDF' },
                                    iconOnly: true,
                                    disabled: false,
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'signPdf',
                                                onClick: () => {
                                                    this.upload();
                                                },
                                                iconProps: { iconName: 'InsertSignatureLine' }, text: 'Firma digital'
                                            },
                                        ]
                                    }
                                }
                            ]
                        }
                    />
                </div>

            </header>
        </>)
    }
}


export default Menu;
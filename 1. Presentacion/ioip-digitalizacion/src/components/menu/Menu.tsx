// #region imports
import React, { Component } from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
//import { loadTheme } from 'office-ui-fabric-react';
//import * as socketio from "socket.io-client";
import logo from '../../logo.png';

import './Menu.css';
import { SheetDto } from '../../model/Sheet';
// #endregion imports

initializeIcons();

export class Menu extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            panelScan: props.isOpen,
            appName: this.props.tittle,
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
        //let currentTheme = this.props.theme;
        //loadTheme(currentTheme);

        this.state = {
            appName: '',
            sheets: undefined
        }

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

    handleSetPanelScanState(panelScan: any) {
        this.props.handleSetPanelScanState(panelScan);
    }
    // #endregion linkers

    getSheets(): SheetDto[] {
        return (this.state?.sheets as SheetDto[]);
    }

    getBarcodesLengt(): number {
        const barcodesLenght = this.getSheets()?.filter(sheet => sheet.barcodes);
        return (barcodesLenght) ? barcodesLenght.length : 0;
    }

    getOcrRecognizedLength(): number {
        const ocrLenght = this.getSheets()?.filter(sheet => sheet.paragraphFromOcr);
        return (ocrLenght) ? ocrLenght.length : 0;
    }


    public render(): JSX.Element {

        return (<div>
            <header className="App-header">
                <div className="Complete-Logo">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h3>{this.props.tittle}</h3>
                </div>
                <div className="Menubar">
                    <CommandBar
                        isSearchBoxVisible={false}
                        items={
                            [
                                {
                                    key: 'add',
                                    name: 'Agregar',
                                    iconProps: { iconName: 'Add' },
                                    split: true,
                                    ariaLabel: 'Agregar',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'scanFile',
                                                name: 'Desde escaner',
                                                iconProps: { iconName: 'ImagePixel' },
                                                split: true,
                                                ariaLabel: 'Desde escaner',
                                                onClick: () => {
                                                    this.handleSetPanelScanState({
                                                        panelScan: {
                                                            isOpen: true
                                                        }
                                                    });
                                                    //this.addImage();
                                                },
                                            },
                                            {
                                                key: 'addFileFromDisk',
                                                name: 'Desde archivo',
                                                iconProps: { iconName: 'OpenFile' },
                                                split: true,
                                                ariaLabel: 'Desde archivo en el disco',
                                                onClick: () => {
                                                    this.uploadFileFromDisk();
                                                },
                                            },
                                            {
                                                key: 'takePicture',
                                                name: 'Desde cámara',
                                                iconProps: { iconName: 'Camera' },
                                                split: true,
                                                ariaLabel: 'Desde camara',
                                            }
                                        ]
                                    }
                                },
                                {
                                    key: 'editItem',
                                    name: 'Editar',
                                    iconProps: { iconName: 'EditPhoto' },
                                    split: true,
                                    ariaLabel: 'Editar',
                                    onClick: () => {
                                        this.handleEditImage();
                                    },
                                },
                                {
                                    key: 'rotate',
                                    name: 'Rotar',
                                    iconProps: { iconName: 'Rotate' },
                                    split: true,
                                    ariaLabel: 'Rotar',
                                    subMenuProps: {
                                        items: [{
                                            key: 'rotateLeftItem',
                                            name: 'Rotar a la izquierda',
                                            iconProps: { iconName: 'RevToggleKey' },
                                            split: true,
                                            ariaLabel: '',
                                            onClick: () => {
                                                this.handleRotateLeft();
                                            },
                                        },
                                        {
                                            key: 'rotateRightItem',
                                            name: 'Rotar a la derecha',
                                            iconProps: { iconName: 'ReturnToSession' },
                                            split: true,
                                            ariaLabel: '',
                                            onClick: () => {
                                                this.handleRotateRight();
                                            },
                                        },
                                        {
                                            key: 'rotateItem',
                                            name: 'Rotar 180°',
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
                                    name: 'Espejo.',
                                    iconProps: { iconName: 'AlignHorizontalCenter' },
                                    split: true,
                                    ariaLabel: 'Espejo',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'horizontalMirrorItem',
                                                name: 'Espejo horizontal',
                                                iconProps: { iconName: 'AlignHorizontalCenter' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleHorizontalMirror();
                                                },
                                            },
                                            {
                                                key: 'verticalMirrorItem',
                                                name: 'Espejo vertical',
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
                                    name: 'Borrar página',
                                    iconProps: { iconName: 'Delete' },
                                    split: true,
                                    ariaLabel: 'Borrar',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'deleteOneItem',
                                                name: 'Borrar página',
                                                iconProps: { iconName: 'Delete' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleRemoveCurrentImage();
                                                },
                                            },
                                            {
                                                key: 'deleteAllItem',
                                                name: 'Borrar todas las páginas',
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
                                    name: 'Cambiar tamaño',
                                    iconProps: { iconName: 'SizeLegacy' },
                                    split: true,
                                    ariaLabel: '',
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'resizeItem',
                                                name: 'Redimensionar',
                                                iconProps: { iconName: 'SizeLegacy' },
                                                split: true,
                                                ariaLabel: '',
                                                onClick: () => {
                                                    this.handleResizeImage();
                                                },
                                            },
                                            {
                                                key: 'trimItem',
                                                name: 'Recortar',
                                                iconProps: { iconName: 'Crop' },
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
                                    name: 'Cod. barras (' + this.getBarcodesLengt() + ')',
                                    iconProps: {
                                        //iconName: 'GenericScanFilled'
                                        iconName: 'GenericScan'
                                    },
                                    split: true,
                                    disabled: this.getBarcodesLengt() < 1,
                                    href: 'https://dev.office.com/fabric',
                                    subMenuProps: {
                                        items: [
                                            { key: 'item1', name: 'Item One' },
                                            { key: 'item2', name: 'Item Two' }
                                        ]
                                    }
                                },
                                {
                                    key: 'decodeOcrItem',
                                    name: 'Ocr (' + this.getOcrRecognizedLength() + ')',
                                    iconProps: {
                                        iconName: 'TextBox'
                                    },
                                    split: true,
                                    disabled: this.getBarcodesLengt() < 1,
                                    href: 'https://dev.office.com/fabric',
                                    subMenuProps: {
                                        items: [
                                            { key: 'item1', name: 'Item One' },
                                            { key: 'item2', name: 'Item Two' }
                                        ]
                                    }
                                },
                                {
                                    key: 'downloadFile',
                                    name: 'Descargar',
                                    ariaLabel: 'Descargar',
                                    iconProps: { iconName: 'Download' },
                                    iconOnly: true,
                                    disabled: false,
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'downloadBmp',
                                                iconProps: { iconName: 'FileImage' },
                                                name: 'BMP',
                                                onClick: () => {
                                                    this.handleSaveBpm();
                                                },
                                            },
                                            {
                                                key: 'downloadJpeg',
                                                iconProps: { iconName: 'FileImage' },
                                                name: 'JPEG',
                                                onClick: () => {
                                                    this.handleSaveJpeg();
                                                },
                                            },
                                            {
                                                key: 'downloadPng',
                                                iconProps: { iconName: 'FileImage' },
                                                name: 'PNG',
                                                onClick: () => {
                                                    this.handleSavePng();
                                                },
                                            },
                                            {
                                                key: 'downloadTiffCurrent',
                                                iconProps: { iconName: 'FileTemplate' },
                                                name: 'TIFF, Página',
                                                onClick: () => {
                                                    this.handleSaveTiff(false);
                                                },
                                            },
                                            {
                                                key: 'downloadTiffAll',
                                                iconProps: { iconName: 'FileTemplate' },
                                                name: 'TIFF, Todo',
                                                onClick: () => {
                                                    this.handleSaveTiff(true);
                                                },
                                            },
                                            {
                                                key: 'downloadPdfCurrent',
                                                iconProps: { iconName: 'PDF' },
                                                name: 'PDF, Página',
                                                onClick: () => {
                                                    this.handleSavePdf(false);
                                                },
                                            },
                                            {
                                                key: 'downloadPdfAll',
                                                iconProps: { iconName: 'PDF' },
                                                name: 'PDF, Todo',
                                                onClick: () => {
                                                    this.handleSavePdf(true);
                                                },
                                            },
                                        ]
                                    }
                                },
                                {
                                    key: 'processPdf',
                                    name: 'Procesar',
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
                                                iconProps: { iconName: 'InsertSignatureLine' }, name: 'Firma digital'
                                            },
                                        ]
                                    }
                                }
                            ]
                        }
                    />
                </div>

            </header>
        </div>)
    }
}


export default Menu;
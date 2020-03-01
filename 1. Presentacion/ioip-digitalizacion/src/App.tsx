// #region imports
import React from 'react';

import './App.css';

import { PagePreview } from './components/page-preview/PagePreview';
import { Menu } from './components/menu/Menu';
import { ConfirmationPanel } from './components/confirmation-panel/ConfirmationPanel';
import { TransactionLog } from './components/transaction-log/TransactionLog';
import DWT from './components/twain/WebTwain';

// #endregion imports

// #region estilos

/*const dark = {
  palette: {
    themePrimary: "#0078d4",
    themeLighterAlt: "#eff6fc",
    themeLighter: "#deecf9",
    themeLight: "#c7e0f4",
    themeTertiary: "#71afe5",
    themeSecondary: "#2b88d8",
    themeDarkAlt: "#106ebe",
    themeDark: "#005a9e",
    themeDarker: "#004578",
    neutralLighterAlt: "#0b0b0b",
    neutralLighter: "#151515",
    neutralLight: "#252525",
    neutralQuaternaryAlt: "#2f2f2f",
    neutralQuaternary: "#373737",
    neutralTertiaryAlt: "#595959",
    neutralTertiary: "#fcf7f7",
    neutralSecondary: "#fcf8f8",
    neutralPrimaryAlt: "#fdf9f9",
    neutralPrimary: "#f9f2f2",
    neutralDark: "#fefcfc",
    black: "#fefdfd",
    white: "#282c34"
  }
};

const light = {
  palette: {
    themePrimary: "#0078d4",
    themeLighterAlt: "#eff6fc",
    themeLighter: "#deecf9",
    themeLight: "#c7e0f4",
    themeTertiary: "#71afe5",
    themeSecondary: "#2b88d8",
    themeDarkAlt: "#106ebe",
    themeDark: "#005a9e",
    themeDarker: "#004578",
    neutralLighterAlt: "#f8f8f8",
    neutralLighter: "#f4f4f4",
    neutralLight: "#eaeaea",
    neutralQuaternaryAlt: "#dadada",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c8c8",
    neutralTertiary: "#c2c2c2",
    neutralSecondary: "#858585",
    neutralPrimaryAlt: "#4b4b4b",
    neutralPrimary: "#333333",
    neutralDark: "#272727",
    black: "#1d1d1d",
    white: "#ffffff"
  }
};

//theme={dark}
*/


// #endregion estilos
export class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      panelScan: {
        isOpen: false
      }
    }
  }
  // #region variables globales
  transactionLogReference: any;
  dwtReference: any;
  menuReference: any;
  pagePreviewReference: any;
  panelScanState: any;
  // #endregion variables globales

  // #region Eventos de conexión administrada entre componentes
  handleTransactionLog = (prueba: string) => {
    this.transactionLogReference.appendMessage(prueba);
  }

  handleAddImage = (index) => {
    this.dwtReference.acquireImage(index);
  }

  handleDownload = () => {
    this.dwtReference.saveUploadImage('local');
  }

  handleUpload = () => {
    this.dwtReference.saveUploadImage('server');
  }

  handleUploadFileFromDisk = () => {
    this.dwtReference.uploadFileFromDisk();
  }

  handleEditImage = () => {
    this.dwtReference.editSelectetImage();
  }

  handleRotateLeft = () => {
    this.dwtReference.rotateLeft();
  }

  handleRotateRight = () => {
    this.dwtReference.rotateRight();
  }

  handleRotate180 = () => {
    this.dwtReference.rotate180();
  }

  handleVerticalMirror = () => {
    this.dwtReference.verticalMirror();
  }

  handleHorizontalMirror = () => {
    this.dwtReference.horizontalMirror();
  }

  handleRemoveCurrentImage = () => {
    this.dwtReference.removeCurrentImage();
  }

  handleRemoveAllImages = () => {
    this.dwtReference.removeAllImages();
  }

  handleCropImage = () => {
    this.dwtReference.cropImage();
  }

  handleResizeImage = () => {
    this.dwtReference.resizeImage();
  }

  handleSaveBpm = () => {
    this.dwtReference.saveBpmImage();
  }

  handleSaveJpeg = () => {
    this.dwtReference.saveJpegImage();
  }

  handleSavePng = () => {
    this.dwtReference.savePngImage();
  }

  handleSaveTiff = (complete: boolean) => {
    this.dwtReference.saveTiff(complete);
  }

  handleSavePdf = (complete: boolean) => {
    this.dwtReference.savePdf(complete);
  }

  handleSetPanelScanState = (panelScanIn: any) =>{
    this.panelScanState.setPanelScanState(panelScanIn);
  }

  handleAddImageToPreview = (image: any) =>{
    this.pagePreviewReference.addImageToPreview(image);
  }
  // #endregion Eventos de conexión administrada entre componentes

  public render() : JSX.Element {
    return (
      <div className="App">
        <ConfirmationPanel
          ref = { element => { this.panelScanState = element } }
          handleSetPanelScanState = { this.handleSetPanelScanState }
          handleAddImage = { this.handleAddImage}
        />
        <Menu tittle='IoIp'
          handleAddImage={this.handleAddImage}
          handleDownload={this.handleDownload}
          handleUpload={this.handleUpload}
          handleUploadFileFromDisk={this.handleUploadFileFromDisk}
          handleEditImage={this.handleEditImage}
          handleRotateLeft={this.handleRotateLeft}
          handleRotateRight={this.handleRotateRight}
          handleRotate180={this.handleRotate180}
          handleVerticalMirror={this.handleVerticalMirror}
          handleHorizontalMirror={this.handleHorizontalMirror}
          handleRemoveCurrentImage={this.handleRemoveCurrentImage}
          handleRemoveAllImages={this.handleRemoveAllImages}
          handleCropImage={this.handleCropImage}
          handleResizeImage={this.handleResizeImage}
          handleSaveBpm={this.handleSaveBpm}
          handleSaveJpeg={this.handleSaveJpeg}
          handleSavePng={this.handleSavePng}
          handleSaveTiff={this.handleSaveTiff}
          handleSavePdf={this.handleSavePdf}
          handleSetPanelScanState={this.handleSetPanelScanState}
        />

        <div className="MainContainer">
          <div className="ContainerBorderedRight">
            <PagePreview
              ref={element => { this.pagePreviewReference = element }}
              handleAddImageToPreview = { this.handleAddImageToPreview }
            />
          </div>
          <div className="ContainerBorderedRight">
            <DWT
              handleAddImage = {this.handleAddImage}
              ref={element => { this.dwtReference = element }}
              handleAddImageToPreview = { this.handleAddImageToPreview }
            />
          </div>
          <div className="">
            <TransactionLog
              ref={element => { this.transactionLogReference = element }}
            />
          </div>
        </div>
      </div>)
  }
}
export default App;
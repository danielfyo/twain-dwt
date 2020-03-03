import React, { Component } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { DefaultButton, PrimaryButton, ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { DigitalizationRequest } from '../../model/DigitalizationRequest';
import { DwtSource } from '../../model/DwtSource';
export class ConfirmationPanel extends Component<any, any> {

    setPanelScanState(panelScan: any) {
        this.setState(panelScan);
    }

    addImage(scanRequest: DigitalizationRequest) {
        this.props.handleAddImage(scanRequest);
        this.hidePanel();
    }

    updateSourceServiceList(dwtSource: DwtSource) {
        let cmbSourceOptions = this.state.cmbSourceOptions;
        const newCmbOption: IComboBoxOption = {
            key: dwtSource.DwtSourceId,
            text: dwtSource.SourceName
        };
        if (this.state.cmbSourceOptions.length < 1) {
            newCmbOption.selected = true;
        }

        cmbSourceOptions.push(newCmbOption);
        this.setState({
            cmbSourceOptions: cmbSourceOptions
        });
    }

    hidePanel() {
        this.setState(
            {
                isOpen: false,
            });
    }

    constructor(props: any) {
        super(props);
        this.state = {
            cmbSourceOptions: [],
            isOpen: false,
            panelTitle: 'Adquirir imagen desde escaner',
            sourceIndex: 0,
            advanceScanOptions: true,
            cmbResolution: '50',
            gcColor: 'RGB',
            adf: true,
            duplex: true
        }
    }

    getPixelType(): number{
        switch(this.state.gcColor)
        {
            case 'RGB':
                return 0;
            case 'BW':
                return 1;
            case 'Gray':
                return 2;
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <Panel
                    type ={PanelType.medium}
                    isOpen={this.state.isOpen}
                    hasCloseButton={true}
                    closeButtonAriaLabel="Cerrar"
                    headerText={this.state.panelTitle}
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
                                    onClick={() => {
                                        let scanRequest = new DigitalizationRequest();
                                        scanRequest.sourceIndex = this.state.sourceIndex;
                                        scanRequest.adf = this.state.adf;
                                        scanRequest.pixelType = this.getPixelType();
                                        scanRequest.resolution = this.state.resolution;
                                        scanRequest.showUi = this.state.advanceScanOptions;
                                        scanRequest.duplex = this.state.duplex;
                                        this.addImage(scanRequest);
                                    }}>
                                    Digitalizar
                                </PrimaryButton>
                            </div>
                        </div>
                    }
                >
                    <ComboBox
                        useComboBoxAsMenuWidth={true}
                        required={true}
                        defaultSelectedKey='0'
                        label='Fuente de digitalización'
                        id='source'
                        ariaLabel='Fuente de digitalización'
                        allowFreeform={false}
                        autoComplete='on'
                        options={this.state.cmbSourceOptions}
                        onChanged={(index) => {
                            this.setState({
                                sourceIndex: index.key
                            });
                        }}
                    />
                    <Checkbox
                        label='Opciones avanzadas del scanner'
                        defaultChecked={true}
                        onChange={(state) => {
                            this.setState({
                                advanceScanOptions: state
                            });
                        }}
                    />

                    <ComboBox
                        useComboBoxAsMenuWidth={true}
                        required={true}
                        defaultSelectedKey='50'
                        label='Resolución'
                        id='Resolution'
                        ariaLabel='Pixeles por pulgada cuadrada'
                        allowFreeform={false}
                        autoComplete='on'
                        options={[
                            { key: '500', text: '500' },
                            { key: '400', text: '400' },
                            { key: '300', text: '300' },
                            { key: '200', text: '200' },
                            { key: '100', text: '100' },
                            { key: '50', text: '50' },
                        ]}
                        onChanged={(index) => {
                            this.setState({
                                cmbResolution: index.key
                            });
                        }}
                    />

                    <ChoiceGroup
                        defaultSelectedKey='RGB'
                        options={[
                            {
                                key: 'RGB',
                                text: 'Full Color',
                                'data-automation-id': 'auto1',
                                checked: true
                            } as IChoiceGroupOption,
                            {
                                key: 'Gray',
                                text: 'Escala de grises'
                            } as IChoiceGroupOption,
                            {
                                key: 'BW',
                                text: 'Blanco y negro'
                            } as IChoiceGroupOption
                        ]}
                        label='Color'
                        required={true}
                        onChanged={(index) => {
                            console.log(index);
                            this.setState({
                                gcColor: index.key
                            });
                        }}
                    />

                    <Toggle
                        defaultChecked={true}
                        label='Origen del papel'
                        offText='Vidrio (Manual)'
                        onText='Alimentador automático (ADF)'
                        onChanged={(index) => {
                            console.log(index);
                            this.setState({
                                adf: index
                            });
                        }}
                    />

                    <Toggle
                        defaultChecked={true}
                        label='Forma de escaneo'
                        offText='Una cara'
                        onText='Doble cara'
                        onChanged={(index) => {
                            console.log(index);
                            this.setState({
                                duplex: index
                            });
                        }}
                    />

                    <div id="tblLoadImage" style={{ visibility: "hidden" }}>
                        <a href="return false" className="ClosetblLoadImage"><img src="Images/icon-ClosetblLoadImage.png" alt="Close tblLoadImage" /></a>
                        <p>Por favor instale un dispositivo compatible con TWAIN:</p>
                        <p>
                            <a target="_blank" rel="noopener noreferrer" href="http://www.twain.org">Referencia TWG </a>
                        </p>
                    </div>
                </Panel>
            </div >
        );
    };
}
export default ConfirmationPanel;
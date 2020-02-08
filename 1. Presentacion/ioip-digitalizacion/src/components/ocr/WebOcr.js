import './WebOcr.css';
import React from 'react';
import logo from '../../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Spinner, Card } from 'react-bootstrap';
import Dynamsoft from 'dwt';

class WebOcr extends React.Component {
	constructor(props) {
		super(props);
		this.reader = null;
		this.refDivMessage = React.createRef();
		this.state = {
			runtimeSettingsString: "",
			runtimeSettings: [],
			showString: false,
			bInitializing: true,
			bDecoding: true,
			bShowModalDialog: false,
			bShowModalDialogBarcode: false,
			imgData: null,
			messageKeyBase: 0,
			messages: [],
			detailTitles: [],
			detailContent: [],
			bShowScanner: false,
			modalTitle: "Unspecified",
			setUpState: {
				showOneDItems: false,
				showDataBarItems: false,
				showPostalCodeItems: false,
				showFurtherModesItems: false
			},
			//Mode Mode Arguments Status
			mAS: {
				atrm: [false, false, false, false, false, false, false, false],
				bcm: [false, false, false, false, false, false, false, false],
				bm: [false, false, false, false, false, false, false, false],
				cclm: [false, false, false, false, false, false, false, false],
				ccom: [false, false, false, false, false, false, false, false],
				drm: [false, false, false, false, false, false, false, false],
				ipm: [0, 0, 0, 0, 0, 0, 0, 0],
				irsm: [true, false],
				lm: [false, false, false, false, false, false, false, false],
				rpm: [false, false, false, false, false, false, false, false],
				sum: [false, false, false, false, false, false, false, false],
				tacm: false,
				tfm: [false, false, false, false, false, false, false, false],
				tdm: [false, false, false, false, false, false, false, false]
			}
		};
	}
	render() {
		return (<></>);
	}
}

export default WebOcr;
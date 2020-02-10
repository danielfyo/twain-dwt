import React, { Component } from 'react';
import './TransactionLog.css';


export class TransactionLog extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            appName: '',
            sheets: undefined
        }

        this.setState({
            appName: this.props.tittle,
        }
        );
    }

    render() {

        return (<>
            <div id="DWTcontainerBtm" style={{ textAlign: "left" }} className="clearfix">
                <div id="DWTemessageContainer"></div>
                <div id="divNoteMessage"> </div>
            </div>
        </>)
    }
}


export default TransactionLog;
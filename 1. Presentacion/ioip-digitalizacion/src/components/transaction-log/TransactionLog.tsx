import React, { Component } from 'react';
import './TransactionLog.css';

export class TransactionLog extends Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            sheets: undefined,
            appName: this.props.tittle,
            strTransactionLog: ''
        }

        this.appendMessage.bind(this.appendMessage);
    }

    appendMessage(strMessage: string) {
        const newLogValue = this.state.strTransactionLog + strMessage;
        this.setState({
            strTransactionLog: newLogValue
        }, () => {
            console.log(this.state.strTransactionLog);
            let _divMessageContainer = document.getElementById("DWTemessage");
            
            if (_divMessageContainer) {
                _divMessageContainer.innerHTML = this.state.strTransactionLog;
                _divMessageContainer.scrollTop = _divMessageContainer.scrollHeight;
            }
        });
    }

    public render(): JSX.Element {
        return (
            <div id="DWTcontainerBtm" style={{ textAlign: "left" }} className="clearfix">
                <div id="DWTemessageContainer"></div>
                <div id="divNoteMessage"> </div>
            </div>)
    }
}


export default TransactionLog;
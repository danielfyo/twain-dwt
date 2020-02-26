import React, { Component } from 'react';
import './TransactionLog.css';

export class TransactionLog extends Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            appName: '',
            sheets: undefined,
            strTransactionLog: ''
        }

        this.setState({
            appName: this.props.tittle,
            strTransactionLog: ''
        });

        this.appendMessage.bind(this.appendMessage);
    }

    appendMessage(strMessage: string) {
        const newLogValue = this.state.strTransactionLog + strMessage;
        this.setState({
            strTransactionLog: newLogValue
        }, () => {
            console.log(this.state.strTransactionLog);
            var _divMessageContainer = document.getElementById("DWTemessage");
            
            if (_divMessageContainer) {
                _divMessageContainer.innerHTML = this.state.strTransactionLog;
                _divMessageContainer.scrollTop = _divMessageContainer.scrollHeight;
            }
        });
    }

    render() {
        return (
            <div id="DWTcontainerBtm" style={{ textAlign: "left" }} className="clearfix">
                <div id="DWTemessageContainer"></div>
                <div id="divNoteMessage"> </div>
            </div>)
    }
}


export default TransactionLog;
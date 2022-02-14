import React, { Component } from 'react';
import "../componentStyle/targetSetting.css"

class TargetSetting extends Component {
    constructor(props){
        super(props)

        this.onClickPopUp = this.onClickPopUp.bind(this)
        this.onClickClosePopUp = this.onClickClosePopUp.bind(this)

        this.state = {
            target: "Jual kopi banyak"
        }
    }

    onClickPopUp(p) {
        document.getElementById("popup").style.display = 'block'
    }

    onClickClosePopUp(p) {
        document.getElementById("popup").style.display = 'none'
    }

    render() { 
        return ( 
            <div className="container">
                <div id="popup" onClick={this.onClickClosePopUp}>
                    <div className="header">Hello</div>
                    <div className="main">This is main</div>
                    <button>Some button</button>
                </div>
    
                <h1 onClick={this.onClickPopUp}>{this.state.target}</h1>
                <h1>{this.props.location.state.username}</h1>
            </div>
         );
    }
}
 
export default TargetSetting;
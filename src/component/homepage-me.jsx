import React, { Component } from 'react';
import SignUpPic from "../others/signUpPic1.jpg"
import "../componentStyle/homepage-me.css"

class Homepage extends Component {
    constructor(props){
        super(props)
        console.log(this.props.location.state)
        this.onClickPopUp = this.onClickPopUp.bind(this)
        this.onClickClosePopUp = this.onClickClosePopUp.bind(this)
        this.removeColumnBootstrap = this.removeColumnBootstrap.bind(this)
    }

    onClickPopUp(p) {
        document.getElementById("popup-info").style.display = 'block'
    }

    onClickClosePopUp(p) {
        document.getElementById("popup-info").style.display = 'none'
    }

    removeColumnBootstrap(x) {
        var col4 = document.getElementById("b-col-4");
        var col1 = document.getElementById("b-col-1");
        var col7 = document.getElementById("b-col-7");

        if (x.matches){
            try {
                col4.classList.remove("col-4");
                col1.classList.remove("col-1");
                col7.classList.remove("col-7");
                document.getElementById('homepage-main-container').style.flexDirection = "column-reverse"
            } catch(e){
                console.log(e)
            }
            
        } else {
            try {
                col4.classList.add("col-4");
                col1.classList.add("col-1");
                col7.classList.add("col-7");
                document.getElementById('homepage-main-container').style.flexDirection = "row"
            } catch(e){
                console.log(e)
            }
        }
    }

    render() { 
        var smallWindow = window.matchMedia("(max-width: 600px)")
        this.removeColumnBootstrap(smallWindow)
        smallWindow.addListener(this.removeColumnBootstrap)
        return ( 
            <div className="homepage-all-container">
                {/* {Object.entries(this.props.location.state).map(([key, value]) => {
                    return <h1>{key} : {value}</h1>
                })} */}

                <div id="popup-info" onClick={this.onClickClosePopUp}>
                    <img src={SignUpPic} alt="" />
                </div>

                <div className="homepage-navbar">
                    <div className="homepage-logo">M</div>
                    <i className="homepage-notification far fa-bell"></i>
                    <div className="homepage-profile-icon">
                        <p>
                            S
                        </p>
                    </div>
                </div>

                <div className="container homepage-container">
                    <div className="row" id="homepage-main-container">
                        <div className="homepage-left-container col-4" id="b-col-4">
                            <div className="homepage-visi-misi"><em>Visi & Misi</em></div>
                            <p>Sebuah Visi dan sketsa besar kedepan dapat memotivasi dirimu dan tim dalam keadaan sulit pun karena memberikan arahan yang jelas dari apa yang ingin dicapai</p>
                        </div>

                        <div className="homepage-gap col-1" id="b-col-1"></div>

                        <div className="homepage-right-container col-7" id="b-col-7">
                            <div className="homepage-right-title">
                                <div className="homepage-target-setting"><em>Target setting</em></div>
                                <div className="help-button" onClick={this.onClickPopUp}><p>i</p></div>
                                
                            </div>
                            <div className="target-setting-input-container">
                                <button type="submit" form="target-form"><em>+</em></button>
                                
                                <form id="target-form" onSubmit={this.props.onSubmitTarget} onChange={this.onChangeTarget}>
                                    <input type="text" className="target-setting-input" placeholder="Tetapkan target untuk bisnismu"/>
                                    <input type="submit" tabIndex="-1" className="hide-button"  />
                                </form>
                            </div>

                            <div className="target-setting-list-container">
                                
                            </div>
                        </div>
                        

                    </div>
                </div>

                <footer className="text-center homepage-footer">
                    Goal setting yang bagus adalah goal yang bisa diukur, punya hasil jelas dan mudah dipahami siapapun. - Nadiem Makarim
                </footer>


            </div>
         );
    }
}
 
export default Homepage;
import React, { Component } from 'react';
import "../componentStyle/signUp.css"
import { withRouter } from "react-router-dom";
import SignUpPic from "../others/signUpPic1.jpg"
import axios from 'axios';

const port = process.env.PORT || 5000;

class SignUp extends Component {
    constructor(props){
        super(props)
        this.handleInputRoleDetail = this.handleInputRoleDetail.bind(this)
        this.onChangeNama = this.onChangeNama.bind(this)
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeTanggalLahir = this.onChangeTanggalLahir.bind(this)
        this.onChangePhone = this.onChangePhone.bind(this)
        this.onChangeGender = this.onChangeGender.bind(this)
        this.onClickOwner = this.onClickOwner.bind(this)
        this.onClickTeamMember = this.onClickTeamMember.bind(this)

        this.calcHeight = this.calcHeight.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        
        this.onSubmitSignUpForm = this.onSubmitSignUpForm.bind(this);

        this.state = { 
            namaLengkap: "",
            username: "",
            password: "",
            tanggalLahir: "",
            gender: "",
            phone: "",
            position: "",
            isOwner: false,
            companyName: "",
            vision: "",
            mission: "",
            why: "",
            dream: "",
            lifePriority: "",
            hobby: "",
            users: []
         }
    }

    handleInputRoleDetail(e){
        const input = e.target;
        const {name}= input;
        this.setState({[name]:input.value});
        console.log(this.state)
    }

    componentDidMount() {
        axios.get('https://backend-mimpi.herokuapp.com/users/')
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({
                        users: res.data.map(user => user.username)
                    })

                    console.log(this.state)
                }
            });
    }

    onChangeNama(p) {
        this.setState({
            namaLengkap: p.target.value,
        });

    }

    onChangeUsername(p) {
        const curr = p.target.value;
        if (this.state.users.find((username) => username === curr)){
            document.getElementById('username-input').style.borderColor = 'red';
            document.getElementById('username-taken-message').style.display = 'block';
            document.getElementById('sign-up-btn').disabled = true;
        } else {
            document.getElementById('username-taken-message').style.display = 'none';
            document.getElementById('username-input').style.borderColor = '#495057';
            document.getElementById('sign-up-btn').disabled = false;
        }

        this.setState({
            username: curr,
        });

    }

    onChangePassword(p) {
        this.setState({
            password: p.target.value,
        });
    }

    onChangeTanggalLahir(p) {
        this.setState({
            tanggalLahir: p.target.value,
        });
    }

    onChangePhone(p) {
        this.setState({
            phone: p.target.value,
        });
        
    }

    onChangeGender(p) {
        this.setState({
            gender: p.target.value,
        })
    }

    onClickOwner() {
        document.getElementById("sign-up-right-default").style.display = "none";
        document.getElementById("sign-up-right-not-default").style.display = "flex";
        document.getElementById("sign-up-right-not-default-text").innerHTML = "Visi dan Misi"
        document.getElementById("sign-up-visi-misi").style.display = "flex";
        document.getElementById("sign-up-about-you").style.display = "none";

        document.getElementById("owner").style.backgroundColor = "#2bad2b";
        document.getElementById("owner").style.color = "white";
        document.getElementById("owner").style.border = "1px solid black";
        document.getElementById("team-member").style.backgroundColor = "white";
        document.getElementById("team-member").style.color = "black";
        document.getElementById("team-member").style.border = "1px solid black";
        document.getElementById("team-member").style.borderLeft = "none";

        document.getElementById("sign-up-o1").required = true
        document.getElementById("sign-up-o2").required = true
        document.getElementById("sign-up-o3").required = true

        document.getElementById("sign-up-ta1").required = false
        document.getElementById("sign-up-ta2").required = false
        document.getElementById("sign-up-ta3").required = false
        document.getElementById("sign-up-ta4").required = false

        this.setState({
            position: "owner",
        })
    }

    onClickTeamMember() {
        document.getElementById("sign-up-right-default").style.display = "none";
        document.getElementById("sign-up-right-not-default").style.display = "flex";
        document.getElementById("sign-up-right-not-default-text").innerHTML = "About You";
        document.getElementById("sign-up-visi-misi").style.display = "none";
        document.getElementById("sign-up-about-you").style.display = "flex";

        document.getElementById("owner").style.backgroundColor = "white";
        document.getElementById("owner").style.color = "black";
        document.getElementById("team-member").style.backgroundColor = "#2bad2b";
        document.getElementById("team-member").style.color = "white";
        document.getElementById("owner").style.border = "1px solid black";
        document.getElementById("team-member").style.border = "1px solid black";
        document.getElementById("team-member").style.borderLeft = "none";

        document.getElementById("sign-up-o1").required = false
        document.getElementById("sign-up-o2").required = false
        document.getElementById("sign-up-o3").required = false

        document.getElementById("sign-up-ta1").required = true
        document.getElementById("sign-up-ta2").required = true
        document.getElementById("sign-up-ta3").required = true
        document.getElementById("sign-up-ta4").required = true

        this.setState({
            position: "team member",
        })
    }

    /* Thx to Chris Coyler at https://css-tricks.com/auto-growing-inputs-textareas/ */
    calcHeight(value) {
        let numberOfLineBreaks = (value.match(/\n/g) || []).length;
        // min-height + lines x line-height + padding + border
        let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
        return newHeight;
    }

    handleKeyUp(p) {
        p.target.style.height = this.calcHeight(p.target.value) + "px";
    }

    onSubmitSignUpForm(p) {
        p.preventDefault();
        // var getGender = document.querySelector('input[name="sign-up-gender"]:checked').value;
        if (this.state.position !== "owner" && this.state.position !== "team member") {
            alert("Tolong pilih peranmu dalam tim!")
            return
        }

        async function submitHelper(state, history){
            const newUser = {
                namaLengkap: state.namaLengkap,
                phone: state.phone,
                tanggalLahir: Date.parse(state.tanggalLahir),
                gender: state.gender,
                username: state.username,
                password: state.password,
                isOwner: state.position==="owner"?true:false,
                owner: state.owner,
                roleDetail: state.roleDetail,
                companyName: state.companyName,
                vision: state.vision,
                mission: state.mission,
                why: state.why,
                dream: state.dream,
                lifePriority: state.lifePriority,
                hobby: state.hobby,
            }

            let res = axios.post('https://backend-mimpi.herokuapp.com/users/add', newUser)
                .then(res => res.data)
                .catch(err => console.log('Error: ' + err))
            
            let r = await res

            let r2 =await axios.get('https://backend-mimpi.herokuapp.com/users/' + r.username + '/' + r.password)
                .then(res => res.data)
                .catch(err => console.log('Error: ' + err))
            
            console.log(r2)
            if (r2 === undefined) {
                alert("Something went wrong, please try again later")
                return
            }

            history.push({
                pathname: "/homepage",
                state: r2,
            })
        }

        submitHelper(this.state, this.props.history)
    }
    
    
    render() { 

        // var smallWindow = window.matchMedia("(max-width: 600px)")
          
        return ( 
            <div className="sign-up-container">
                <div className="sign-up-top">
                    <div className="sign-up-icon">M</div>
                    <div className="sign-up-title">
                        <div className="sign-up-title1">Buatlah akun Mimpimu</div>
                        <div className="sign-up-title2">dan raih mimpimu!</div>
                    </div>
                </div>

                <form onSubmit={this.onSubmitSignUpForm} id="sign-up-form">
                    <div className="sign-up-main">
                        <div className="left-container">
                            <div className="sign-up-title3">Personal Info</div>
                            <div className="sign-up-input-wrapper">
                                <label className="sign-up-label">Nama Lengkap </label>
                                <input
                                    type="text"
                                    required
                                    className="sign-up-input line-only-input"
                                    value={this.state.namaLengkap}
                                    onChange={this.onChangeNama}
                                />
                            </div>

                            <div className="sign-up-input-wrapper">
                                <div className="phone-code">+62</div>
                                <label className="sign-up-label">No telp</label>
                                <input
                                    type="text"
                                    required
                                    className="sign-up-input line-only-input"
                                    id="phone-input"
                                    value={this.state.phone}
                                    onChange={this.onChangePhone}
                                    pattern="\+?([ -]?\d+)+|\(\d+\)([ -]\d+)"
                                    title="Phone number should only contain numbers"
                                />
                            </div>
                            

                            <div className="sign-up-input-wrapper">
                                <label className="sign-up-label">Tanggal Lahir</label>
                                
                                <input
                                    type="date"
                                    required
                                    className="sign-up-input sign-up-tanggal"
                                    value={this.state.tanggalLahir}
                                    onChange={this.onChangeTanggalLahir}
                                />
                            </div>

                            <div className="sign-up-input-wrapper">
                                <label className="sign-up-label">Jenis Kelamin</label>
                                <div className="sign-up-gender">
                                    <input type="radio" className="sign-up-gender-component" id="gender-pria" name="sign-up-gender" value="pria" onChange={this.onChangeGender} required/>
                                    <label htmlFor="gender-pria" className="gender-label gender-pria">Pria</label>
                                    <input type="radio" className="sign-up-gender-component" id="gender-wanita" name="sign-up-gender" value="wanita" onChange={this.onChangeGender} />
                                    <label htmlFor="gender-wanita" className="gender-label gender-wanita">Wanita</label>
                                </div>
                            </div>
                            <div className="sign-up-title3">Account</div>
                            <div className="sign-up-input-wrapper">
                                <label className="sign-up-label">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="sign-up-input"
                                    id="username-input"
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                />
                                <div id="username-taken-message">Username taken</div>
                            </div>

                            <div className="sign-up-input-wrapper">
                                <label className="sign-up-label sign-up-confirm">Password</label>
                                <input
                                    type="text"
                                    required
                                    className="sign-up-input"
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                />
                            </div>

                        </div>

                        <div className="right-container">
                            <div className="switch-button">
                                <p>Pilih peranmu dalam tim:</p>
                                <button id="owner" type="button" autofocus onClick={this.onClickOwner}>Owner</button>
                                <button id="team-member" type="button" onClick={this.onClickTeamMember}>Team Member</button>
                            </div>
                            <div id="sign-up-right-default">
                                <img id="sign-up-img" src={SignUpPic} alt="People working as a team"/>
                                <div id="sign-up-quotes" className="steve-jobs-quote">"Great things in business are never done by <em>one</em> person, they are done by a <em>team</em> of people" <br/><br/> Steve Jobs</div>                               
                            </div>
                            
                            <div id="sign-up-right-not-default">
                                <br />
                                <div className="sign-up-title3" id="sign-up-right-not-default-text"></div>
                                {/* Thx to Chris Coyler at https://css-tricks.com/auto-growing-inputs-textareas/ */}
                                <div id="sign-up-visi-misi">
                                    <textarea id="sign-up-o1" className="textarea resize-ta" onChange={this.handleInputRoleDetail} onKeyUp={this.handleKeyUp} placeholder="Nama bisnis" name="companyName"></textarea>
                                    <textarea id="sign-up-o2" className="textarea resize-ta" onChange={this.handleInputRoleDetail} onKeyUp={this.handleKeyUp} placeholder="Apa visimu untuk bisnis ini?" name="vision"></textarea>
                                    <textarea id="sign-up-o3" className="textarea resize-ta" onChange={this.handleInputRoleDetail} onKeyUp={this.handleKeyUp} placeholder="Misi apa yang dapat mendukung visi tersebut?" name="mission"></textarea>
                                </div>

                                <div id="sign-up-about-you">
                                    <p id="sign-up-about-you-text">*Ini dibuat agar Owner dapat mengenalmu lebih</p>
                                    <p><b>Why</b></p>
                                    <textarea id="sign-up-ta1" className="textarea resize-ta" onChange={this.handleInputRoleDetail} onKeyUp={this.handleKeyUp} placeholder="Kenapa kamu memilih kerja disini" name="why"></textarea>
                                    <p><b>Dream</b></p>
                                    <textarea id="sign-up-ta2" className="textarea resize-ta" onChange={this.handleInputRoleDetail} onKeyUp={this.handleKeyUp} placeholder="Apa cita-cita / harapanmu kedepan? Kamu ingin menjadi apa?" name="dream"></textarea>
                                    <p><b>Life Priority</b></p>
                                    <textarea id="sign-up-ta3" className="textarea resize-ta" onChange={this.handleInputRoleDetail} onKeyUp={this.handleKeyUp} placeholder="Apa yang kamu prioritaskan dalam hidup?" name="lifePriority"></textarea>
                                    <p><b>Interest and Hobby</b></p>
                                    <textarea id="sign-up-ta4" className="textarea resize-ta" onChange={this.handleInputRoleDetail} onKeyUp={this.handleKeyUp} placeholder="Apa yang membuatmu tertarik? Makanan Favorit? Idola? Apa hobimu?" name="hobby"></textarea>
                                </div>
                            </div>

                        </div>

                    </div> 
                </form>

                <div className="sign-up-div-btn">
                    <button type="submit" form="sign-up-form" id="sign-up-btn">Daftar</button> 
                </div>

            </div>

        );
    }
}
 
export default withRouter(SignUp);

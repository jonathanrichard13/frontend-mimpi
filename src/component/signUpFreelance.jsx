import React, { Component } from 'react';
import "../componentStyle/signUp.css"
import "../componentStyle/signUpFreelance.css"
import { withRouter } from "react-router-dom";
import axios from 'axios';

class SignUpFreelance extends Component {
    constructor(props){
        super(props)
        this.onChangeNama = this.onChangeNama.bind(this)
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeTanggalLahir = this.onChangeTanggalLahir.bind(this)
        this.onChangePhone = this.onChangePhone.bind(this)
        this.onChangeGender = this.onChangeGender.bind(this)
        
        this.onSubmitSignUpForm = this.onSubmitSignUpForm.bind(this);

        this.state = { 
            namaLengkap: "",
            username: "",
            password: "",
            tanggalLahir: "",
            gender: "",
            phone: "",
            users: []
         }
    }

    onChangeNama(p) {
        this.setState({
            namaLengkap: p.target.value,
            username: this.state.username,
            password: this.state.password,
            tanggalLahir: this.state.tanggalLahir,
            phone: this.state.phone,
            users: this.state.users,
            gender: this.state.gender
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
            namaLengkap: this.state.namaLengkap,
            username: curr,
            password: this.state.password,
            tanggalLahir: this.state.tanggalLahir,
            phone: this.state.phone,
            users: this.state.users,
            gender: this.state.gender
        });

    }

    onChangePassword(p) {
        this.setState({
            namaLengkap: this.state.namaLengkap,
            username: this.state.username,
            password: p.target.value,
            tanggalLahir: this.state.tanggalLahir,
            phone: this.state.phone,
            users: this.state.users,
            gender: this.state.gender
        });
    }

    onChangeTanggalLahir(p) {
        this.setState({
            namaLengkap: this.state.namaLengkap,
            username: this.state.username,
            password: this.state.password,
            tanggalLahir: p.target.value,
            phone: this.state.phone,
            users: this.state.users,
            gender: this.state.gender
        });
    }

    onChangePhone(p) {
        this.setState({
            namaLengkap: this.state.namaLengkap,
            username: this.state.username,
            password: this.state.password,
            tanggalLahir: this.state.tanggalLahir,
            phone: p.target.value,
            users: this.state.users,
            gender: this.state.gender
        });
        
    }

    onChangeGender(p) {
        this.setState({
            namaLengkap: this.state.namaLengkap,
            username: this.state.username,
            password: this.state.password,
            tanggalLahir: this.state.tanggalLahir,
            phone: this.state.phone,
            users: this.state.users,
            gender: p.target.value
        })
    }

    onSubmitSignUpForm(p) {
        p.preventDefault();
        // var getGender = document.querySelector('input[name="sign-up-gender"]:checked').value;

        const newUser = {
            namaLengkap: this.state.namaLengkap,
            phone: this.state.phone,
            tanggalLahir: Date.parse(this.state.tanggalLahir),
            gender: this.state.gender,
            username: this.state.username,
            password: this.state.password,
        }

        axios.post('http://localhost:5000/users/add', newUser)
            .then(res => console.log(res.data))
            .catch(err => console.log('Error: ' + err));

        // this.props.history.push({
        //     pathname: "/testing",
        //     state: this.state,
        //     gender: getGender
        // })
    }
    
    
    render() { 
        return ( 
            <div className="sign-up-container">
                <div className="sign-up-top sign-up-freelance-top">
                    <div className="sign-up-icon">M</div>
                    <div className="sign-up-title">
                        <div className="sign-up-title1">Selamat datang</div>
                        <div className="sign-up-title2">Freelancer baru kami!</div>
                    </div>
                </div>

                <div className="sign-up-freelancer-main">
                    <form onSubmit={this.onSubmitSignUpForm}>
                        <div className="sign-up-freelancer-input-wrapper">
                            <div className="subjudul-description">
                                <div className="subjudul-text">Skill</div>
                                <p className="text-description"><em>*</em>Pilih keterampilan yang kamu tawarkan</p>
                            </div>
                            <div className="skill-wrapper keterampilan-wrapper">
                                <label htmlFor="keterampilan-input" className="keterampilan-label">Keterampilan</label>
                                <select name="keterampilan-input" id="keterampilan-input" required>
                                    <option value="" disabled selected hidden className="select-placeholder">Keterampilan</option>
                                    <option value="Logo Designer">Logo Designer</option>
                                    <option value="Management Operasional">Management operasional</option>
                                    <option value="Akuntansi">Akuntansi</option>
                                    <option value="Content Strategy">Content Strategy</option>
                                    <option value="Visual Design">Visual Design</option>
                                    <option value="Digital Marketing">Digital Marketing</option>
                                    <option value="Copywriting">Copywriting</option>
                                </select>
                            </div>
                            <div className="skill-wrapper level-wrapper">
                                <label htmlFor="level-input" className="level-label">Level</label>
                                <select name="level-input" id="level-input" required>
                                    <option value="" disabled selected hidden className="select-placeholder">Level</option>
                                    <option value="Pemula">Pemula</option>
                                    <option value="Menengah">Menengah</option>
                                    <option value="Spesialis">Spesialis</option>
                                </select>
                            </div>
                        </div>

                        <div className="sign-up-freelancer-input-wrapper">
                            <div className="subjudul-description">
                                <div className="subjudul-text">Headline</div>
                                <p className="text-description"><em>*</em>Tulis judul yang menarik untuk client</p>
                            </div>
                            <div className="freelance-textarea headline-textarea">
                                <textarea name="headline-textarea" id="headline-textarea" cols="50" rows="2" maxLength="80" placeholder="Saya jago melakukan sesuatu dengan ketelitian"></textarea>
                                <div className="keterangan-headline">max 80</div>
                            </div>
                        </div> 

                        <div className="sign-up-freelancer-input-wrapper">
                            <div className="subjudul-description">
                                <div className="subjudul-text">Deskripsi</div>
                                <p className="text-description"><em>*</em>Jelaskan secara detail tentang dirimu dan kenapa client harus memilih dirimu</p>
                            </div>
                            <div className="freelance-textarea deskripsi-textarea">
                                <textarea name="deskripsi-textarea" id="deskripsi-textarea" cols="50" rows="4"></textarea>
                            </div>
                        </div>

                        <div className="sign-up-freelancer-input-wrapper">
                            <div className="subjudul-description paket-description">
                                <div className="subjudul-text">Harga Paket</div>
                                <p className="text-description"><em>*</em>Berikan informasi terkait harga yang kamu tawarkan untuk jasamu</p>
                            </div>
                            <div className="paket-table">
                                <div className="paket-table-col paket-c1">
                                    <div className="tipe-paket-text"><p>Standard</p></div>
                                    <input type="text" className="nama-paket" placeholder="Tulis nama paket" />
                                    <input type="text" className="deskripsi-paket" placeholder="Deskripsi paket" />
                                    <input type="text" className="jumlah-revisi" placeholder="Jumlah revisi"/>
                                    <div className="harga-paket">
                                        <span>Rp</span>
                                        <input className="harga-input" type="number" />
                                    </div>
                                </div>

                                <div className="paket-table-col paket-c2">
                                    <div className="tipe-paket-text"><p>Premium</p></div>
                                    <input type="text" className="nama-paket" placeholder="Tulis nama paket" />
                                    <input type="text" className="deskripsi-paket" placeholder="Deskripsi paket" />
                                    <input type="text" className="jumlah-revisi" placeholder="Jumlah revisi"/>
                                    <div className="harga-paket">
                                        <span>Rp</span>
                                        <input className="harga-input" type="number" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sign-up-freelance-input-wrapper sign-up-freelance-div-btn">
                        <input
                            type="submit"
                            value="Daftar"
                            id="sign-up-freelance-btn"
                        />
                        </div>
                    </form>
                </div> 

            </div>

        );
    }
}
 
export default withRouter(SignUpFreelance);

import React, { Component } from 'react';
import SignUpPic from "../others/signUpPic1.jpg"
import "../componentStyle/homepage.css"
import AddSvg from "../assets/image/icon/add.svg"
import axios from 'axios';
import Logo from "../assets/image/logo.png"
import Person from "../assets/image/atribut/2.png"
import Goal from "../assets/image/atribut/8.png"


const port = process.env.PORT || 5000;

class Homepage extends Component {
    constructor(props){
        super(props)
        console.log(this.props.location)
        // this.onClickPopUp = this.onClickPopUp.bind(this)
        // this.onClickClosePopUp = this.onClickClosePopUp.bind(this)
        // this.removeColumnBootstrap = this.removeColumnBootstrap.bind(this)
        this.onChangeQueryTeamMember = this.onChangeQueryTeamMember.bind(this)
        this.onClickButtonAddTeamMember = this.onClickButtonAddTeamMember.bind(this)

        // this.barProgTargetClassname = this.barProgTargetClassname.bind(this)

        this.createNewTarget = this.createNewTarget.bind(this)
        this.createNewGoal = this.createNewGoal.bind(this)
        this.createNewMetric = this.createNewMetric.bind(this)

        this.calculateProgress = this.calculateProgress.bind(this)
        this.removeTarget = this.removeTarget.bind(this)

        this.checkboxTarget = this.checkboxTarget.bind(this)
        this.checkboxGoal = this.checkboxGoal.bind(this)
        this.checkboxMetric = this.checkboxMetric.bind(this)

        this.onChangeTargetDeadline = this.onChangeTargetDeadline.bind(this)

        this.onClickGoalMessage = this.onClickGoalMessage.bind(this)
        this.onClickGoalKontak = this.onClickGoalKontak.bind(this)
        this.onClickMetricMessage = this.onClickMetricMessage.bind(this)
        this.onClickMetricKontak = this.onClickMetricKontak.bind(this)

        this.onClickTetapkanKontak = this.onClickTetapkanKontak.bind(this)
        this.closeKontak = this.closeKontak.bind(this)
        this.onChangeRate = this.onChangeRate.bind(this)
        this.enterKomen = this.enterKomen.bind(this)
        this.closeComment = this.closeComment.bind(this)
        this.editComment = this.editComment.bind(this)

        let routeState
        if(this.props.location.state){
            localStorage.setItem('routeState', JSON.stringify(this.props.location.state))
            routeState = this.props.location.state
        } else {
            routeState = localStorage.getItem('routeState')
            if(routeState) routeState = JSON.parse(routeState)
        }

        let us = ''
        let vi = ''

        if(routeState){
            us = routeState.username
            vi = routeState.vision
        } else {
            //Prompt no data.
        }        

        this.state = {
            username: us,
            vision: vi,
            queryTeamMember: '',
            currCommentType: '',
            currCommentId: '',
            currCommentRate: 0,
            currKontakType: '',
            currKontakId: '',
            targetSetting: [],
            goal: [],
            metric: [],
            member: ["test1", "test2", "test3"]
        }

        
    }

    componentDidMount() {

        axios.get('https://backend-mimpi.herokuapp.com/target-setting/' + this.state.username)
            .then(res => {
                this.setState({
                    targetSetting: res.data
                })

                res.data.map((target) => {
                    axios.get('https://backend-mimpi.herokuapp.com/goal/targetId/' + target._id)
                        .then(res => {
                            let updatedGoal = this.state.goal
                            if (Object.keys(res.data).length){
                                updatedGoal = updatedGoal.concat(res.data)
                            }

                            this.setState({
                                goal: updatedGoal
                            })

                            res.data.map((goal) => {
                                axios.get('https://backend-mimpi.herokuapp.com/metric/goalId/' + goal._id)
                                    .then(res => {
                                        let updatedMetric = this.state.metric
                                        if (Object.keys(res.data).length){
                                            updatedMetric = updatedMetric.concat(res.data)
                                        }
                                        this.setState({
                                            metric: updatedMetric
                                        })
                                    })
                                console.log(this.state)
                            })
                        })
                })

            })
    }

    // barProgTargetClassname(isFinished) {
    //     return function(){
    //         if (isFinished) return "bar-prog sflex"
    //         else return "bar-prog sflex action"
    //     }.bind(this)
    // }

    onChangeQueryTeamMember(p){
        console.log(this.state)
        this.setState({
            queryTeamMember: p.target.value,
            username: this.state.username,
            targetSetting: this.state.targetSetting
        });
        document.getElementById('query-result').innerHTML = "";
        document.getElementById('btn-add-undang').classList.add('btn-disabled');
        axios.get('https://backend-mimpi.herokuapp.com/users/team-member/unlisted/' + p.target.value)
            .then(res => {
                if (res.data.length > 0) {
                    document.getElementById('query-result').innerHTML = p.target.value;
                    document.getElementById('btn-add-undang').classList.remove('btn-disabled');
                }
            });
    }

    onClickButtonAddTeamMember(p) {
        console.log(this.state)
        var btnAdd = document.getElementById('btn-add-undang')
        if(!btnAdd.classList.contains('btn-disabled')){

            const newRequest = {
                username : this.state.username,
                targetUsername : this.state.queryTeamMember
            }
            var found = false
            axios.get('https://backend-mimpi.herokuapp.com/requests/' + this.state.username + '/' + this.state.queryTeamMember)
                .then(res => {
                    console.log(res.data.length)
                    if (res.data.length > 0) {
                        found = true
                    }

                    // Prevent User to Send Several Requests to the same target
                    if (found){
                        document.getElementById('query-result').innerHTML = 'Request Pending'
                    } else {
                        document.getElementById('query-result').innerHTML = 'Request Sent!'
                        axios.post('https://backend-mimpi.herokuapp.com/requests/add', newRequest)
                            .then(res => {
                                console.log(res.data)
                                document.getElementById('query-result').innerHTML = 'Request has been sent!'
                            })
                            .catch(err => console.log('Error: ' + err));
                    }
                })

            
        }
    }

    createNewMetric(targetId, goalId) {
        return function(p){
            if (p.key === "Enter"){
                // p.preventDefault();

                const newMetric = {
                    targetId: targetId,
                    goalId: goalId,
                    metricName: p.target.value,
                }
        
                axios.post('https://backend-mimpi.herokuapp.com/metric/add', newMetric)
                    .then(res => {
                        console.log(res.data)
                        let updatedMetric = this.state.metric
                        updatedMetric.push(res.data)
                        this.setState({
                            metric: updatedMetric
                        })
                        // console.log(this.state)
                    })
                    .catch(err => console.log('Error: ' + err));
                
                document.getElementById("metric-input-" + goalId).value = ''
                document.getElementById("metrics-form-input-" + goalId).classList.remove("action")
            }
        }.bind(this)
    }

    createNewGoal(targetId) {
        return function(p){
            if (p.key === "Enter"){
                // p.preventDefault();

                const newGoal = {
                    targetId: targetId,
                    goalName: p.target.value,
                }
        
                axios.post('https://backend-mimpi.herokuapp.com/goal/add', newGoal)
                    .then(res => {
                        console.log(res.data)
                        let updatedGoal = this.state.goal
                        updatedGoal.push(res.data)
                        this.setState({
                            goal: updatedGoal
                        })
                        // console.log(this.state)
                    })
                    .catch(err => console.log('Error: ' + err));
                
                document.getElementById("goal-input-" + targetId).value = ''
                document.getElementById("goal-form-input-" + targetId).classList.remove("action")
            }
        }.bind(this)
    }


    createNewTarget(p){
            if (p.key === "Enter"){
                // p.preventDefault();

                const newTarget = {
                    username: this.state.username,
                    target: p.target.value,
                }
        
                axios.post('https://backend-mimpi.herokuapp.com/target-setting/add', newTarget)
                    .then(res => {
                        console.log(res.data)
                        let updatedTarget = this.state.targetSetting
                        updatedTarget.push(res.data)
                        this.setState({
                            targetSetting: updatedTarget
                        })
                        // console.log(this.state)
                    })
                    .catch(err => console.log('Error: ' + err));
                
                document.getElementById("target-input").value = ''
                // document.getElementById("goal-form-input-" + targetId).classList.remove("action")
            }
    }

    calculateProgress(targetId){
        let count = 0
        let total = 0
        this.state.goal.filter(g => g.targetId === targetId).map(g => {
            if (g.isFinished){
                count++
                total++
            } else {
                let metricsCount = 0
                let metricsTotal = 0
                this.state.metric.filter(m => m.goalId === g._id).map(m =>{
                    if (m.isFinished){
                        metricsCount++
                    }
                    metricsTotal++
                })
                if (metricsTotal !== 0){
                    count += (metricsCount)/(metricsTotal+1)
                }
                total++
            }
        })
        if (total === 0) return 0
        const num = 100*count/total
        return Math.round((num + Number.EPSILON) * 100) / 100 
    }

    removeTarget(targetId) {
        return function(p){
            axios.delete('https://backend-mimpi.herokuapp.com/target-setting/delete/' + targetId)
                .then(res => {
                    axios.delete('https://backend-mimpi.herokuapp.com/goal/deleteTarget/' + targetId)
                        .then(res => {
                            axios.delete('https://backend-mimpi.herokuapp.com/metric/deleteTarget/' + targetId)
                                .then(res => console.log("Target Deleted Successfully"))
                                .catch(err => console.log("Error: " + err))
                        })
                        .catch(err => console.log("Error: " + err))

                    let updatedTarget = this.state.targetSetting.filter( target => {
                        return target._id !== targetId;
                    });

                    this.setState({
                        targetSetting: updatedTarget
                    })
                    
                })
                .catch(err => console.log('Error: ' + err))
        }.bind(this)
    }

    checkboxTarget(targetId, isFinished) {
        return function(p){
            axios.put('https://backend-mimpi.herokuapp.com/target-setting/editFinishStatus/' + targetId, { isFinished : !isFinished })
                .then(res => {
                    axios.get('https://backend-mimpi.herokuapp.com/target-setting/' + this.state.username)
                        .then(res => this.setState({
                            targetSetting: res.data
                        }))
                        .catch(err => console.log('Error: ' + err))

                })
                .catch(err => console.log('Error: ' + err))
        }.bind(this)
    }

    checkboxGoal(goalId, isFinished) {
        return function(p){
            axios.put('https://backend-mimpi.herokuapp.com/goal/editFinishStatus/' + goalId, { isFinished : !isFinished })
                .then(res => {
                    const idx = this.state.goal.findIndex(goal => goal._id === goalId)
                    let goal = this.state.goal
                    let currGoal = this.state.goal[idx]
                    currGoal.isFinished = !currGoal.isFinished

                    console.log(currGoal)
                    goal.splice(idx, 1, currGoal)

                    this.setState({
                        goal: goal
                    })

                    if (!isFinished) {
                        this.state.metric.filter(m => m.goalId === currGoal._id).map(m => {
                            axios.put('https://backend-mimpi.herokuapp.com/metric/editFinishStatus/' + m._id, { isFinished : !isFinished })
                                .then(r => {
                                    const idx = this.state.metric.findIndex(metric => metric._id === m._id)
                                    let metric = this.state.metric
                                    let currMetric = this.state.metric[idx]
                                    currMetric.isFinished = !isFinished
                                    metric.splice(idx, 1, currMetric)

                                    this.setState({
                                        metric: metric
                                    })
                                })
                                .catch(err => console.log('Error: ' + err))
                        })
                    }
                })
                .catch(err => console.log('Error: ' + err))
        }.bind(this)
    }

    checkboxMetric(metricId, isFinished) {
        return function(p){
            const m_idx = this.state.metric.findIndex(metric => metric._id === metricId)
            let currMetric = this.state.metric[m_idx]
            const g_idx = this.state.goal.findIndex(goal => goal._id === currMetric.goalId)
            if (this.state.goal[g_idx].isFinished) return
            
            axios.put('https://backend-mimpi.herokuapp.com/metric/editFinishStatus/' + metricId, { isFinished : !isFinished })
                .then(res => {
                    const idx = this.state.metric.findIndex(metric => metric._id === metricId)
                    let metric = this.state.metric
                    let currMetric = this.state.metric[idx]
                    currMetric.isFinished = !currMetric.isFinished

                    console.log(currMetric)
                    metric.splice(idx, 1, currMetric)

                    this.setState({
                        metric: metric
                    })
                })
                .catch(err => console.log('Error: ' + err))
        }.bind(this)
    }

    onChangeTargetDeadline(targetId) {
        return function(p){
            
            axios.put('https://backend-mimpi.herokuapp.com/target-setting/editDeadline/' + targetId, { deadline : p.target.value })
                .then(res => {
                    const idx = this.state.targetSetting.findIndex(target => target._id === targetId)
                    let target = this.state.targetSetting
                    let currTarget = this.state.targetSetting[idx]
                    currTarget.deadline = p.target.value
                    console.log(currTarget)
                    target.splice(idx, 1, currTarget)

                    this.setState({
                        target: target
                    })
                })
                .catch(err => console.log('Error: ' + err))
        }.bind(this)
    }

    onClickGoalMessage(goalId) {
        return function(p){

            const idx = this.state.goal.findIndex(goal => goal._id === goalId)
            let currGoal = this.state.goal[idx]

            if (currGoal.pic){
                document.getElementsByClassName("message")[0].classList.add("action")
                document.getElementsByClassName("cmessage")[0].classList.add("action")

                this.setState({
                    currCommentId: goalId,
                    currCommentType: 'goal'
                })
            }

            if (currGoal.comment){
                this.setState({
                    currCommentRate: currGoal.rate
                })
                document.getElementsByClassName("cmessage")[0].classList.add("commented")
                document.getElementById("commented-pic").innerHTML = currGoal.pic
                document.getElementById("commented-comment").innerHTML = currGoal.comment
                document.getElementById("commented-pic-abbr").innerHTML = currGoal.pic.charAt(0)
            }

            
        }.bind(this)
    }

    onClickGoalKontak(goalId) {
        return function(p){

            const idx = this.state.goal.findIndex(goal => goal._id === goalId)
            let currGoal = this.state.goal[idx]

            console.log(currGoal)
            if (currGoal.pic){
                document.getElementById("username-" + currGoal.pic).selected = true
                document.getElementById("kontak-default").selected = false
                let deadline = currGoal.deadline.substring(0, 10)
                document.getElementById("kontak-deadline").value = deadline
            }
            
            document.getElementsByClassName("kontak")[0].classList.add("action")
            document.getElementsByClassName("ckontak")[0].classList.add("action")

            this.setState({
                currKontakId: goalId,
                currKontakType: 'goal'
            })


        }.bind(this)
    }

    onClickMetricMessage(metricId) {

        return function(p){

            const idx = this.state.metric.findIndex(metric => metric._id === metricId)
            let currMetric = this.state.metric[idx]

            if (currMetric.pic){
                document.getElementsByClassName("message")[0].classList.add("action")
                document.getElementsByClassName("cmessage")[0].classList.add("action")

                this.setState({
                    currCommentId: metricId,
                    currCommentType: 'metric'
                })
            }

            if (currMetric.comment){
                this.setState({
                    currCommentRate: currMetric.rate
                })
                document.getElementsByClassName("cmessage")[0].classList.add("commented")
                document.getElementById("commented-pic").innerHTML = currMetric.pic
                document.getElementById("commented-comment").innerHTML = currMetric.comment
                document.getElementById("commented-pic-abbr").innerHTML = currMetric.pic.charAt(0)
            }

            
        }.bind(this)
    }

    onClickMetricKontak(metricId) {
        return function(p){

            const idx = this.state.metric.findIndex(goal => goal._id === metricId)
            let currMetric = this.state.metric[idx]

            console.log(currMetric)
            if (currMetric.pic){
                document.getElementById("username-" + currMetric.pic).selected = true
                document.getElementById("kontak-default").selected = false
                let deadline = currMetric.deadline.substring(0, 10)
                document.getElementById("kontak-deadline").value = deadline
            }
            
            document.getElementsByClassName("kontak")[0].classList.add("action")
            document.getElementsByClassName("ckontak")[0].classList.add("action")

            this.setState({
                currKontakId: metricId,
                currKontakType: 'metric'
            })

        }.bind(this)
    }

    onClickTetapkanKontak(p) {
        var pic = document.getElementById("kontak-select").value
        var deadline = document.getElementById('kontak-deadline').value

        if (this.state.currKontakType === 'goal'){
            axios.put("https://backend-mimpi.herokuapp.com/goal/editKontakDeadline/" + this.state.currKontakId, { pic: pic, deadline: deadline})
                .then(res => {
                    const idx = this.state.goal.findIndex(goal => goal._id === this.state.currKontakId)
                    let goal = this.state.goal
                    let currGoal = this.state.goal[idx]
                    currGoal.pic = pic
                    currGoal.deadline = deadline

                    goal.splice(idx, 1, currGoal)

                    this.setState({
                        goal: goal
                    })
                })
                .catch(err => console.log('Error: ' + err))
        } else if (this.state.currKontakType === 'metric'){
            axios.put("https://backend-mimpi.herokuapp.com/metric/editKontakDeadline/" + this.state.currKontakId, { pic: pic, deadline: deadline})
                .then(res => {
                    const idx = this.state.metric.findIndex(metric => metric._id === this.state.currKontakId)
                    let metric = this.state.metric
                    let currMetric = this.state.metric[idx]
                    currMetric.pic = pic
                    currMetric.deadline = deadline

                    metric.splice(idx, 1, currMetric)

                    this.setState({
                        metric: metric
                    })
                })
                .catch(err => console.log('Error: ' + err))
        }

        this.closeKontak()
    }

    closeKontak(p) {
        document.getElementsByClassName('kontak')[0].classList.remove("action")
        document.getElementsByClassName('ckontak')[0].classList.remove("action")

        document.getElementById("kontak-default").selected =  true
        document.getElementById("kontak-deadline").value = ""
    }

    onChangeRate(p) {
        var star = document.querySelector('input[name="star"]:checked').value;
        var stars = document.getElementsByClassName("wstars")
        for (var i = 0; i < stars.length; i++) {
            stars[i].classList.remove("action")
        }
        var selectedStar = document.getElementsByClassName("wstars"+star)
        for (var i = 0; i < selectedStar.length; i++) {
            selectedStar[i].classList.add("action")
        }
    }

    enterKomen(p) {
        if (p.key === "Enter"){
            if (!document.querySelector('input[name="star"]:checked')) {
                alert("Tolong berikan bintang pada komentarmu")
            }
            else if (this.state.currCommentType === "goal"){
                var star = parseInt(document.querySelector('input[name="star"]:checked').value);
                axios.put('https://backend-mimpi.herokuapp.com/goal/editComment/' + this.state.currCommentId, { comment: p.target.value, rate: star })
                .then(res => {
                    const idx = this.state.goal.findIndex(goal => goal._id === this.state.currCommentId)
                    let goal = this.state.goal
                    let currGoal = this.state.goal[idx]
                    currGoal.comment = p.target.value
                    currGoal.rate = star

                    goal.splice(idx, 1, currGoal)

                    this.setState({
                        currCommentRate: currGoal.rate,
                        goal: goal
                    })

                    document.getElementsByClassName("cmessage")[0].classList.add("commented")
                    document.getElementById("commented-pic").innerHTML = currGoal.pic
                    document.getElementById("commented-comment").innerHTML = currGoal.comment
                    document.getElementById("commented-pic-abbr").innerHTML = currGoal.pic.charAt(0)
                })
                .catch(err => console.log('Error: ' + err));
            } else if (this.state.currCommentType === "metric"){
                var star = parseInt(document.querySelector('input[name="star"]:checked').value);
                axios.put('https://backend-mimpi.herokuapp.com/metric/editComment/' + this.state.currCommentId, { comment: p.target.value, rate: star })
                .then(res => {
                    const idx = this.state.metric.findIndex(metric => metric._id === this.state.currCommentId)
                    let metric = this.state.metric
                    let currMetric = this.state.metric[idx]
                    currMetric.comment = p.target.value
                    currMetric.rate = star

                    metric.splice(idx, 1, currMetric)

                    this.setState({
                        currCommentRate: currMetric.rate,
                        metric: metric
                    })

                    document.getElementsByClassName("cmessage")[0].classList.add("commented")
                    document.getElementById("commented-pic").innerHTML = currMetric.pic
                    document.getElementById("commented-comment").innerHTML = currMetric.comment
                    document.getElementById("commented-pic-abbr").innerHTML = currMetric.pic.charAt(0)
                })
                .catch(err => console.log('Error: ' + err));
            }
        }
    }

    closeComment(p) {
        document.getElementsByClassName('message')[0].classList.remove("action")
        document.getElementsByClassName('cmessage')[0].classList.remove("action")

        document.getElementsByClassName("cmessage")[0].classList.remove("commented")
        document.getElementById("comment-input").value = ""

        var stars = document.getElementsByClassName("wstars")
        for (var i = 0; i < stars.length; i++) {
            stars[i].classList.remove("action")
            document.getElementById("stars" + (i+1)).checked = false
        }
    }

    editComment() {
        document.getElementsByClassName("cmessage")[0].classList.remove("commented")
        
        if (this.state.currCommentType === "goal"){
            const idx = this.state.goal.findIndex(goal => goal._id === this.state.currCommentId)
            let currGoal = this.state.goal[idx]
            console.log(currGoal)

            document.getElementById("comment-input").value = currGoal.comment
            document.getElementById("stars" + currGoal.rate).checked = true
            this.onChangeRate()
        } else if (this.state.currCommentType === "metric"){
            const idx = this.state.metric.findIndex(metric => metric._id === this.state.currCommentId)
            let currMetric = this.state.metric[idx]
            console.log(currMetric)

            document.getElementById("comment-input").value = currMetric.comment
            document.getElementById("stars" + currMetric.rate).checked = true
            this.onChangeRate()
        }
        
    }

    render() { 

        return ( 
            <React.Fragment>

                {/* <!-- Kontak --> */}
                <section className="kontak fix">
                    <div className="screen" onClick={this.closeKontak}></div>
                    <div className="ckontak box">
                        <table>
                            <tr>
                                <td>Wakil</td>
                                <td>:</td>
                                <td>
                                    <select id="kontak-select" required>
                                        <option selected disabled id="kontak-default">Pilih anggota yang ditugaskan</option>
                                        {this.state.member.map(m => (
                                            <option value={m} id={"username-" + m}>{m}</option>
                                        ))}

                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Deadline</td>
                                <td>:</td>
                                <td className="cflex">
                                    <input type="date" id="kontak-deadline" required />
                                </td>
                            </tr>
                        </table>
                        <div className="cflex">
                            <button className="btn-batal" onClick={this.closeKontak}>Batal</button>
                            <button className="btn-tetapkan" onClick={this.onClickTetapkanKontak}>Tetapkan</button>
                        </div>
                        <a className="btn-close abs-right" onClick={this.closeKontak}>
                            {/* <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                </svg> */}
                        </a>
                    </div>
                </section>
            
                {/* <!-- Message --> */}
                <section className="message fix" >
                    <div className="screen" onClick={this.closeComment}></div>
                    <div className="cmessage box" id="comment-review">
                        <p>Review / Komentar</p>
                        <div className="komen">
                            <input type="text" placeholder="Tambahkah komentar..." id="comment-input" onKeyDown={this.enterKomen} />
                        </div>
                        <div className="wrap-user bflex">
                            <div className="users sflex">
                                <a className="profile cflex" id="commented-pic-abbr">H</a>
                                <div>
                                    <h3 id="commented-pic">Harry</h3>
                                    <div className="star sflex" id="commented-star">
                                        <svg className={this.state.currCommentRate > 0 ? "active" : ""} height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                        <svg className={this.state.currCommentRate > 1 ? "active" : ""} height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                        <svg className={this.state.currCommentRate > 2 ? "active" : ""} height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                        <svg className={this.state.currCommentRate > 3 ? "active" : ""} height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                        <svg className={this.state.currCommentRate > 4 ? "active" : ""} height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                    
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p id="commented-comment"></p>
                                <a id="edit-comment" onClick={this.editComment}>Edit</a>
                            </div>
                        </div>

                        {/* TODO: connect stars and comment to database */}
                        <form className="wrap-stars" id="star-form" action="" required onChange={this.onChangeRate}>
                            <label className="wstars wstars1 wstars2 wstars3 wstars4 wstars5" htmlFor="stars1">
                                <input type="radio" name="star" id="stars1" value="1"/>
                                <svg height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                            </label>
                            <label className="wstars wstars2 wstars3 wstars4 wstars5" htmlFor="stars2">
                                <input type="radio" name="star" id="stars2" value="2"/>
                                <svg height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                            </label>
                            <label className="wstars wstars3 wstars4 wstars5" htmlFor="stars3">
                                <input type="radio" name="star" id="stars3" value="3"/>
                                <svg height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                            </label>
                            <label className="wstars wstars4 wstars5" htmlFor="stars4">
                                <input type="radio" name="star" id="stars4" value="4"/>
                                <svg height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                            </label>
                            <label className="wstars wstars5" htmlFor="stars5">
                                <input type="radio" name="star" id="stars5" value="5"/>
                                <svg height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                            </label>
                        </form>
                        <a className="btn-close abs-right" onClick={this.closeComment}>
                            {/* <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                </svg> */}
                        </a>
                    </div>
                </section>
            

                {/* <!-- Tambah Anggota --> */}
                <section className="tambah-anggota fix">
                    <div className="screen"></div>
                    <div className="ctambah-anggota box">
                        <div className="pos-input">
                            <svg height="448pt" viewBox="0 0 448 448" width="448pt" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                </svg>
                            <input type="text" placeholder="Cari anggota sesuai username..." onChange={this.onChangeQueryTeamMember}/>
                        </div>
                        <div className="bflex">
                            <h4 id="query-result"></h4>
                            <a className="btn-add" id="btn-add-undang" onClick={this.onClickButtonAddTeamMember}>Undang</a>
                        </div>
                        <a className="btn-close abs-right">
                            <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                </svg>
                        </a>
                    </div>
                </section>

                {/* <!-- Info Target --> */}
                <section className="info fix">
                    <div className="screen"></div>
                    <div className="cinfo box">
                        <img src="assets/image/atribut/7.png" alt="Gambar Target"/>
                        <a className="btn-close abs-right">
                            {/* <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                </svg> */}
                        </a>
                    </div>
                </section>
            
                {/* <!-- Info Goal --> */}
                <section className="info2 fix">
                    <div className="screen"></div>
                    <div className="cinfo2 box">
                        <img src={Goal} alt="Gambar Goal"/>
                        <a className="btn-close abs-right">
                            {/* <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                </svg> */}
                        </a>
                    </div>
                </section>
            
                {/* <!-- Notifikasi --> */}
                <section className="notifikasi">
                    <div className="screen-notif"></div>
                    <div className="container">
                        <div className="cnotifikasi box">
                            <div className="hnotif">
                                <p>Notifikasi (on progress)</p>
                            </div>
                            <div className="bnotif">
                                {/* <!-- Notif 1 --> */}
                                <div className="data-notif bflex">
                                    <div className="users sflex">
                                        <a className="profile cflex">H</a>
                                        <div>
                                            <h3>Harry</h3>
                                            <p>"Ada tambahan catatan tentang penjualan. Jangan lupa consider kenaikkan ROI untuk bulan ini sebesar 2%"</p>
                                        </div>
                                    </div>
                                    <div className="star sflex">
                                        <svg className="active" height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                        <svg className="active" height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                        <svg className="" height="511pt" viewBox="0 -10 511.98685 511" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/></svg>
                                    </div>
                                </div>
                                {/* <!-- Notif 2 --> */}
                                <div className="data-notif bflex">
                                    <div className="users sflex">
                                        <a className="profile bordered cflex">
                                            <svg id="Layer_4" enableBackground="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512"
                                            xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <path
                                                        d="m22 10.882c-.552 0-1-.448-1-1 0-2.805-1.092-5.441-3.075-7.425-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0c2.361 2.361 3.661 5.5 3.661 8.839 0 .552-.448 1-1 1z" />
                                                </g>
                                                <g>
                                                    <path
                                                        d="m2 10.882c-.552 0-1-.448-1-1 0-3.339 1.3-6.478 3.661-8.839.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414c-1.983 1.983-3.075 4.62-3.075 7.425 0 .552-.448 1-1 1z" />
                                                </g>
                                                <g>
                                                    <path
                                                        d="m21.379 16.913c-1.512-1.278-2.379-3.146-2.379-5.125v-2.788c0-3.519-2.614-6.432-6-6.92v-1.08c0-.553-.448-1-1-1s-1 .447-1 1v1.08c-3.387.488-6 3.401-6 6.92v2.788c0 1.979-.867 3.847-2.388 5.133-.389.333-.612.817-.612 1.329 0 .965.785 1.75 1.75 1.75h16.5c.965 0 1.75-.785 1.75-1.75 0-.512-.223-.996-.621-1.337z" />
                                                    <path d="m12 24c1.811 0 3.326-1.291 3.674-3h-7.348c.348 1.709 1.863 3 3.674 3z" />
                                                </g>
                                            </svg> 
                                        </a>
                                        <div>
                                            <h3>Request</h3>
                                            <p>Richie telah mengirim undangan tim</p>
                                        </div>
                                    </div>
                                    <div className="woption cflex">
                                        <a className="btn-add">Terima</a>
                                        <a className="btn-reset">Terima</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            
                <header>
                    <div className="header cflex">
                        <div className="container bflex">
                            <div className="lheader">
                                <a className="logo">
                                    <img src={Logo} alt="Logo"/>
                                </a>
                                
                                {/* <div id='testing'>hellos</div> */}
                            </div>
                            <div className="rheader sflex">
                                <a className="btn-notif">
                                    <svg id="Layer_4" enableBackground="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path
                                                d="m22 10.882c-.552 0-1-.448-1-1 0-2.805-1.092-5.441-3.075-7.425-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0c2.361 2.361 3.661 5.5 3.661 8.839 0 .552-.448 1-1 1z" />
                                        </g>
                                        <g>
                                            <path
                                                d="m2 10.882c-.552 0-1-.448-1-1 0-3.339 1.3-6.478 3.661-8.839.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414c-1.983 1.983-3.075 4.62-3.075 7.425 0 .552-.448 1-1 1z" />
                                        </g>
                                        <g>
                                            <path
                                                d="m21.379 16.913c-1.512-1.278-2.379-3.146-2.379-5.125v-2.788c0-3.519-2.614-6.432-6-6.92v-1.08c0-.553-.448-1-1-1s-1 .447-1 1v1.08c-3.387.488-6 3.401-6 6.92v2.788c0 1.979-.867 3.847-2.388 5.133-.389.333-.612.817-.612 1.329 0 .965.785 1.75 1.75 1.75h16.5c.965 0 1.75-.785 1.75-1.75 0-.512-.223-.996-.621-1.337z" />
                                            <path d="m12 24c1.811 0 3.326-1.291 3.674-3h-7.348c.348 1.709 1.863 3 3.674 3z" />
                                        </g>
                                    </svg>
                                </a>
                                <a className="profile cflex">{this.state.username.charAt(0)}</a>
                            </div>
                        </div>
                    </div>
                </header>
            
                <section className="content">
                    {/* <!-- FORM --> */}
                    <form action="">
                        <div className="container bflex" style={{alignItems: "flex-start"}}>
                            <div className="lcontent">
                                <div className="box visi-misi">
                                    <h2>Visi & Misi</h2>
                                    {/* TODO: Change textarea to div */}
                                    <textarea id="autoresizing" name="text">{this.state.vision}</textarea>
                                </div>
                                <div className="box anggota" style={{padding: 0}}>
                                    <div className="hanggota">
                                        <h2>Anggota (on progress)</h2>
                                    </div>
                                    <div className="banggota">
                                        <div className="data-anggota">
                                            <div>
                                                <label className="status online"></label>
                                                <span className="text online">test1</span>
                                            </div>
                                            <div>
                                                <label className="status online"></label>
                                                <span className="text online">test2</span>
                                            </div>
                                            <div>
                                                <label className="status offline"></label>
                                                <span className="text offline">test3</span>
                                            </div>
                                        
                                            {/* </ul> */}
                                        </div>
                                        <div className="cflex" style={{marginTop: "25px"}}>
                                            <a className="btn-anggota">
                                                <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                                    </svg>
                                                Tambah
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rcontent">
                                <div className="box target">
                                    <a className="btn-info">
                                        {/* <?xml version="1.0" encoding="iso-8859-1"?>                             */}
                                        {/* <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.577 111.577"                                style="enable-background:new 0 0 111.577 111.577;" xml:space="preserve">                                <g>                                    <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451            c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064            c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848            c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71            c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667            c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747            c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815            c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744            C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796            c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207            C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z" />                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                            </svg> */}
                                    </a>
                                    <h2>Target Setting</h2>
                                    <div className="pos-input">
                                        <svg height="448pt" viewBox="0 0 448 448" width="448pt" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                            </svg>
                                        <input id="target-input" type="text" placeholder="Tetapkan target untuk bisnismu" onKeyDown={this.createNewTarget}/>
                                    </div>
                                    <div className="task">
                                        {/* <!-- 
                                            - Pada tag p tambahin aja className action agar kecoret 
                                            - Untuk crossout satu sama lain perhatikan atribut data & data-collapse yang berada pada tag input dan p
                                            - Pastikan ketika input status checked==true nanti sistem remove className action pada tag p pasangan input tersebut
                                        --> */}

                                        {this.state.targetSetting.map(target => (
                                            <React.Fragment>
                                                <div className="wrap-task">
                                                    <div>
                                                        <div className="wtask sflex">
                                                            <label className="task-data sflex">
                                                                <input type="checkbox" checked={!target.isFinished} data={"T-" + target._id} onChange={this.checkboxTarget(target._id, target.isFinished)}/>
                                                                <span className="checkmark"></span>
                                                            </label>
                                                            <p className={target.isFinished ? "action" : ""} datas={"T-" + target._id}>{target.target}</p>
                                                        </div>

                                                        <div className={target.isFinished ? "bar-prog sflex" : "bar-prog sflex action"} data-collapse={"T-" + target._id}>
                                                            <div className="progress action">
                                                                {/* <!-- ov-progress active disesuaikan stylenya dengan line progress --> */}
                                                                <div className="line-progress" style={{width: (this.calculateProgress(target._id)+"%")}}></div>
                                                                <div className="ov-progress start active"></div>
                                                                <div className="ov-progress active" style={{left: (this.calculateProgress(target._id)+"%")}}></div>
                                                                <div className="ov-progress end"></div>
                                                            </div>
                                                            <span>{this.calculateProgress(target._id)}%</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {/* <!-- Btn Calendar Active --> */}
                                                        <label className= {target.isFinished ? (target.deadline ? "btn-calendar active action" : "btn-calendar action") : (target.deadline ? "btn-calendar active" : "btn-calendar") } target={"T-" + target._id}>
                                                            <input type="date" onChange={this.onChangeTargetDeadline(target._id)}/>
                                                            <span>
                                                                <a>{target.deadline ? new Date(target.deadline).getDate() + "/" + (new Date(target.deadline).getMonth()+1) : "+"}</a>
                                                                <svg id="Layer_1" enableBackground="new 0 0 512 512" height="512"
                                                                    viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                                                                    <g>
                                                                        <path
                                                                            d="m446 40h-46v-24c0-8.836-7.163-16-16-16s-16 7.164-16 16v24h-224v-24c0-8.836-7.163-16-16-16s-16 7.164-16 16v24h-46c-36.393 0-66 29.607-66 66v340c0 36.393 29.607 66 66 66h380c36.393 0 66-29.607 66-66v-340c0-36.393-29.607-66-66-66zm34 406c0 18.778-15.222 34-34 34h-380c-18.778 0-34-15.222-34-34v-265c0-2.761 2.239-5 5-5h438c2.761 0 5 2.239 5 5z" />
                                                                    </g>
                                                                </svg>
                                                            </span>
                                                        </label>

                                                        <a className= {target.isFinished ? "btn-close" : "btn-close action"} target={"T-" + target._id} onClick={this.removeTarget(target._id)}>
                                                            {/* <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                                                </svg> */}
                                                        </a>
                                                    </div>

                                                </div>

                                                {/* <!-- Goals & Metrics --> */}
                                                <section className="goal fix" id={"section-target-"+target._id} target={"T-" + target._id}>
                                                    <div className="screen"></div>
                                                    <div className="cgoal bflex box">
                                                        <div className="lgoal">
                                                            <p>Target : {target.target}</p>
                                                            <div className="blgoal">
                                                                <div className="hgoal">
                                                                    <div className="bflex">
                                                                        <a className="btn-sub btn-goal" datas={target._id}>
                                                                            Goals
                                                                            <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                                                                xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                                                                </svg>
                                                                        </a>
                                                                        <a className="btn-info2">
                                                                            {/* <?xml version="1.0" encoding="iso-8859-1"?>                             */}
                                                                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 111.577 111.577"  enableBackground = "new 0 0 111.577 111.577" >                                <g>                                    <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451            c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064            c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848            c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71            c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667            c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747            c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815            c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744            C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796            c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207            C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z" />                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                                <g>                                </g>                            </svg>
                                                                        </a>
                                                                    </div>
                                                                    <div className="pos-input goal-form" id={"goal-form-input-" + target._id}>
                                                                        <svg height="448pt" viewBox="0 0 448 448" width="448pt" xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                                                        </svg>
                                                                        
                                                                        <input id={"goal-input-"+target._id} type="text" placeholder="Tetapkan target untuk bisnismu" onKeyDown={this.createNewGoal(target._id)} target={target._id}/>
                                                                        
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="parent">
                                                                    {this.state.goal.filter(g => (g.targetId === target._id)).map( g => (   
                                                                            <React.Fragment>
                                                                                <div className="wrap-task bflex">
                                                                                    <div className="wtask sflex">
                                                                                        <label className="task-data task-new sflex">
                                                                                            <input type="checkbox" checked={!g.isFinished} data={"G-" + g._id} onChange={this.checkboxGoal(g._id, g.isFinished)}/>
                                                                                            <span className="checkmark"></span>
                                                                                        </label>
                                                                                        <p className={g.isFinished ? "action" : ""} datas={"G-" + g._id}>{g.goalName}</p>
                                                                                    </div>
                                                                                    <div className="sflex">
                                                                                        <a className={g.pic ? ( g.comment ? "btn-message active commented" : "btn-message active") : "btn-message"} onClick={this.onClickGoalMessage(g._id)}>
                                                                                            <svg id="Capa_1" enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m354.03 31.622h-296.13c-31.93 0-57.9 25.97-57.9 57.9v259.5c0 12.29 13.899 19.218 23.71 12.21l82.47-58.84c6.92-4.93 15.06-7.54 23.56-7.54h181.39c31.93 0 57.9-25.97 57.9-57.9v-190.33c0-8.28-6.72-15-15-15zm-72.86 181.71h-173.31c-8.28 0-15-6.71-15-15 0-8.28 6.72-15 15-15h173.31c8.28 0 15 6.72 15 15 0 8.29-6.72 15-15 15zm0-70h-173.31c-8.28 0-15-6.71-15-15 0-8.28 6.72-15 15-15h173.31c8.28 0 15 6.72 15 15 0 8.29-6.72 15-15 15z"/><path d="m512 205.872v259.49c0 12.207-13.829 19.268-23.71 12.21l-82.47-58.83c-6.92-4.93-15.06-7.54-23.56-7.54h-181.39c-31.93 0-57.9-25.98-57.9-57.91v-28.44h168.16c48.47 0 87.9-39.43 87.9-87.9v-88.99h55.07c31.93 0 57.9 25.98 57.9 57.91z"/></g></svg>
                                                                                        </a>
                                                                                        <a className={g.pic ? "btn-kontak active" : "btn-kontak"} onClick={this.onClickGoalKontak(g._id)}>
                                                                                            {/* <?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> */}
                                                                                            {/* <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g>	<g>		<path d="M256,0c-74.439,0-135,60.561-135,135s60.561,135,135,135s135-60.561,135-135S330.439,0,256,0z"/>	</g></g><g>	<g>		<path d="M423.966,358.195C387.006,320.667,338.009,300,286,300h-60c-52.008,0-101.006,20.667-137.966,58.195			C51.255,395.539,31,444.833,31,497c0,8.284,6.716,15,15,15h420c8.284,0,15-6.716,15-15			C481,444.833,460.745,395.539,423.966,358.195z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                                                                            </svg> */}
                                                                                            
                                                                                            <svg id="Capa_1" enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                                                                                                <g><g>
                                                                                            <path d="M256,0c-74.439,0-135,60.561-135,135s60.561,135,135,135s135-60.561,135-135S330.439,0,256,0z"/>	</g></g><g>	<g>		<path d="M423.966,358.195C387.006,320.667,338.009,300,286,300h-60c-52.008,0-101.006,20.667-137.966,58.195			C51.255,395.539,31,444.833,31,497c0,8.284,6.716,15,15,15h420c8.284,0,15-6.716,15-15			C481,444.833,460.745,395.539,423.966,358.195z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                                                                                            {/* <img src={Person} alt="Person" height={25} /> */}
                                                                                        </a>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="child">
                                                                                    <a className="btn-sub btn-metrics" datas={g._id}>
                                                                                        Metrics
                                                                                        <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                                            <path
                                                                                                d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                                                                            </svg>
                                                                                    </a>
                                                                                    <div className="pos-input metrics-form" id={"metrics-form-input-" + g._id}>
                                                                                        <svg height="448pt" viewBox="0 0 448 448" width="448pt" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path
                                                                                                d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                                                                            </svg>
                                                                                        <input id={"metric-input-"+g._id} type="text" placeholder="Tetapkan target untuk bisnismu" onKeyDown={this.createNewMetric(target._id, g._id)}/>
                                                                                    </div>

                                                                                    <div className="c-child">
                                                                                        {this.state.metric.filter(m => (m.goalId === g._id)).map(m => (
                                                                                                    <React.Fragment>
                                                                                                            <div className="wrap-task bflex">
                                                                                                                <div className="wtask sflex">
                                                                                                                    <label className="task-data task-new sflex">
                                                                                                                        <input type="checkbox" checked={!m.isFinished} data={"M-" + m._id} onChange={this.checkboxMetric(m._id, m.isFinished)}/>
                                                                                                                        <span className="checkmark"></span>
                                                                                                                    </label>
                                                                                                                    <p className={m.isFinished ? "action" : ""} datas={"M-" + m._id}>{m.metricName}</p>
                                                                                                                </div>
                                                                                                        
                                                                                                                <div className="sflex">
                                                                                                                    <a className={m.pic ? ( m.comment ? "btn-message active commented" : "btn-message active") : "btn-message"} onClick={this.onClickMetricMessage(m._id)}>
                                                                                                                        <svg id="Capa_1" enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m354.03 31.622h-296.13c-31.93 0-57.9 25.97-57.9 57.9v259.5c0 12.29 13.899 19.218 23.71 12.21l82.47-58.84c6.92-4.93 15.06-7.54 23.56-7.54h181.39c31.93 0 57.9-25.97 57.9-57.9v-190.33c0-8.28-6.72-15-15-15zm-72.86 181.71h-173.31c-8.28 0-15-6.71-15-15 0-8.28 6.72-15 15-15h173.31c8.28 0 15 6.72 15 15 0 8.29-6.72 15-15 15zm0-70h-173.31c-8.28 0-15-6.71-15-15 0-8.28 6.72-15 15-15h173.31c8.28 0 15 6.72 15 15 0 8.29-6.72 15-15 15z"/><path d="m512 205.872v259.49c0 12.207-13.829 19.268-23.71 12.21l-82.47-58.83c-6.92-4.93-15.06-7.54-23.56-7.54h-181.39c-31.93 0-57.9-25.98-57.9-57.91v-28.44h168.16c48.47 0 87.9-39.43 87.9-87.9v-88.99h55.07c31.93 0 57.9 25.98 57.9 57.91z"/></g></svg>
                                                                                                                    </a>
                                                                                                                    <a className={m.pic ? "btn-kontak active" : "btn-kontak"} onClick={this.onClickMetricKontak(m._id)}>
                                                                                                                        {/* <?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> */}
                                                                                                                        {/* <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g>	<g>		<path d="M256,0c-74.439,0-135,60.561-135,135s60.561,135,135,135s135-60.561,135-135S330.439,0,256,0z"/>	</g></g><g>	<g>		<path d="M423.966,358.195C387.006,320.667,338.009,300,286,300h-60c-52.008,0-101.006,20.667-137.966,58.195			C51.255,395.539,31,444.833,31,497c0,8.284,6.716,15,15,15h420c8.284,0,15-6.716,15-15			C481,444.833,460.745,395.539,423.966,358.195z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                                                                                                        </svg> */}
                                                                                                                        
                                                                                                                        <svg id="Capa_1" enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                                                                                                                            <g><g>
                                                                                                                        <path d="M256,0c-74.439,0-135,60.561-135,135s60.561,135,135,135s135-60.561,135-135S330.439,0,256,0z"/>	</g></g><g>	<g>		<path d="M423.966,358.195C387.006,320.667,338.009,300,286,300h-60c-52.008,0-101.006,20.667-137.966,58.195			C51.255,395.539,31,444.833,31,497c0,8.284,6.716,15,15,15h420c8.284,0,15-6.716,15-15			C481,444.833,460.745,395.539,423.966,358.195z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                                                                                                                        {/* <img src={Person} alt="Person" height={25} /> */}
                                                                                                                    </a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </React.Fragment>
                                                                                                ))
                                                                                        }
                                                                                            
                                                                                    </div>
                                                                                </div>
                                                                            
                                                                        
                                                                        </React.Fragment>  
                                                                        )
                                                                        )
                                                                    }
                                                                    
                                                                    <a className="btn-done">Selesai</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="rgoal">
                                                            <p>Catatan</p>
                                                            <div className="pos-input sflex">
                                                                <input type="text" placeholder="Tulis judul..."/>
                                                                <label className="btn-file">
                                                                    <input type="file"/>
                                                                    <span> */}
                                                                        {/* <?xml version="1.0" encoding="iso-8859-1"?>                            <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->                            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">                             */}
                                                                        {/* <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"                                width="612.675px" height="612.675px" viewBox="0 0 612.675 612.675" style="enable-background:new 0 0 612.675 612.675;"                                xml:space="preserve">                            <g>                                <g id="_x34__17_">                                    <g>                                        <path d="M581.209,223.007L269.839,530.92c-51.592,51.024-135.247,51.024-186.839,0c-51.592-51.023-51.592-133.737,0-184.761                                            L363.248,69.04c34.402-34.009,90.15-34.009,124.553,0c34.402,34.008,34.402,89.166,0,123.174l-280.249,277.12                                            c-17.19,17.016-45.075,17.016-62.287,0c-17.19-16.993-17.19-44.571,0-61.587L394.37,161.42l-31.144-30.793L114.144,376.975                                            c-34.402,34.009-34.402,89.166,0,123.174c34.402,34.009,90.15,34.009,124.552,0l280.249-277.12                                            c51.592-51.023,51.592-133.737,0-184.761c-51.593-51.023-135.247-51.023-186.839,0L36.285,330.784l1.072,1.071                                            c-53.736,68.323-49.012,167.091,14.5,229.88c63.512,62.79,163.35,67.492,232.46,14.325l1.072,1.072l326.942-323.31                                            L581.209,223.007z"/>                                    </g>                                </g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            <g>                            </g>                            </svg> */}
                                                                    {/* </span>
                                                                </label>
                                                            </div>
                                                            <textarea cols="30" rows="10" placeholder="Detail lengkap..."></textarea>
                                                            <button type="submit" className="btn-trans">Tambah Catatan</button>
                                                        </div> */}
                                                        <a className="btn-close abs-right">
                                                            {/* <svg height="448pt" viewBox="0 0 448 448" width="448pt"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
                                                                </svg> */}
                                                        </a>
                                                    </div>
                                                </section>
                                            
                                            </React.Fragment>
                                                        
                                        ))}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
                <footer>
                    <div className="container">
                        <p>Goal setting yang bagus adalah goal yang bisa diukur, punya hasil jelas dan mudah dipahami siapapun. -
                            Nadiem Makarim</p>
                    </div>
                </footer>
            
                {/* <script src="../assets/jquery/jquery-3.6.0.min.js"></script>
                <script src='../assets/autosize/autosize.js'></script>
                <script src="../assets/script/script.js"></script> */}

            </React.Fragment>
         );
    }
}
 
export default Homepage;
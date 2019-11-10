import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const api = axios.create({ withCredentials: true });

const url = 'http://124.111.56.169:3000/api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    }
  }

  onEmailInput = (e) => this.setState({ email: e.target.value });

  submitEmailAddress = async (size) => {

    if(this.state.email.length < 1)
      return alert("이메일을 입력하세요.");

    if(this.state.email.indexOf("@") == -1 || this.state.email.indexOf(" ") != -1)
      return alert("이메일 형식이 잘못되었습니다.");

    if(!window.confirm(
      "주소: " + this.state.email + "\n" + 
      "사이즈: " + size + "mm\n" + 
      "위의 주소로 메일을 받으시겠습니까?"
    )) return;

    try {
      let result = await api.get(url + "?email=" + this.state.email + "&size=" + size);
      if(result.data.result)
        return alert("[" + result.data.email + "] 애플워치 5 에르메스 블랙 에디션 " + result.data.size +  "mm 등록 완료!");
      else
        return alert("이미 등록한 이메일 입니다.\n[애플워치 5 에르메스 블랙 에디션 " + result.data.size +  "mm]");
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  render() {
    return (
      <div className="App">
        <div className="AppWrap">
          <h2>Apple Watch 5 Hermès Black Edition</h2>
          <p>
            애플 코리아 공식 홈페이지 기준으로<br/>
            구매가 가능한 시점에 등록한 이메일로 메일을 보내드립니다.
          </p>
          <div className="emailInput">
            <span>E-mail</span>
            <input type="email" onChange={this.onEmailInput}></input>
          </div>
          <div>
            <h3>Size</h3>
            <button onClick={() => { this.submitEmailAddress(44)} }>44mm</button>
            <button onClick={() => { this.submitEmailAddress(40)} }>40mm</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

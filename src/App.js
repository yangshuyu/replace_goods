import React, { Component } from 'react';
import { Layout, notification, Icon } from 'antd';
import SiderCustom from './components/SiderCustom';
// import HeaderCustom from './components/HeaderCustom';
import { receiveData } from './action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Routes from './routes';
// import { ThemePicker } from './components/widget';

const { Content, Footer } = Layout;

class App extends Component {
  // render() {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <p>
  //           Edit <code>src/App.js</code> and save to reload.
  //         </p>
  //         <a
  //           className="App-link"
  //           href="https://reactjs.org"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Learn React
  //         </a>
  //       </header>
  //     </div>
  //   );
  // }

    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

  render() {
    const { auth, responsive } = this.props;
    return (
        <Layout>
          {!responsive.data.isMobile && <SiderCustom collapsed={this.state.collapsed} />}
            {/*<ThemePicker />*/}
            <Layout style={{flexDirection: 'column'}}>
                {/*<HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}} />*/}
                <Content style={{ margin: '0 16px', overflow: 'initial', flex: '1 1 0' }}>
                    <Routes auth={auth} />
                </Content>
                {/*<Footer style={{ textAlign: 'center' }}>*/}
                {/*React-Admin ©{new Date().getFullYear()} Created by 865470087@qq.com*/}
                {/*</Footer>*/}
            </Layout>
        </Layout>
    );
  }
}

// export default App;

const mapStateToProps = state => {
    const { auth = {data: {}}, responsive = {data: {}} } = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

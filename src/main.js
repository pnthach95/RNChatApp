import React, { Component } from 'react';
import { Platform, Dimensions, AsyncStorage, View, Text, StyleSheet, TextInput, Image, ScrollView, Keyboard } from 'react-native';
import { Container, Body, Title, Button, List, ListItem } from 'native-base';
import renderIf from 'render-if'

if(Object.defineProperty){
  Object.defineProperty(window.navigator, 'userAgent', {
   configurable: true,
   get: function(){
    return "react-native";
  }})}
import io from 'socket.io-client/dist/socket.io.js';

var a, k=true;
const windowWidth = Dimensions.get('window').width;

export class Main extends Component{
  static navigationOptions = (
    ({ navigation, screenProps }) => ({
      title: navigation.state.params.user,
      headerTitleStyle: { alignSelf: "center" }
    })
  );

  constructor(props){
    console.disableYellowBox = true;
    super(props);
    a = this;
    k = true;

    this.state={
      scrollViewHeight: 0,
      listHeight: 0,
      text: '',
      username: a.props.navigation.state.params.user,
      message:[]
    }

    this.socket = io("http://10.238.239.12:3000", {jsonp: false});
    this.socket.on('connect', function(){k=true});
    this.socket.on('loading', function(data){
      a.setState({
        message:data
      })
      a.saveData();
    });
    this.socket.on('connect_error', (error) => {this.connectError()});
    this.socket.on('connect_timeout', (timeout) => {this.connectError()});
    this.socket.on('newmsg', function(data){
      a.setState({
        message: [...a.state.message, data]
      });
      a.saveData();
    });
  }

  saveData(){
    AsyncStorage.setItem('ChatData', JSON.stringify(a.state.message))
    .then(json => console.log('success!'))
    .catch(error => console.log('error!'));
  }

  connectError(){
    if (k){
      alert('Lỗi kết nối, nạp dữ liệu cũ từ database');
      AsyncStorage.getItem('ChatData')
      .then(req => JSON.parse(req))
      .then(json => {
        this.setState({
          message: json
        })
      })
      .catch(error => console.log('error!'));
      k=false;
    }
  }

  componentDidMount(){
  }
  
  sendText(){
    if (this.state.text.length != 0){
      this.socket.emit('msg', {msg: this.state.text, user: this.state.username});
      this.setState({
        text:''
      })
      Keyboard.dismiss;
    }
  }

  changeStyle(item){
    if (this.state.username == item.user){
      return {
        textAlign: 'right'
      }
    }
  }

  componentDidUpdate(){
    const bottomOfList =  this.state.listHeight - this.state.scrollViewHeight
    this.scrollView.scrollTo({ y: bottomOfList })
  }
  
  render(){
    return(
      <Container>
        <Image source={require('../img/bg.png')} style={st.stBGIMG}>
          {renderIf(!k)(
            <View style={st.stWarning}>
              <Text style={st.stTextWarning}>Ngoại tuyến</Text>
            </View>
          )}
          <ScrollView
            onLayout={ (e) => {
              // get the component measurements from the callbacks event
              const height = e.nativeEvent.layout.height
              // save the height of the scrollView component to the state
              this.setState({scrollViewHeight: height })
            }}

            onContentSizeChange={ (contentWidth, contentHeight) => {
              // save the height of the content to the state when there’s a change to the list
              // this will trigger both on layout and any general change in height
              this.setState({listHeight: contentHeight })
            }}

            ref={ (ref) => this.scrollView = ref }
          >
            <List dataArray={this.state.message}
              renderRow={(item) =>
                <View style={st.stItem}>
                  <Text style={st.stUser}>{item.user}: </Text>
                  <Text style={st.stMsg}>{item.msg}</Text>
                </View>
              }>
            </List>
          </ScrollView>          
        </Image>

        <View style={st.stInput}>
            <TextInput placeholder='Nhập tin nhắn' underlineColorAndroid='transparent' returnKeyType='send' onChangeText={(text)=> this.setState({text})} value={this.state.text} style={st.stTextInput} onSubmitEditing={()=> this.sendText()}/>
            <Button onPress={()=>this.sendText()}>
              <Text style={st.stTextButton}>Gửi</Text>
            </Button>
        </View>
      </Container>
    )
  }
}

Main.propType = {
  usr:React.PropTypes.string.isRequired
}

var st=StyleSheet.create({
  stContainer:{
    flex:1
  },
  stWarning:{
    backgroundColor:'rgba(230,0,0,0.8)',
    width: windowWidth,
    height: 50,
    justifyContent:'center',
    alignItems:'center'
  },
  stTextWarning:{
    color: 'white',
    fontSize: 20
  },
  stTextInput:{
    flex:1,
    paddingLeft: 10
  },
  stButton:{
    borderWidth: 2,
    borderColor: 'purple',
    backgroundColor: 'purple',
    alignItems: 'center',
    width:50,
    flex:1
  },
  stBGIMG:{
    flex: 1,
    resizeMode: 'cover',
  },
  stInput:{
    flexDirection: 'row',
  },
  stTextButton:{
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    width: 50
  },
  stUser:{
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  stMsg:{
    fontSize: 20,
    color: '#555',
  },
  stItem:{
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-start',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    margin: 4,
    borderRadius: 20,
  }
})
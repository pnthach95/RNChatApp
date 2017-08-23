import React, { Component } from 'react';
import { NetInfo, AsyncStorage, Dimensions, View, Text, StyleSheet, TextInput, Image, Keyboard } from 'react-native';
import { Container, Body, Title, Button, List, ListItem, CheckBox } from 'native-base';
import { Main } from './main.js'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export class FirstScreen extends Component{
  static navigationOptions = { title: 'Welcome', header: null };

  constructor(props){
    super(props);
    this.state={
      text: '',
      chkbox_chk: true
    }
  }

  componentDidMount() {
    // Get data
    AsyncStorage.getItem('check').then((value)=>{
      this.setState({chkbox_chk:JSON.parse(value)});
      if (this.state.chkbox_chk){
        AsyncStorage.getItem('username').then((value)=>{
          this.setState({text:value});
        }).done();
      }
    }).done();
  }

  check(){
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected){
        if (this.state.text.length != 0){
          Keyboard.dismiss;
          AsyncStorage.setItem('check', JSON.stringify(this.state.chkbox_chk));
          if (this.state.chkbox_chk){
            AsyncStorage.setItem('username', this.state.text);
          } else {
            AsyncStorage.setItem('username', null);
          }
          this.props.navigation.navigate('Chat', {user: this.state.text})
        }
      } else {
        alert('Không có mạng')
      }
    });
  }

  chkbox_check(){
    var s = !this.state.chkbox_chk;
    this.setState({
      chkbox_chk: s
    })
  }

  render(){
    return(
      <Container>
        <Image source={require('../img/bg1.png')} style={st.container1}></Image>

        <View style={st.container2}>
          <TextInput placeholder='Tên' underlineColorAndroid='transparent' onChangeText={(text)=> this.setState({text})} value={this.state.text} style={st.nameInput}/>
          <ListItem onPress={()=>this.chkbox_check()} style={st.checkBox}>
            <CheckBox style={{marginRight: 20}} checked={this.state.chkbox_chk}/>
            <Text style={st.textButtonStyle}>Ghi nhớ</Text>
          </ListItem>
          <Button block onPress={()=>this.check()}>
            <Text style={st.textButtonStyle}>Bắt đầu chat</Text>
          </Button>
        </View>
      </Container>
    )
  }
}

var st=StyleSheet.create({
  container1:{
    resizeMode:'cover',
    width: windowWidth,
    height: windowHeight * 0.3,
  },
  container2:{
    padding: 15,
    flex: 1,
    backgroundColor: '#62B1F6',
//    position: 'relative',
  },
  nameInput:{
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    fontSize: 20,
    width: windowWidth*0.9,
    color: 'black'
  },
  textButtonStyle:{
    fontSize: 20,
    color: 'white'
  },
  checkBox:{
    flexDirection: 'row',
  }
})
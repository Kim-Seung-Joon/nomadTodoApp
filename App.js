import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View ,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import Todo from './Todo'
import {AppLoading} from 'expo';
import uuidv1 from 'uuid/v1';

const {width,height} = Dimensions.get("window");

export default class App extends React.Component {

  state= {
    newToDo: "",
    loadedToDos: false,
    toDos:  {}
  };

  componentDidMount = () =>{
    this._loadToDos();
  }

  render() {
    const { newToDo,loadedToDos,toDos } = this.state;
    if (!loadedToDos) {
      return <AppLoading/>
    }
    // 상태바의 색깔을 설정해서 조절이 가능하며

    return (
      
      <View style={styles.container}>
        <StatusBar barStyle = "light-content"/>
        <Text style={styles.title}>나의 할 일 앱</Text>

        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"할 일을 입력하세요!"} 
            value={newToDo}
            onChangeText = {this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map(toDo => 
                <Todo 
                key={toDo.id} {...toDo} 
                deleteToDo={this._deleteToDo}
                uncompleteToDo= {this._uncompleteToDo}
                completeToDo ={this._completeToDo}
                updateToDo ={this._updateToDo}
                />)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }

  _loadToDos = () => {
    this.setState({
      loadedToDos:true 
    });
  };
  
  _addToDo = () =>{
    const{ newToDo} = this.state;
    
    if(newToDo != ""){
        this.setState(prevState=>{
          const ID = uuidv1();
          const newToDoObject = {
            [ID]: {
              id: ID,
              isCompleted: false,
              text: newToDo,
              createdAt: Date.now()
            }
          }
          const newState= {
            ...prevState,
            newToDo: "",
            toDos: {
              ...prevState.toDos,
              ...newToDoObject
            }
          }
          return {...newState};
        })
    }
  }

  _deleteToDo = (id) =>{
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      return {...newState};
    })
  } 

  _uncompleteToDo = (id) => {
    this.setState(prevState=> {
      const newState = {
        ...prevState,
        toDos:  {
          ...prevState.toDos,
        [id]: {
          ...prevState.toDos[id],
          isCompleted: false
        }  
      }
      }
      return {...newState};
    })
  }

  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }
      return { ...newState };
    })
  }

  _updateToDo= (id,text) =>{
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false,
            text:text,
          }
        }
      }
      return { ...newState };
    })
  }

  _saveToDos = (newToDos) => {
    const saveToDos = 
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title: {
     color:'white',
     fontSize: 30,
     marginTop: 50,
     fontWeight: '200',
     marginBottom: 30,
  },
  card: {
    backgroundColor:'white',
    flex:1,
    width: width - 25,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios:  {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        },
      },
      android:  {
        elevation: 3
      }
    }),

  },
  input:  {
    padding:20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize:25,
  },
  toDos:  {
    alignItems: 'center'
  }
});
 
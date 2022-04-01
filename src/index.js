import React from 'react'
import ReactDOM from 'react-dom'
import { Provider}  from 'react-redux'
import { store } from './store'
//import { App } from './components/App'
import { CandyWarsApp } from './components/CandyWarsApp'
import './style/main.css';


const rootElement = document.getElementById('root')

ReactDOM.render((
  <Provider store={store}>
    <CandyWarsApp />
  </Provider>
), rootElement)

// ReactDOM.render(<App /> , rootElement)
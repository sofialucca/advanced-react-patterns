// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import { isNull } from 'lodash'
import * as React from 'react'
import {Switch} from '../switch'

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  // 🐨 replace this with a call to React.Children.map and map each child in
  // props.children to a clone of that child with the props they need using
  // React.cloneElement.
  return React.Children.map(children, (child)=>{
    //specifico nuovi parametri di child
    if(typeof child.type === 'string'){
      return child;
    }
    return React.cloneElement(child,{on, toggle});
  })
  // 💰 React.Children.map(props.children, child => {/* return child clone here */})
  // 📜 https://reactjs.org/docs/react-api.html#reactchildren
  // 📜 https://reactjs.org/docs/react-api.html#cloneelement
  // return <Switch on={on} onClick={toggle} />
}

// 🐨 Flesh out each of these components

// Accepts `on` and `children` props and returns `children` if `on` is true
const ToggleOn = ({on,children}) => (on ? children:null)

// Accepts `on` and `children` props and returns `children` if `on` is false
const ToggleOff = ({on, children}) => on ? null : children;

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
const ToggleButton = ({on, toggle, ...props}) => <Switch on = {on} onClick ={toggle} {...props} />

// function App() {
//   return (
//     <div>
//       <Toggle>
//         <ToggleOn>The button is on</ToggleOn>
//         <ToggleOff>The button is off</ToggleOff>
//         <ToggleButton />
//       </Toggle>
//     </div>
//   )
// }

//extra 1
function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/

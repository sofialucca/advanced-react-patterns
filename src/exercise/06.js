// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

//extra 3
function useControllSwitchWarning(controlPropValue, controlPorpName, componenentName){
  const isControlled = controlPropValue != null;
  const {current: wasControlled} = React.useRef(isControlled);
  React.useEffect(()=>{
    warning(
      !(isControlled && !wasControlled),
      "Warning: A component is changing an uncontrolled input of type undefined to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component."
    )

    warning(
      !(!isControlled && wasControlled),
      'Warning: A component is changing a controlled input of type undefined to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component.'
  )},[isControlled, wasControlled]);
}

function useOnChangeReadOnlyWarning(controlPropValue, controlPropName, componenentName,hasOnChange, readOnly, readOnlyProp,initialValueProp, onChangeProp){
  const isControlled = controlPropValue != null;

  React.useEffect(()=> {
    warning(!(!hasOnChange && isControlled && !readOnly), 'Warning: Failed prop type: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.' );
  }, [controlPropValue, controlPropName, componenentName,hasOnChange, readOnly, readOnlyProp,initialValueProp, onChangeProp])
}


function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly= false,
  // 🐨 add an `onChange` prop.
  // 🐨 add an `on` option here
  // 💰 you can alias it to `controlledOn` to avoid "variable shadowing."
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  // 🐨 determine whether on is controlled and assign that to `onIsControlled`
  // 💰 `controlledOn != null`
  const onIsControlled = controlledOn != null;
  // 🐨 Replace the next line with assigning `on` to `controlledOn` if
  // `onIsControlled`, otherwise, it should be `state.on`.
  const on = (onIsControlled)? controlledOn:state.on;
  // const {on} = state

  // We want to call `onChange` any time we need to make a state change, but we
  // only want to call `dispatch` if `!onIsControlled` (otherwise we could get
  // unnecessary renders).
  // 🐨 To simplify things a bit, let's make a `dispatchWithOnChange` function
  // right here. This will:
  // 1. accept an action
  // 2. if onIsControlled is false, call dispatch with that action
  // 3. Then call `onChange` with our "suggested changes" and the action.
  
  // const hasOnChange = Boolean(onChange);
  // React.useEffect(()=> {
  //   warning(!(!hasOnChange && onIsControlled && !readOnly), 'Warning: Failed prop type: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.' );
  // }, [hasOnChange, onIsControlled, readOnly])
  
  //extra 2
  // const {current: onWasControlled} = React.useRef(onIsControlled);
  // React.useEffect(()=>{
  //   warning(
  //     !(onIsControlled && !onWasControlled),
  //     "Warning: A component is changing an uncontrolled input of type undefined to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components"
  //   )

  //   warning(
  //     !(!onIsControlled && onWasControlled),
  //     'Warning: A component is changing a controlled input of type undefined to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components'
  // )},[onIsControlled, onWasControlled]);

  useControlledSwitchWarning(controlledOn, 'on', 'useToggle');
  useOnChangeReadOnlyWarning(controlledOn, 'on ', 'useToggle',Boolean(onChange), readOnly, 'readOnly','initialOn', 'onChange')

  function dispatchWithOnChange(action){
    if(!onIsControlled){
      dispatch(action)
    }
    onChange?.(reducer({...state, on},action), action)
  }
  // 🦉 "Suggested changes" refers to: the changes we would make if we were
  // managing the state ourselves. This is similar to how a controlled <input />
  // `onChange` callback works. When your handler is called, you get an event
  // which has information about the value input that _would_ be set to if that
  // state were managed internally.
  // So how do we determine our suggested changes? What code do we have to
  // calculate the changes based on the `action` we have here? That's right!
  // The reducer! So if we pass it the current state and the action, then it
  // should return these "suggested changes!"
  //
  // 💰 Sorry if Olivia the Owl is cryptic. Here's what you need to do for that onChange call:
  // `onChange(reducer({...state, on}, action), action)`
  // 💰 Also note that user's don't *have* to pass an `onChange` prop (it's not required)
  // so keep that in mind when you call it! How could you avoid calling it if it's not passed?

  // make these call `dispatchWithOnChange` instead
  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () => dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, readOnly}) {
  const {on, getTogglerProps} = useToggle({on: controlledOn, onChange, readOnly})
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} readOnly = {true} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/

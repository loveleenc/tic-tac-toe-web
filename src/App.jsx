import { useState } from 'react'
import Grid from './components/Grid'
import Setup from './components/Setup'

function App() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  

  const updateWidth = (value) => {
    setWidth(value)
  } 

  const updateHeight = (value) => {
    setHeight(value)
  }

  

  return (
    <>
      <Setup setWidth={updateWidth} setHeight={updateHeight} />
      <Grid width={width} height={height}/>
      {/* <form>
        <p>Enter width: <input name="inputWidth" onChange={onWidthChange}/></p>
        Enter height: <input name="inputHeight" onChange={onHeightChange}/>
        <p><button type="submit" onClick={onSubmit}>Create Grid</button></p>
      </form> */}
      
    </>
  )
}

export default App

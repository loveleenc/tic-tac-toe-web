import { useState } from "react";
import "./../../styles/difficulty.css";
import Common from "../Common";


const CarouselPanel = ({text, image}) => {

  return (
    <div className="carousel_cell pixelFontStyle">
          <img src={image} />
          <span>
          {text}
          </span>
          
    </div>
  )
}


const Difficulty = ({ setDifficulty }) => {
  const [index, setIndex] = useState(0);

  const onPrevClick = () => {
    setIndex(index + 120);
  };


  const onNextClick = () => {
    setIndex(index - 120);
  }

  return (
    <div className="scene">
      <button className="difficultyNavButton pixelFontStyle" onClick={onPrevClick}>Prev</button>
      <div className="carousel" style={{transform: `translateZ(-60px) rotateY(${index}deg)`}}>
        <CarouselPanel text="Easy" image="/assets/difficulty/charmander.gif"/>
        <CarouselPanel text="Medium" image="/assets/difficulty/ivysaur.gif" />
        <CarouselPanel text="Hard" image="/assets/difficulty/squirtle.gif" />
      </div>
      <button className="difficultyNavButton pixelFontStyle" onClick={onNextClick}>Next</button>
      {/* <Common.NavigationButton onClickEventHandler={onPrevClick} text="Previous" buttonLocation={{ left: 0, right: 0, top: 0, bottom: 0}}/>
      <Common.NavigationButton onClickEventHandler={onNextClick} text="Next" buttonLocation={{ left: 0, right: 0, top: 0, bottom: 0}}/> */}
    </div>
    
  );
};
export default Difficulty;

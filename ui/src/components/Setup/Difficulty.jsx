import { useState } from "react";
import "./../../styles/difficulty.css";
import types from "../../types/types.js";


const difficultyLevels = {
  [types.GameDifficulty.EASY]: 1,
  [types.GameDifficulty.MEDIUM]: 2,
  [types.GameDifficulty.HARD]: 3
}


const CarouselPanel = ({text, image, handleSettingDifficulty, selectedDifficultyIndex}) => {
  const styled = selectedDifficultyIndex === difficultyLevels[text.toUpperCase()] ? {border: "2px solid greenyellow"} : null;


  return (
    <div className="carousel_cell pixelFontStyle" style={styled} onClick={handleSettingDifficulty}>
          <img src={image} />
          <span>
          {text}
          </span>
          
    </div>
  )
}


const Difficulty = ({ setDifficulty }) => {
  const [index, setIndex] = useState(null);
  const [selectedDifficultyIndex, setSelectedDifficultyIndex] = useState(null);

  const onPrevClick = () => {
    setIndex(index + 120);
  };

  const onNextClick = () => {
    setIndex(index - 120);
  }

  const handleSettingDifficulty = (difficultyLevel) => {
    setDifficulty(difficultyLevel)
    setSelectedDifficultyIndex(difficultyLevels[difficultyLevel])
  }

  return (
    <div className="scene">
      <button type="button" className="difficultyNavButtonLeft difficultyNavButton pixelFontStyle" onClick={onPrevClick}>Prev</button>
      <div className="carousel" style={{transform: `translateZ(-60px) rotateY(${index}deg)`}}>
        <CarouselPanel text="Easy" image="/assets/difficulty/charmander.gif" handleSettingDifficulty={() => handleSettingDifficulty(types.GameDifficulty.EASY)} selectedDifficultyIndex={selectedDifficultyIndex}/>
        <CarouselPanel text="Medium" image="/assets/difficulty/ivysaur.gif" handleSettingDifficulty={() => handleSettingDifficulty(types.GameDifficulty.MEDIUM)} selectedDifficultyIndex={selectedDifficultyIndex}/>
        <CarouselPanel text="Hard" image="/assets/difficulty/squirtle.gif" handleSettingDifficulty={() => handleSettingDifficulty(types.GameDifficulty.HARD)} selectedDifficultyIndex={selectedDifficultyIndex}/>
      </div>
      <button type="button" className="difficultyNavButtonRight difficultyNavButton pixelFontStyle" onClick={onNextClick}>Next</button>
    </div>
    
  );
};
export default Difficulty;

import { Link } from "react-router-dom";

const About = () => {
  const GITHUB_LOGO_BLACK = "/assets/mainScreen/github-mark.svg";
  const GITHUB_LOGO_WHITE = "/assets/mainScreen/github-mark-white.svg";

  const handleMouseOver = (event) => {
    event.target.src = GITHUB_LOGO_WHITE;
  };

  const handleMouseOut = (event) => {
    event.target.src = GITHUB_LOGO_BLACK;
  };

  return (
    <div className="aboutSection">
      <span className="pixelFontStyle">Created by Loveleen Chaudhari </span>
      <Link to="https://github.com/loveleenc/tic-tac-toe-web" target="_blank">
        <img
          onMouseOver={() => handleMouseOver(event)}
          onMouseOut={() => handleMouseOut(event)}
          src={GITHUB_LOGO_BLACK}
        />
      </Link>
    </div>
  );
};

export default About;

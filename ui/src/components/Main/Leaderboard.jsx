import { useEffect, useState } from "react";
import scoreAPI from "../../services/scoreAPI.js";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    scoreAPI.getScores()
      .then(response => {
        setScores(response.data);
      })
      .catch(response => {
        setScores([])
      })
  }, []);


  const getScores = () => scores.length !== 0 ? scores.map((score) => (
          <tr>
            <td>{score.user}</td>
            <td>{score.wins}</td>
            <td>{score.losses}</td>
            <td>{score.ties}</td>
          </tr>
        )) : <tr><td colSpan="4">Unable to fetch scores. Please try again later.</td></tr>;


  return (
    <div className="pixelFontStyle">
      <table className="leaderboardTable">
        <caption>
          Leaderboard
        </caption>
        <tbody>
        <tr>
          <th>Player</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Draws</th>
        </tr>
        {getScores()}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

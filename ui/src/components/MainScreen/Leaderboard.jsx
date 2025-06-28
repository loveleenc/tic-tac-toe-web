import { useEffect, useState } from "react";
import scoreAPI from "../../services/scoreAPI.js";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    scoreAPI.getScores()
      .then(response => {
        setScores(response.data);
      })
  }, []);

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
        {/* <tr>
          <td>zoro</td>
          <td>4</td>
          <td>1</td>
          <td>1</td>
        </tr>
        <tr>
          <td>luffy</td>
          <td>3</td>
          <td>2</td>
          <td>8</td>
        </tr> */}
        {scores.map((score) => (
          <tr>
            <td>{score.user.name}</td>
            <td>{score.wins}</td>
            <td>{score.losses}</td>
            <td>{score.ties}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

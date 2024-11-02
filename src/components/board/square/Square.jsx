import "./square.css";

function Square({ rank, file, color }) {
  const is1stRank = rank === 1;
  const isHFile = file === "h";

  return (
    <div className={`square ${color}`} data-coord={`${file}${rank}`}>
      {is1stRank && <span className="label rank">{file}</span>}
      {isHFile && <span className="label file">{rank}</span>}
    </div>
  );
}

export default Square;

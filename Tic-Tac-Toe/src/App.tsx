import { useState, useEffect } from 'react';
import Board from './components/Board';
import './index.css';

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isComputerTurn, setIsComputerTurn] = useState(false);

  const handleClick = (i: number) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = 'X'; // 玩家总是 'X'
    setSquares(newSquares);
    setIsXNext(false);
    setIsComputerTurn(true); // 玩家下完后轮到电脑
  };

  const computerMove = () => {
    const newSquares = squares.slice();
    let move = findBestMove(newSquares);
    if (move !== -1) {
      newSquares[move] = 'O'; // 电脑总是 'O'
      setSquares(newSquares);
      setIsXNext(true);
    }
    setIsComputerTurn(false); // 电脑下完后轮到玩家
  };

  // 使用 useEffect 监听电脑的回合
  useEffect(() => {
    if (isComputerTurn && !calculateWinner(squares)) {
      setTimeout(computerMove, 500); // 延迟 500ms 模拟电脑思考
    }
  }, [isComputerTurn, squares]);

  function findBestMove(squares: string[]): number {
    // 1. 检查电脑是否可以立即获胜
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const newSquares = squares.slice();
        newSquares[i] = 'O';
        if (calculateWinner(newSquares)?.winner === 'O') {
          return i;
        }
      }
    }

    // 2. 阻止玩家获胜
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const newSquares = squares.slice();
        newSquares[i] = 'X';
        if (calculateWinner(newSquares)?.winner === 'X') {
          return i;
        }
      }
    }

    // 3. 随机选择一个空位
    const emptySquares = squares
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);
    if (emptySquares.length > 0) {
      return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    return -1; // 没有空位
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner.winner}`
    : `Next player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={handleClick} winnerLine={winner ? winner.line : []}/>
      </div>
      <div className="game-info">
        <div>{status}</div>
      </div>
    </div>
  );
}

function calculateWinner(squares: string[]): {winner: string, line: number[]} | null {
  const lines = [
    [0, 1, 2], // 第一行
    [3, 4, 5], // 第二行
    [6, 7, 8], // 第三行
    [0, 3, 6], // 第一列
    [1, 4, 7], // 第二列
    [2, 5, 8], // 第三列
    [0, 4, 8], // 主对角线
    [2, 4, 6], // 副对角线
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default App;
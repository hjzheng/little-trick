import { useState, useEffect } from 'react';
import Board from './components/Board';
import './index.css';

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // 玩家先手
  const [isComputerTurn, setIsComputerTurn] = useState(false); // 电脑先手

  // 玩家点击格子的处理函数
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

  // 电脑下棋的逻辑
  const computerMove = () => {
    const newSquares = squares.slice();
    const move = findBestMove(newSquares); // 使用 Minimax 找到最佳移动
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

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : squares.every((square) => square !== null)
      ? 'Draw!'
      : `Next player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={handleClick}  winnerLine={[]}/>
      </div>
      <div className="game-info">
        <div>{status}</div>
      </div>
    </div>
  );
}

// Minimax 算法实现
type Squares = (string | null)[];

function minimax(squares: Squares, depth: number, isMaximizing: boolean): number {
  const winner = calculateWinner(squares);
  if (winner === 'O') return 10 - depth; // AI 获胜
  if (winner === 'X') return depth - 10; // 玩家获胜
  if (squares.every((square) => square !== null)) return 0; // 平局

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O'; // AI 下棋
        const score = minimax(squares, depth + 1, false);
        squares[i] = null; // 撤销移动
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'X'; // 玩家下棋
        const score = minimax(squares, depth + 1, true);
        squares[i] = null; // 撤销移动
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// 找到最佳移动
interface FindBestMove {
  (squares: (string | null)[]): number;
}

const findBestMove: FindBestMove = (squares) => {
  let bestMove = -1;
  let bestScore = -Infinity;
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = 'O'; // AI 下棋
      const score = minimax(squares, 0, false);
      squares[i] = null; // 撤销移动
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

// 判断是否有玩家获胜
interface CalculateWinner {
  (squares: (string | null)[]): string | null;
}

const calculateWinner: CalculateWinner = (squares) => {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
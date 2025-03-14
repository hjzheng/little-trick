
import Square from './Square';

type Props = {
    squares: string[];
    onClick: (i: number) => void;
    winnerLine: number[];
};
function Board({ squares, onClick, winnerLine }: Props) {
    const renderSquare = (i: number) => {
        const isWinnerSquare = winnerLine.includes(i);
        return <Square value={squares[i]} onClick={() => onClick(i)} isWinningSquare={isWinnerSquare} />;
    };

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

export default Board;
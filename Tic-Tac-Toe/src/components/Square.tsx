type Props = {
    value: string;
    onClick: () => void;
    isWinningSquare: boolean;
};
function Square({ value, onClick, isWinningSquare }: Props) {
    return (
        <button  onClick={onClick} className={`square ${isWinningSquare ? 'winning-square' : ''}`}>
            {value}
        </button>
    );
}

export default Square;
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const shuffleButton = document.getElementById('shuffle-button');
    const gridSize = 3;
    const imageUrl = 'asd.jpg'; // User's image
    let tiles = [];

    function createTiles() {
        tiles = [];
        for (let i = 1; i < gridSize * gridSize; i++) {
            tiles.push(i);
        }
        tiles.push(null); // Represents the empty space
    }

    function shuffleTiles() {
        // Start with a solved puzzle to ensure it's solvable
        createTiles();

        // Perform a large number of valid random moves to shuffle
        let emptyIndex = tiles.indexOf(null);
        for (let i = 0; i < 150; i++) { // Increased shuffle intensity
            const neighbors = [];
            const { row, col } = getRowCol(emptyIndex);

            // Find valid neighbors
            if (row > 0) neighbors.push(emptyIndex - gridSize); // Up
            if (row < gridSize - 1) neighbors.push(emptyIndex + gridSize); // Down
            if (col > 0) neighbors.push(emptyIndex - 1); // Left
            if (col < gridSize - 1) neighbors.push(emptyIndex + 1); // Right

            // Pick a random neighbor and swap
            const randomIndex = Math.floor(Math.random() * neighbors.length);
            const neighborIndex = neighbors[randomIndex];
            
            [tiles[emptyIndex], tiles[neighborIndex]] = [tiles[neighborIndex], tiles[emptyIndex]];
            emptyIndex = neighborIndex;
        }
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        tiles.forEach((tileValue, index) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            if (tileValue === null) {
                tile.classList.add('empty');
            } else {
                // Set background image and position to show the correct piece
                const correctIndex = tileValue - 1;
                const col = correctIndex % gridSize;
                const row = Math.floor(correctIndex / gridSize);
                tile.style.backgroundImage = `url(${imageUrl})`;
                tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            }

            tile.addEventListener('click', () => handleTileClick(index));
            gameBoard.appendChild(tile);
        });
    }

    function handleTileClick(clickedIndex) {
        const emptyIndex = tiles.indexOf(null);
        const { row: clickedRow, col: clickedCol } = getRowCol(clickedIndex);
        const { row: emptyRow, col: emptyCol } = getRowCol(emptyIndex);

        // Check if the clicked tile is adjacent to the empty tile
        if (Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol) === 1) {
            // Swap tiles
            [tiles[clickedIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[clickedIndex]];
            renderBoard();
            checkWin();
        }
    }

    function getRowCol(index) {
        return {
            row: Math.floor(index / gridSize),
            col: index % gridSize
        };
    }

    function checkWin() {
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] !== i + 1) {
                return; // Not solved yet
            }
        }
        if (tiles[tiles.length - 1] === null) {
            setTimeout(() => alert('You win!'), 100); // Use timeout to allow board to render
        }
    }

    function init() {
        // shuffleTiles now creates the initial puzzle state
        shuffleTiles();
        renderBoard();
    }

    shuffleButton.addEventListener('click', init);

    init();
});

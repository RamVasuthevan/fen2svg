function fenToSvg() {
    const fenInput = document.getElementById('fenInput').value;
    const board = parseFen(fenInput);
    const svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = generateSvg(board, 100); // Increased size parameter
}

function parseFen(fen) {
    const pieces = { 'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔' };
    const rows = fen.split(' ')[0].split('/');
    const board = rows.map(row => row.replace(/\d/g, digit => ' '.repeat(digit)).split('').map(piece => pieces[piece] || ''));
    return board;
}

function generateSvg(board, size) {
    const svgStart = `<svg viewBox="0 0 ${size * 8} ${size * 8}" xmlns="http://www.w3.org/2000/svg">`;
    let squares = '';
    let pieceId = 0; // Unique identifier for each piece

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const color = (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863';
            squares += `<rect x="${j * size}" y="${i * size}" width="${size}" height="${size}" fill="${color}"/>`;
            if (board[i][j]) {
                squares += `<text id="piece-${pieceId++}" x="${j * size + size / 2}" y="${i * size + size / 2}" font-size="${size / 2}" font-family="Arial" fill="black" dominant-baseline="central" text-anchor="middle" draggable="true">${board[i][j]}</text>`;
            }
        }
    }

    return `${svgStart}${squares}</svg>`;
}

function downloadSvg() {
    const fileNamePrefix = "FEN2SVG"
    const fenInput = document.getElementById('fenInput').value;
    const safeFilename = fenInput.split(' ')[0] // Take the position part of the FEN
                               .replace(/\//g, '_') // Replace slashes with underscores
                               .replace(/\s+/g, '_'); // Replace spaces with underscores
    const svgElement = document.getElementById('svgContainer').innerHTML;
    const blob = new Blob([svgElement], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileNamePrefix}_${safeFilename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.onload = function() {
    fenToSvg();
    setTimeout(setupDragAndDrop, 100); // Delay to ensure SVG is fully loaded
};

function setupDragAndDrop() {
    const pieces = document.querySelectorAll('[id^="piece-"]'); // Select all pieces
    pieces.forEach(piece => {
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
}

function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(id);
    const svgRect = document.getElementById('svgContainer').getBoundingClientRect();
    const x = e.clientX - svgRect.left - piece.getBoundingClientRect().width / 2;
    const y = e.clientY - svgRect.top - piece.getBoundingClientRect().height / 2;
    piece.setAttribute('x', x);
    piece.setAttribute('y', y);
}

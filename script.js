function fenToSvg() {
    const fenInput = document.getElementById('fenInput').value;
    const board = parseFen(fenInput);
    const svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = generateSvg(board, 100); // Increased size parameter

    // Update URL with the current FEN string
    const encodedFen = encodeURIComponent(fenInput);
    window.history.pushState({}, '', `?fen=${encodedFen}`);
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

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const color = (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863';
            squares += `<rect x="${j * size}" y="${i * size}" width="${size}" height="${size}" fill="${color}"/>`;
            if (board[i][j]) {
                squares += `<text x="${j * size + size / 2}" y="${i * size + size / 2}" font-size="${size / 2}" font-family="Arial" fill="black" dominant-baseline="central" text-anchor="middle">${board[i][j]}</text>`;
            }
        }
    }

    return `${svgStart}${squares}</svg>`;
}

function downloadSvg() {
    const fileNamePrefix = "FEN2SVG";
    const fenInput = document.getElementById('fenInput').value;
    const safeFilename = encodeFen(fenInput);
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

function encodeFen(fen) {
    return fen.replace(/\//g, '_') // Replace slashes with underscores
                .replace(/\s+/g, '_'); // Replace spaces with underscores

}

function decodeFen(fen) {
    return fen.replace(/_/g, '/')
            .replace(/_/g, ' ');
}

window.onload = function() {
    // Parse FEN string from URL and update input field
    const params = new URLSearchParams(window.location.search);
    const fen = params.get('fen');
    if (fen) {
        document.getElementById('fenInput').value = decodeURIComponent(fen);
    }

    // Convert FEN to SVG
    fenToSvg();
};
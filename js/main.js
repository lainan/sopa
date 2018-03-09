/*
AUTOR: Adrián Expósito Tofano
*/

/* global $, getRandomInt */


'use strict';

var cellSize = 32;
var rowSize = 0;
var totalCells = 0;
var gridBorderSize = 2;
var grid = $('#grid');

function createGrid() {
    $('#size').removeClass('invalid');

    var words = $('#words').val().split(' ');
    $.each(words, function(i) {
        words[i] = words[i].toUpperCase();
    });
    rowSize = $('#size').val();
    totalCells = rowSize * rowSize;


    // Check words
    var error = false;
    var totalLetters = 0;
    for (var i = 0; i < words.length; i++) {
        if (words[i].length > rowSize) {
            error = true;
            break;
        }
        totalLetters += words[i].length;
    }
    if (totalLetters > totalCells) {
        error = true;
    }
    if (error) {
        $('#size').addClass = 'invalid';
    }


    // Set size of grid
    grid.css('width', (rowSize * cellSize) + (gridBorderSize * 2) + 'px');
    grid.css('border', gridBorderSize + 'px solid black');


    // Clean grid
    $('.letter').remove();
    $('.cell').remove();
    for (let i = 0; i < totalCells; i++) {
        grid.append('<div class="cell" title="' + i + '"><span class="letter"></span></div>');
    }

    cleanGrid();

    // Fill cells with words
    var tries = 0;
    var maxTries = $('#tries-process').val();

    while (tries < maxTries) {
        var done = fillCells(words);
        if (done) {
            console.log('¡CONSEGUIDO!');
            return;
        } else {
            tries += 1;
            console.warn('¡INTENTO FALLIDO!');
            cleanGrid();
        }
    }
    console.warn('IMPOSIBLE!');
    cleanGrid();
}

function fillCells(words) {
    var cells = $('.cell');
    var index = 0;
    var taken = {
        positions: [],
        letters: []
    };
    var tries = 0;
    var maxTries = $('#tries-word').val();
    var tryWords = words.slice();
    while (tryWords.length > 0) {
        var nextWord = {
            positions: [],
            letters: []
        };
        nextWord.positions = getPositions(tryWords[index]);
        nextWord.letters = tryWords[index].split('');
        if (checkCollisions(taken, nextWord)) {
            console.warn('¡COLISIÓN!');
            tries += 1;
        } else {
            taken.positions = taken.positions.concat(nextWord.positions);
            taken.letters = nextWord.letters.concat(taken.letters);
            for (let i = 0; i < nextWord.positions.length; i++) {
                cells.eq(nextWord.positions[i]).addClass('green');
                cells.eq(nextWord.positions[i]).find('.letter').text(tryWords[index].charAt(i));
            }
            tryWords.splice(index, 1);
            tries = 0;
        }
        if (tries >= maxTries) {
            return false; // break;
        }
    }
    return true;
}

function cleanGrid() {
    $('.cell').removeClass('green');
    $('.letter').each(function() {
        $(this).text(getRandomLetter());
    });
}

function checkCollisions(placed, next) {
    var collisions = next.positions.filter(x => placed.positions.includes(x));
    var solapamiento = false;
    for (var i = 0; i < collisions.length; i++) {
        var index = next.positions.indexOf(collisions[i]);
        if (placed.letters[index] !== next.letters[index]) {
            return true;
        } else {
            solapamiento = true;
        }
    }
    if (solapamiento) {
        console.log('¡SOLAPAMIENTO!');
    }
    return false;
}




function getPositions(word) {
    var wordSize = word.length;
    var directions = ['horizontal', 'vertical', 'diagonal'];
    var direction = directions[getRandomInt(0, 2)];
    var initial = getInitialPosition(word, direction);
    var positions = [initial];

    switch (direction) {
        case 'horizontal':
            for (let i = 1; i < wordSize; i++) {
                let nextPosition = initial + i;
                positions.push(nextPosition);
            }
            break;
        case 'vertical':
            for (let i = 1; i < wordSize; i++) {
                let nextPosition = initial + (i * rowSize);
                positions.push(nextPosition);
            }
            break;
        case 'diagonal':
            for (let i = 1; i < wordSize; i++) {
                let nextPosition = initial + (i * rowSize) + i;
                positions.push(nextPosition);
            }
            break;
    }
    return positions;
}

function getInitialPosition(word, direction) {
    var position = getRandomInt(0, totalCells - 1);
    var wordSize = word.length;
    var delta = rowSize - wordSize;


    var total = Array.from(Array(totalCells).keys());
    var vertical = total.filter(x => x < (rowSize * (delta + 1)));
    var horizontal = total.filter(x => getRow(x + wordSize - 1) === getRow(x));
    var diagonal = vertical.filter(x => horizontal.includes(x));

    switch (direction) {
        case 'horizontal':
            position = horizontal[getRandomInt(0, horizontal.length - 1)];
            break;
        case 'vertical':
            position = vertical[getRandomInt(0, vertical.length - 1)];
            break;
        case 'diagonal':
            position = diagonal[getRandomInt(0, diagonal.length - 1)];
            break;
    }


    return position;
}

function getRandomLetter() {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÑ';
    var letter = possible.charAt(Math.floor(Math.random() * possible.length));
    return letter;
}

function getRow(position) {
    return Math.floor(position / rowSize);
}



function start() {
    $('#btn-create').on('click', createGrid);
}

$(document).ready(start);

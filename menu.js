
const gridContainer = document.getElementById('gridContainer');
const boldIcon = document.getElementById('boldIcon');
const italicIcon = document.getElementById('italicIcon');
const underlineIcon = document.getElementById('underlineIcon');
const leftAlignIcon = document.querySelector('.fa-align-left');
const centerAlignIcon = document.querySelector('.fa-align-center');
const rightAlignIcon = document.querySelector('.fa-align-right');
const fontSizeInput = document.querySelector('.font_size_input');
const fontFamilyInput = document.querySelector('.font_family_input');
const textColorIcon = document.getElementById('textColorIcon');
const backgroundColorIcon = document.getElementById('backgroundColorIcon');
const textColorInput = document.getElementById('textColorInput');
const backgroundColorInput = document.getElementById('backgroundColorInput');
let selectedText = null;

// Initialize an empty note when the page loads
addNote();

// Note management: Add and delete all notes
document.getElementById('addNoteButton').addEventListener('click', addNote);
document.getElementById('deleteNoteButton').addEventListener('click', () => gridContainer.innerHTML = '');

// Text formatting event listeners
boldIcon.addEventListener('click', () => document.execCommand('bold'));
italicIcon.addEventListener('click', () => document.execCommand('italic'));
underlineIcon.addEventListener('click', () => document.execCommand('underline'));

leftAlignIcon.addEventListener('click', () => document.execCommand('justifyLeft'));
centerAlignIcon.addEventListener('click', () => document.execCommand('justifyCenter'));
rightAlignIcon.addEventListener('click', () => document.execCommand('justifyRight'));

fontSizeInput.addEventListener('change', () => {
    document.execCommand('fontSize', false, '7');  // Temporary large size to catch and adjust via CSS
    document.querySelectorAll("font[size='7']").forEach(font => {
        font.removeAttribute("size");
        font.style.fontSize = `${fontSizeInput.value}px`;
    });
});

fontFamilyInput.addEventListener('change', () => {
    document.execCommand('fontName', false, fontFamilyInput.value);
});

textColorIcon.addEventListener('click', () => textColorInput.click());
backgroundColorIcon.addEventListener('click', () => backgroundColorInput.click());

textColorInput.addEventListener('input', () => {
    document.execCommand('foreColor', false, textColorInput.value);
});

backgroundColorInput.addEventListener('input', () => {
    document.execCommand('backColor', false, backgroundColorInput.value);
});

// Function to add a new note
function addNote() {
    const noteContainer = document.createElement('div');
    noteContainer.className = 'note-container';

    const note = document.createElement('div');
    note.className = 'note';
    note.setAttribute('contenteditable', 'true');
    note.innerHTML = 'Write your note here...';

    // Add event listener to highlight terms when editing
    note.addEventListener('blur', () => {
        highlightTerms(note);
    });

    // Pin button
    const pinButton = document.createElement('i');
    pinButton.className = 'fas fa-thumbtack pin-button';
    pinButton.addEventListener('click', () => togglePin(noteContainer));

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', () => noteContainer.remove());

    // Append all elements to note container
    noteContainer.appendChild(pinButton);
    noteContainer.appendChild(note);
    noteContainer.appendChild(deleteButton);

    // Append note to the grid container
    gridContainer.appendChild(noteContainer);
}

// Function to toggle the pinning of a note
function togglePin(noteContainer) {
    noteContainer.classList.toggle('pinned');

    // Move the pinned note to the top
    if (noteContainer.classList.contains('pinned')) {
        gridContainer.prepend(noteContainer); // Move to the top
    } else {
        // If unpinned, find the next unpinned note and place it after that
        const nextSibling = noteContainer.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('pinned')) {
            gridContainer.insertBefore(noteContainer, nextSibling);
        } else {
            gridContainer.appendChild(noteContainer); // Move it to the bottom if no pinned note below
        }
    }
}

// Function to highlight terms
const keywords = ['AI', 'machine learning', 'deep learning', 'data science', 'neural networks','computer vision'];

// Function to highlight terms in the note content
async function highlightTerms(note) {
    let content = note.innerHTML;

    for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        content = content.replace(regex, `<span class="highlighted" data-keyword="${keyword}">${keyword}</span>`);
    }
    
    note.innerHTML = content;

    // Add tooltip functionality for highlighted terms
    const highlightedElements = note.querySelectorAll('.highlighted');
    for (const element of highlightedElements) {
        element.addEventListener('mouseenter', async () => {
            const keyword = element.getAttribute('data-keyword');
            const definition = await getKeywordDefinition(keyword);

            // Show the tooltip with the definition
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = definition;
            tooltip.style.display = 'block';
            tooltip.style.top = `${element.getBoundingClientRect().top + window.scrollY}px`;
            tooltip.style.left = `${element.getBoundingClientRect().left + window.scrollX}px`;
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none'; // Hide tooltip when mouse leaves
        });
    }
}

// Your existing getKeywordDefinition function should remain the same
async function getKeywordDefinition(keyword) {
    const response = await fetch('http://localhost:5000/get-definition', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.definition;
}

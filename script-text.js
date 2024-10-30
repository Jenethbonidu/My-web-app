// Get DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('imageInput');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');


// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

// Remove highlight when item is dragged away
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Prevent default behaviors
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight the drop area
function highlight() {
    dropArea.classList.add('highlight');
}

// Remove highlight from the drop area
function unhighlight() {
    dropArea.classList.remove('highlight');
}

// Handle dropped files
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length) {
        fileInput.files = files; // Set the file input
        extractText(getActiveLang()); // Extract text for the active language
    }
}

// Function to get the active language (default to English)
function getActiveLang() {
    return document.querySelector('.btn.active')?.getAttribute('data-lang') || 'eng';
}

// Function to extract text based on selected language
function extractText(lang) {
    const imageFile = fileInput.files[0];

    // Check if an image is selected
    if (!imageFile) {
        resultDiv.textContent = 'Please select an image first.';
        return;
    }

    // Show loading indicator
    loadingDiv.style.display = 'block'; // Show loading text
    resultDiv.textContent = ''; // Clear previous result

    // Read the image file
    const reader = new FileReader();
    reader.onload = () => {
        // Use Tesseract.js to perform OCR
        Tesseract.recognize(reader.result, lang, {
            logger: (m) => console.log(m) // Optional: log progress
        }).then(({ data: { text } }) => {
            loadingDiv.style.display = 'none'; // Hide loading text
            resultDiv.textContent = text; // Display extracted text
        }).catch(error => {
            loadingDiv.style.display = 'none'; // Hide loading text
            resultDiv.textContent = 'Error occurred during text extraction.';
            console.error(error);
        });
    };
    reader.readAsDataURL(imageFile); // Read the image as a data URL
}

// Add click event listeners to language buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});





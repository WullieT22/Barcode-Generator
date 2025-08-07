# Barcode Generator

This project is a simple web application that generates Code 39 (3 of 9 extended) barcodes from user-input text and displays the corresponding text underneath the barcode.

## Project Structure

```
barcode-generator
├── src
│   ├── index.html        # Main HTML document
│   ├── styles
│   │   └── main.css      # CSS styles for the project
│   ├── scripts
│   │   └── app.js        # Main JavaScript file for handling user interactions
│   └── utils
│       └── barcode-generator.js # Utility for generating barcodes
├── package.json           # npm configuration file
└── README.md              # Project documentation
```

## Getting Started

To get started with the Barcode Generator project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd barcode-generator
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then run:
   ```
   npm install
   ```

3. **Open the project**:
   Open the `src/index.html` file in your web browser to view the application.

## Usage

1. Enter the text you want to convert into a barcode in the input field (one line per barcode).
2. Optionally, add a header text for the PDF export.
3. Click the "Generate Barcodes" button.
4. The generated barcodes will be displayed using the Code 39 font along with the text below each barcode.
5. Click "Export to PDF" to save all barcodes to a PDF file.

## Code 39 Barcode Specifications

- Supports characters: A-Z, 0-9, and special characters: - . $ / + % SPACE
- Text is automatically converted to uppercase
- Start and stop characters (*) are automatically added
- Uses the "Libre Barcode 39 Extended Text" font from Google Fonts

## Dependencies

This project uses:
- **Libre Barcode 39 Extended Text** font from Google Fonts for barcode display
- **jsPDF** library for PDF generation
- **live-server** for development server

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.
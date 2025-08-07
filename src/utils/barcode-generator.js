function generateBarcode(text) {
    // Format text for Code 39 barcode
    // Code 39 supports: A-Z, 0-9, and special characters: - . $ / + % SPACE
    // Start and stop characters are asterisks (*)
    
    // Convert to uppercase and validate characters
    const validChars = /^[A-Z0-9\-\.\$\/\+\%\s]*$/;
    const upperText = text.toUpperCase();
    
    if (!validChars.test(upperText)) {
        throw new Error('Invalid characters for Code 39 barcode. Only A-Z, 0-9, and - . $ / + % SPACE are allowed.');
    }
    
    // Add start and stop characters
    const barcodeText = `*${upperText}*`;
    
    return Promise.resolve(barcodeText);
}

module.exports = generateBarcode;
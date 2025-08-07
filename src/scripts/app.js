document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const generateButton = document.getElementById('generateButton');
    const exportPdfButton = document.getElementById('exportPdfButton');
    const barcodeDisplay = document.getElementById('barcodeDisplay');
    
    let barcodeData = [];

    generateButton.addEventListener('click', generateBarcodes);
    exportPdfButton.addEventListener('click', exportToPDF);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBarcodes();
        }
    });

    function generateBarcodes() {
        const text = userInput.value.trim();
        
        if (text === '') {
            alert('Please enter some text to generate barcodes');
            return;
        }

        // Split text by lines and filter out empty lines
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
            alert('Please enter at least one line of text');
            return;
        }

        // Clear previous results
        barcodeDisplay.innerHTML = '';
        barcodeData = [];

        // Generate barcodes for each line
        lines.forEach((line, index) => {
            createBarcodeItem(line.trim(), index);
        });

        // Show export button
        exportPdfButton.style.display = 'inline-block';
    }

    function createBarcodeItem(text, index) {
        // Format text for Code 39 barcode (add start/stop characters)
        const barcodeText = `*${text.toUpperCase()}*`;
        
        const barcodeItem = document.createElement('div');
        barcodeItem.className = 'barcode-item';
        barcodeItem.id = `barcode-item-${index}`;
        
        const barcodeElement = document.createElement('div');
        barcodeElement.className = 'barcode-display';
        barcodeElement.id = `barcode-${index}`;
        barcodeElement.textContent = barcodeText;
        barcodeElement.title = `Barcode ${index + 1}`;
        
        barcodeItem.appendChild(barcodeElement);
        barcodeDisplay.appendChild(barcodeItem);
        
        // Store data for PDF export
        barcodeData.push({
            text: text,
            barcodeText: barcodeText,
            elementId: `barcode-${index}`
        });
    }

    function exportToPDF() {
        if (barcodeData.length === 0) {
            alert('Please generate barcodes first');
            return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const headerHeight = 40; // Space reserved for header
        
        // Get header text
        const headerInput = document.getElementById('headerInput');
        const headerText = headerInput.value.trim();
        
        // Process barcodes sequentially using html2canvas - one per page
        async function processBarcodes() {
            try {
                for (let i = 0; i < barcodeData.length; i++) {
                    const item = barcodeData[i];
                    
                    // Add new page for each barcode (except the first one)
                    if (i > 0) {
                        pdf.addPage();
                    }
                    
                    // Add header to each page
                    if (headerText) {
                        pdf.setFontSize(32);
                        pdf.setFont(undefined, 'bold');
                        pdf.text(headerText, pageWidth / 2, margin + 20, { align: 'center' });
                    }
                    
                    // Center the barcode on the page
                    const availableHeight = pageHeight - margin * 2 - headerHeight;
                    
                    // Get the barcode element and convert to image using html2canvas
                    const barcodeElement = document.getElementById(item.elementId);
                    if (barcodeElement) {
                        try {
                            const canvas = await html2canvas(barcodeElement, {
                                backgroundColor: null,
                                scale: 4, // Higher scale for bigger, clearer barcodes
                                useCORS: true,
                                allowTaint: true
                            });
                            
                            const barcodeImageData = canvas.toDataURL('image/png');
                            
                            // Calculate barcode dimensions - make it much bigger
                            const maxBarcodeWidth = pageWidth - (margin * 2);
                            const barcodeHeight = 80; // Increased height
                            const barcodeWidth = Math.min(maxBarcodeWidth, 160); // Increased width
                            
                            // Center the barcode horizontally and vertically on the page
                            const barcodeX = (pageWidth - barcodeWidth) / 2;
                            const barcodeY = margin + headerHeight + (availableHeight - barcodeHeight) / 2;
                            
                            pdf.addImage(barcodeImageData, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
                            
                            // Add the original text below the barcode
                            const textY = barcodeY + barcodeHeight + 20;
                            pdf.setFontSize(16);
                            pdf.setFont(undefined, 'normal');
                            pdf.text(item.text, pageWidth / 2, textY, { align: 'center' });
                            
                        } catch (error) {
                            console.error('Error capturing barcode:', error);
                            // Fallback: use text if image capture fails
                            pdf.setFont('courier', 'normal');
                            pdf.setFontSize(24);
                            const barcodeY = margin + headerHeight + availableHeight / 2;
                            pdf.text(item.barcodeText, pageWidth / 2, barcodeY, { align: 'center' });
                            
                            // Add the original text below
                            pdf.setFontSize(16);
                            pdf.setFont(undefined, 'normal');
                            pdf.text(item.text, pageWidth / 2, barcodeY + 30, { align: 'center' });
                        }
                    }
                }
                
                pdf.save('barcodes.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert(`Error generating PDF: ${error.message}`);
            }
        }
        
        // Start processing
        processBarcodes();
    }
});
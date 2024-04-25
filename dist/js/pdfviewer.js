// Function to render PDF dynamically
function renderPDF(pdfUrl, containerId) {
    // PDF.js configuration
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // Load PDF document
    const pdfContainer = document.getElementById(containerId);

    pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc) {
        let promises = [];

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            // Create a function to handle the page rendering that captures the current pageNum
            let promise = pdfDoc.getPage(pageNum).then(function(page) {
                const viewport = page.getViewport({ scale: 1 });
                const scale = pdfContainer.clientWidth / (viewport.width + 10);
                const scaledViewport = page.getViewport({ scale: scale });

                const canvas = document.createElement('canvas');
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                const context = canvas.getContext('2d');
                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };

                return page.render(renderContext).promise.then(function() {
                    return canvas;
                });
            });
            promises.push(promise);
        }

        // Ensure the pages are added in the correct order
        Promise.all(promises).then(function(canvases) {
            canvases.forEach(function(canvas) {
                pdfContainer.appendChild(canvas);
            });
        });
    });
}
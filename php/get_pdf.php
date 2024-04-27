<?php
// Get the filename from the query string
$filename = isset($_GET['file']) ? $_GET['file'] : '';

// Set the Content-Disposition header to force download
header('Content-Disposition: inline; filename="' . $filename . '"');

// Serve the PDF file
readfile('assets/pdfs/' . $filename);
?>

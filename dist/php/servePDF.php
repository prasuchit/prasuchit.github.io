<?php
// Set the Content-Disposition header
header('Content-Disposition: inline; filename="IRL-primer"');

// Serve the PDF file
readfile('../assets/pdfs/IRL-primer.pdf');
?>

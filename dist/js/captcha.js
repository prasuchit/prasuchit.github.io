document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const token = grecaptcha.getResponse();
    if (!token) {
    alert('Please complete the reCAPTCHA');
    return;
    }

    const response = await fetch('/.netlify/js/validate-recaptcha', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
    });

    const data = await response.json();
    if (data.message === 'Human verified') {
    // Proceed with form submission or other logic
    alert('Human verified');
    // You can submit the form data to your backend here
    } else {
    alert('Human verification failed');
    }
    });
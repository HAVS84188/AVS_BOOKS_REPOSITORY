document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    form.insertAdjacentElement('afterend', status);

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        status.hidden = false;
        status.textContent = 'Sending your feedback…';
        status.classList.remove('success', 'error');
        submitButton.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            form.reset();
            status.textContent = 'Thank you! Your feedback has been submitted successfully.';
            status.classList.add('success');
        } catch (error) {
            status.textContent = 'Sorry, your feedback could not be submitted. Please try again.';
            status.classList.add('error');
        } finally {
            submitButton.disabled = false;
        }
    });
});

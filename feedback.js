document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    form.insertAdjacentElement('afterend', status);

    form.addEventListener('submit', async event => {
        event.preventDefault();
        status.hidden = false;
        status.textContent = 'Sending your feedback…';
        submitButton.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('The form service returned an error.');
            }

            form.reset();
            status.textContent = 'Thank you! Your feedback has been submitted.';
        } catch (error) {
            status.textContent = 'Sorry, your feedback could not be submitted. Please try again.';
        } finally {
            submitButton.disabled = false;
        }
    });
});

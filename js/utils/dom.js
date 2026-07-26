export function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

export function clearError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.style.display = 'none';
    }
}

export function setLoading(buttonId, isLoading) {
    const btn = document.getElementById(buttonId);
    if (btn) {
        // Store the original text the FIRST time this is called
        if (!btn.dataset.originalText) {
            btn.dataset.originalText = btn.textContent;
        }
        
        btn.disabled = isLoading;
        btn.textContent = isLoading ? 'Processing...' : btn.dataset.originalText;
    }
}
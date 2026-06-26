(function() {
    let currentVersion = null;
    const POLLING_INTERVAL = 30000; // 30 seconds

    async function checkVersion() {
        try {
            const res = await fetch('/version.json?t=' + new Date().getTime());
            if (!res.ok) return;
            const data = await res.json();
            
            if (currentVersion === null) {
                currentVersion = data.version;
            } else if (currentVersion !== data.version) {
                console.log("Nueva versión detectada:", data.version);
                saveFormState();
                showUpdatePopup();
                setTimeout(() => {
                    window.location.reload(true);
                }, 2000);
            }
        } catch (e) {
            console.error("Error comprobando versión:", e);
        }
    }

    function saveFormState() {
        const inputs = document.querySelectorAll('input:not([type="password"]):not([type="hidden"]), textarea, select');
        const state = {};
        inputs.forEach(input => {
            if (input.id || input.name) {
                const key = input.id || input.name;
                if (input.type === 'checkbox' || input.type === 'radio') {
                    state[key] = input.checked;
                } else {
                    state[key] = input.value;
                }
            }
        });
        localStorage.setItem('lela_app_state', JSON.stringify(state));
    }

    function restoreFormState() {
        const saved = localStorage.getItem('lela_app_state');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                const inputs = document.querySelectorAll('input:not([type="password"]):not([type="hidden"]), textarea, select');
                inputs.forEach(input => {
                    if (input.id || input.name) {
                        const key = input.id || input.name;
                        if (state[key] !== undefined) {
                            if (input.type === 'checkbox' || input.type === 'radio') {
                                input.checked = state[key];
                            } else {
                                input.value = state[key];
                            }
                            // Trigger input/change event for react/vue
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                });
            } catch(e) {}
            localStorage.removeItem('lela_app_state');
        }
    }

    function showUpdatePopup() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:999999;display:flex;align-items:center;justify-content:center;color:white;font-family:sans-serif;backdrop-filter:blur(5px);transition:all 0.3s ease;';
        
        const box = document.createElement('div');
        box.style.cssText = 'background:#1e40af;padding:30px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.5);text-align:center;max-width:400px;animation: popin 0.3s ease-out;';
        
        box.innerHTML = `
            <style>
                @keyframes popin { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spinner { width:40px;height:40px;border:4px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;}
            </style>
            <div class="spinner"></div>
            <h2 style="margin:0 0 10px;font-size:24px;">Actualizando sistema...</h2>
            <p style="margin:0;opacity:0.8;font-size:14px;">Hemos detectado una nueva versión y la estamos aplicando de forma silenciosa. Tu progreso ha sido guardado.</p>
        `;
        
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', restoreFormState);
    } else {
        restoreFormState();
    }
    
    setInterval(checkVersion, POLLING_INTERVAL);
    setTimeout(checkVersion, 2000);
})();

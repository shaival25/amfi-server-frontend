export function startTimer(duration, display) {
    let timer = duration;

    const updateDisplay = () => {
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');
        display.innerHTML = `<b>${minutes}:${seconds}</b>`;
    };

    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("User ID not found in local storage");
        return;
    }

    const intervalId = setInterval(() => {
        if (timer <= 0) {
            clearInterval(intervalId);
            display.textContent = "The timer has run out!";
            fetch(`${window.baseUrl}/user-analytics/journey-ended/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Or response.text() if you expect text
                })
                .then(data => {
                    // Handle the response data if needed
                    window.location.replace('index.html');
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
            return;
        }

        updateDisplay();
        timer--;
    }, 1000);

    updateDisplay(); // Initial display update
    return intervalId;
}

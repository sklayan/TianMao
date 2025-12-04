export class BottomPanel {
    constructor(containerId, dataStream) {
        this.container = document.getElementById(containerId);
        this.dataStream = dataStream;
        this.init();
    }

    init() {
        this.container.innerHTML = `
      <div class="ticker-content" id="ticker-content">
        <!-- Events will be injected here -->
      </div>
    `;
        this.dataStream.subscribe(this.update.bind(this));
    }

    update(data) {
        const ticker = document.getElementById('ticker-content');
        // In a real app, we'd append new events. For this demo, we'll just refresh the list or add if not present
        // To keep it simple and smooth, we'll just ensure the ticker has content

        if (ticker.children.length < 10) {
            data.events.forEach(event => {
                const span = document.createElement('span');
                span.className = `ticker-item ${event.type}`;
                span.innerText = `[${event.time}] ${event.message}`;
                ticker.appendChild(span);
            });
        }
    }
}

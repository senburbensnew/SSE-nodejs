const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Endpoint for Server-Sent Events
app.get('/events', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-open');

  // Function to send events
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Example: Send periodic updates
  const intervalId = setInterval(() => {
    const event = {
      timestamp: new Date().toISOString(),
      message: 'Real-time update',
      value: Math.random()
    };
    sendEvent(event);
  }, 2000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Serve a simple HTML client for demonstration
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <body>
      <div id="events"></div>
      <script>
        const eventSource = new EventSource('http://localhost:${PORT}/events');
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          document.getElementById('events').innerHTML += 
            \`<p>Received: \${JSON.stringify(data)}</p>\`;
        };
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`SSE Server running on http://localhost:${PORT}`);
});
import express from 'express';
const app = express();
const port = process.env.PORT || 3001; // Use environment variables
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});

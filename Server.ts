import app from './App';
import dotenv from 'dotenv';


dotenv.config();
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);

});




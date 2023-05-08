import app from "./app";
import { ConnectDB } from "./config/connection";

const port = process.env.PORT || 5000;

ConnectDB();

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

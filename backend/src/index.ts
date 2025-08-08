import 'dotenv/config';
import app from './app';
import { initializeDB } from './modules/database/init';
import { getEnvOrThrow } from './common/utils/env';

async function bootstrap() {
  try {
    await initializeDB();

    const port = getEnvOrThrow('PORT');
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

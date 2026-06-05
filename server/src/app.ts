import express from 'express';
import cors from 'cors';
import { NODE_ENV, PORT } from './config';
import { errorsMiddleware } from './middlewares/errorsMiddleware';

import { authRouter } from './features/auth/auth.router';
import { usersRouter } from './features/users/users.router';
import { locationsRouter } from './features/locations/locations.router';
import { reportsRouter } from './features/reports/reports.router';
import { alertsRouter } from './features/alerts/alerts.router';
import { notificationsRouter } from './features/notifications/notifications.router';
import { accessibilitySettingsRouter } from './modules/accessibility-settings/accessibility-settings.router';
import { authMiddleware } from './middlewares/authMiddleware';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => {
  console.log(_req.query);
  res.send('SafeSteps API is running!');
});

app.use('/api/auth', authRouter);     
app.use('/api/users', usersRouter); 
app.use('/api/locations', locationsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/alerts', alertsRouter);

app.use('/api/accessibility-settings', authMiddleware, accessibilitySettingsRouter); //NUEVO DE SETTINGS

app.use('/api/notifications', authMiddleware, notificationsRouter);

app.use(errorsMiddleware);

if (NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;



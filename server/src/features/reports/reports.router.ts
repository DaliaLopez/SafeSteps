import { Router } from 'express';
import {
    getReportsController,
    getReportByIdController,
    getPendingReportsController,
    createReportController,
    updateReportStatusController,
    resolveReportController,
    getReportsByUserController,
    getUserReportStatsController,
} from './reports.controller';

export const reportsRouter = Router();

reportsRouter.get('/', getReportsController);
reportsRouter.get('/pending', getPendingReportsController);
reportsRouter.get('/:id', getReportByIdController);
reportsRouter.get('/user/:userId', getReportsByUserController);

reportsRouter.post('/', createReportController);
reportsRouter.get('/user/:userId/stats', getUserReportStatsController);

// aquí se maneja TODO (status + alerta automática)
reportsRouter.put('/status', updateReportStatusController);

// resolver reporte
reportsRouter.post('/:id/resolve', resolveReportController);


import { Router } from 'express';
import {
    getReportsController,
    getReportByIdController,
    getPendingReportsController,
    createReportController,
    updateReportStatusController,
    resolveReportController,
} from './reports.controller';

export const reportsRouter = Router();

reportsRouter.get('/', getReportsController);
reportsRouter.get('/pending', getPendingReportsController);
reportsRouter.get('/:id', getReportByIdController);

reportsRouter.post('/', createReportController);

// aquí se maneja TODO (status + alerta automática)
reportsRouter.put('/status', updateReportStatusController);

// resolver reporte
reportsRouter.post('/:id/resolve', resolveReportController);


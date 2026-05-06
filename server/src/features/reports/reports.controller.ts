import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    getReportsService,
    getReportByIdService,
    getPendingReportsService,
    createReportService,
    updateReportStatusService,
    promoteReportToAlertService,
    resolveReportService,
} from './reports.service';

import {
    ProblemType,
    DangerLevel,
    ReportStatus,
} from './reports.types';

// Obtener todos los reportes
export const getReportsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reports = await getReportsService();
        res.json(reports);
    } catch (error) {
        next(error);
    }
};

// Obtener un reporte por su id
export const getReportByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) throw Boom.badRequest('Id is required');

        const report = await getReportByIdService(id as string);
        res.json(report);
    } catch (error) {
        next(error);
    }
};

// Reportes pendientes (para admin)
export const getPendingReportsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reports = await getPendingReportsService();
        res.json(reports);
    } catch (error) {
        next(error);
    }
};

// Crear reporte
export const createReportController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            user_id,
            description,
            problem_type,
            danger_level,
            latitude,
            longitude,
        } = req.body;

        if (
            !user_id ||
            !description ||
            !problem_type ||
            !danger_level ||
            latitude === undefined ||
            longitude === undefined
        ) {
            throw Boom.badRequest('Missing fields');
        }

        if (!Object.values(ProblemType).includes(problem_type)) {
            throw Boom.badRequest('Invalid problem type');
        }

        if (!Object.values(DangerLevel).includes(danger_level)) {
            throw Boom.badRequest('Invalid danger level');
        }

        const report = await createReportService({
            user_id,
            description,
            problem_type,
            danger_level,
            latitude,
            longitude,
        });

        res.status(201).json(report);
    } catch (error) {
        next(error);
    }
};

// Cambiar estado y crear alerta automáticamente
export const updateReportStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            throw Boom.badRequest('Missing data');
        }

        if (!Object.values(ReportStatus).includes(status)) {
            throw Boom.badRequest('Invalid status');
        }

        const report = await updateReportStatusService({ id, status });

        // si el admin aprueba se crear una alerta automáticamente
        if (status === ReportStatus.APPROVED) {
            await promoteReportToAlertService(id);
        }

        res.json(report);
    } catch (error) {
        next(error);
    }
};

// Resolver reporte (apaga alerta)
export const resolveReportController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) throw Boom.badRequest('Id is required');

        const result = await resolveReportService(id as string);

        res.json(result);
    } catch (error) {
        next(error);
    }
};
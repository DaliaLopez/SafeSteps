import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    getLocationsService,
    createLocationService,
    checkIfUserIsInsideService,
    deleteLocationService,
} from './locations.service';
import { LocationType } from './locations.types'; 

// Obtener todas las zonas registradas en el sistema
export const getLocationsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const locations = await getLocationsService();
        res.json(locations);
    } catch (error) {
        next(error);
    }
};

// Crear una nueva zona (ej: un edificio o una rampa)
export const createLocationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, boundary, type, description } = req.body;

        if (!name || !boundary || !type) {
            throw Boom.badRequest('Missing fields');
        }

        if (!Object.values(LocationType).includes(type)) {
            throw Boom.badRequest('Invalid location type');
        }

        const location = await createLocationService({
            name,
            boundary,
            type,
            description,
        });

        res.status(201).json(location);
    } catch (error) {
        next(error);
    }
};

// Saber en qué zona está el usuario
export const checkLocationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            throw Boom.badRequest('latitude and longitude are required');
        }

        const result = await checkIfUserIsInsideService({
            latitude: Number(latitude),
            longitude: Number(longitude),
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Eliminar zona (solo admin)
export const deleteLocationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) throw Boom.badRequest('Id is required');

        const location = await deleteLocationService(id as string);
        console.log("Aqui llegue")
        res.json(location);
    } catch (error) {
        next(error);
    }
};
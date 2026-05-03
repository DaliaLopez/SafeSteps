import { Router } from 'express';
import {
    getLocationsController,
    createLocationController,
    checkLocationController,
    deleteLocationController,
} from './locations.controller';

export const locationsRouter = Router();

locationsRouter.get('/', getLocationsController);
locationsRouter.post('/', createLocationController);
locationsRouter.get('/check', checkLocationController);
locationsRouter.delete('/:id', deleteLocationController);
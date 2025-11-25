/**
 * Demo Module Routes
 * Defines routes for demo modules
 */
import { Router } from 'express';
import { DemoModuleControllers } from './demo_modules_controller';
// import { validateRequest } from '../../middlewares/validateRequest';
// import { createDemoModuleSchema, updateDemoModuleSchema } from './demo_modules_validationZodSchema';

const router: Router = Router();

// Create demo module
/**
router.post(
  '/create',
  validateRequest(createDemoModuleSchema),
  DemoModuleControllers.createDemoModule
);
*/

// Get all demo modules
router.get(
  '/',
  DemoModuleControllers.fetch_DemoData
);

// Get demo module by ID
/**
router.get(
  '/:id',
  DemoModuleControllers.getDemoModuleById
);
*/

// Update demo module
/**
router.patch(
  '/:id/update',
  validateRequest(updateDemoModuleSchema),
  DemoModuleControllers.updateDemoModule
);
*/

// Delete demo module
/**
router.delete(
  '/:id/delete',
  DemoModuleControllers.deleteDemoModule
);
*/

export const DemoModuleRoutes = router;

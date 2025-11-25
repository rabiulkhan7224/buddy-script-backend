/**
 * Demo Module Library
 * Contains library functions for demo modules
 */
import { TDemoModule } from './demo_modules_interface';

/**
 * Format demo module for response
 * @param demoModule - The demo module to format
 * @returns Formatted demo module
 */
export const formatDemoModule = (demoModule: TDemoModule) => {
  return {
    id: demoModule.id,
    name: demoModule.name,
    description: demoModule.description || '',
    createdAt: demoModule.createdAt,
    updatedAt: demoModule.updatedAt
  };
};

/**
 * Format multiple demo modules for response
 * @param demoModules - Array of demo modules to format
 * @returns Array of formatted demo modules
 */
export const formatDemoModules = (demoModules: TDemoModule[]) => {
  return demoModules.map(formatDemoModule);
};

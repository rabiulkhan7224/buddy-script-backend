/**
 * Demo Module Controller
 * Handles HTTP requests for demo modules
 */
import { Request, Response } from 'express'
import { DemoModuleServices } from './demo_modules_service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

// fetch demo data
const fetch_DemoData = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await DemoModuleServices.fetch_DemoData_fromDB()
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Demo data fetched successfully',
    data: data,
    meta: meta
  })
})

export const DemoModuleControllers = {
  fetch_DemoData
}

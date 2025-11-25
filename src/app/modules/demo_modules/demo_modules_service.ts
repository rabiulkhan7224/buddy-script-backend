/**
 * Demo Module Service
 * Business logic for demo modules
 */
import AppError from '../../errors/AppError';

// fetche demo data from database 
const fetch_DemoData_fromDB = async () => {
    console.log('Fetching demo data from your database...');
    const data = "Sample Demo Data from DB";
    const meta = {
      page : 1,
      limit : 10,
      totalPage : 3,
      totalData : 30
    }
    return {data, meta};
}

export const DemoModuleServices = {
  fetch_DemoData_fromDB  
}

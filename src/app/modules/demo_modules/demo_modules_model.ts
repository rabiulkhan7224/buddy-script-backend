/**
 * Demo Module Model
 * Mongoose model for demo modules
 */
/**
import { Schema, model } from 'mongoose';
import { TDemoModule } from './demo_modules_interface';

const demoModuleSchema = new Schema<TDemoModule>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

export const DemoModuleModel = model<TDemoModule>('DemoModule', demoModuleSchema);
*/

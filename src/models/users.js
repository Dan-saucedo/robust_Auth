import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
}, password: { type: String, required: true },
  
  // Campos para seguridad y bloqueo
  intentosFallidos: 
  { type: Number, 
    default: 0 
  },
  bloqueadoHasta: { 
    type: Date, 
    default: null 
  }
});

export default mongoose.model('User', userSchema);
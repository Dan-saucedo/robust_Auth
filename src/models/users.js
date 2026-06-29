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

// Método helper para verificar si está bloqueado
userSchema.methods.estaBloqueado = function() {
  if (!this.bloqueadoHasta) 
    return false;
  return new Date() < this.bloqueadoHasta;
};

export default mongoose.model('User', userSchema);
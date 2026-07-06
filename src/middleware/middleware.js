import userModel from '../models/users.js';

export const securityMiddleware = async( req, res, next ) => {
    if( req.path !== '/login') return next();
    const { email } = req.body;

    if( !email ) return next(); 

    const user = await userModel.findOne({ email }); 

    if( user && user.bloqueadoHasta){
        const ahoraMismo = new Date();
        if ( ahoraMismo < user.bloqueadoHasta){
            return res.status(403).json({ message: `Cuenta bloqueada temporalmente ${user.bloqueadoHasta}` });
        }
    }
    next();
};

console.log("Modelo cargado", userModel.modelName);
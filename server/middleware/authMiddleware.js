import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

//autentifikacija korisnika
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    
    console.log('token')

    if (token == null) {
        return res.sendStatus(401); // ako nema tokena - unauthorised
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // ako token nije validan - forbidden
        }
        
        req.user = user; // dodajes se request objektu koji je korisnik
        next(); 
    });
}

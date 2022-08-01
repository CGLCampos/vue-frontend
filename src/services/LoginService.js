export default class LoginService {
    
    constructor(http) {
        this._http = http;

    }

    login(usuario) {
        return this._http.post('/login', usuario);
    }

    logged() {
        return this._http.get('/logged');
    }
}
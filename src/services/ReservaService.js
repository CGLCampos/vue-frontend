export default class ReservaService {
    
    constructor(http) {
        this._http = http;

    }

    listarAbertas(page, per_page) {
        return this._http.get(`/reservas?page=${page}&per_page=${per_page}`);
    }

    listarFinalizadas(page, per_page) {
        return this._http.get(`/reservas/finalizadas?page=${page}&per_page=${per_page}`);
    }

    buscar(id) {
        return this._http.get(`/reservas/${id}`);
    }

    cadastrar(reserva) {
        return this._http.post(`/reservas`, reserva);
    }

    excluir(id) {
        return this._http.delete(`/reservas/${id}`);
    }

    finalizar(id) {
        return this._http.put(`/reservas/${id}/finalizar`);
    }

    devolver(id) {
        return this._http.put(`/reservas/${id}/devolver`)
    }
}
export default class LivroService {
    
    constructor(http) {
        this._http = http;

    }

    listarDisponiveis(page, per_page) {
        return this._http.get(`/livros/disponivel?page=${page}&per_page=${per_page}`);
    }

    listarReservados(page, per_page) {
        return this._http.get(`/livros/reservados?page=${page}&per_page=${per_page}`);
    }

    listarCategorias() {
        return this._http.get(`/categorias`);
    }

    buscar(id) {
        return this._http.get(`/livros/${id}`);
    }

    cadastrar(livro) {
        return this._http.post(`/livros`, livro);
    }

    editar(id, livro) {
        return this._http.put(`/livros/${id}`, livro);
    }

    excluir(id) {
        return this._http.delete(`/livros/${id}`);
    }
}
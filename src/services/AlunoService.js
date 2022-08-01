export default class AlunoService {
    
    constructor(http) {
        this._http = http;

    }

    paginate(page, per_page) {
        return this._http.get(`/alunos?page=${page}&per_page=${per_page}`);
    }

    listar() {
        return this._http.get(`/alunos/listar`);
    }

    buscar(id) {
        return this._http.get(`/alunos/${id}`);
    }

    buscarPerfil() {
        return this._http.get(`/alunos/perfil`);
    }

    cadastrar(aluno) {
        return this._http.post(`/alunos`, aluno);
    }

    editar(id, aluno) {
        return this._http.put(`/alunos/${id}`, aluno);
    }

    excluir(id) {
        return this._http.delete(`/alunos/${id}`);
    }
}
// ─── Usuario ────────────────────────────────────────────────────────────────

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  nivelAcesso: string;
  foto?: string;
  regiao?: string;
};

export type UsuarioPerfil = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  totalAnuncios: number;
  totalDoacoes: number;
};

export type UsuarioCreatePayload = {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
};

export type UsuarioUpdatePayload = {
  nome?: string;
  email?: string;
  telefone?: string;
};

export type UsuarioSenhaPayload = {
  senhaAtual: string;
  novaSenha: string;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export type LoginPayload = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token?: string;
  usuario: Usuario;
};

// ─── Doador ──────────────────────────────────────────────────────────────────

export type Doador = {
  id: number;
  usuarioId: number;
  nomeFantasia?: string;
  descricao?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  dataCadastro: string;
};

export type DoadorCreatePayload = {
  usuarioId: number;
  nomeFantasia?: string;
  descricao?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
};

export type DoadorUpdatePayload = Omit<DoadorCreatePayload, 'usuarioId'>;

// ─── Anuncio ─────────────────────────────────────────────────────────────────

export type AnuncioStatus = 'ATIVO' | 'INATIVO';

export type Categoria = {
  id: number;
  nome: string;
};

export type Anuncio = {
  id: number;
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  status: AnuncioStatus;
  categoria: Categoria;
  doador: Doador;
  dataCadastro: string;
};

export type AnuncioCreatePayload = {
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  categoriaId: number;
  doadorId: number;
};

export type AnuncioUpdatePayload = Partial<AnuncioCreatePayload>;

// ─── Favorito ────────────────────────────────────────────────────────────────

export type Favorito = {
  anuncioId: number;
  usuarioId: number;
  anuncio: Anuncio;
};

// ─── Utilitários ─────────────────────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark';

export type ApiError = {
  message: string;
  status: number;
  timestamp?: string;
};

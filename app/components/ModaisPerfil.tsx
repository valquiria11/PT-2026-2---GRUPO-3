"use client";

import { useEffect, useRef, useState } from "react";

interface Usuario {
  id: number;
  nome: string;
  username: string;
  email?: string;
  profile_picture_url: string | null;
}

interface ModaisPerfilProps {
  usuario: Usuario;
  onUsuarioAtualizado: (usuario: Usuario) => void;
  onFechar: () => void;
}

function urlFoto(url: string | null) {
  if (!url) return "/img.png";

  if (url.startsWith("/uploads/profiles/")) {
    const filename = url.split("/").pop();
    return `/api/profile-image/${filename}`;
  }

  return url;
}

export default function ModaisPerfil({
  usuario,
  onUsuarioAtualizado,
  onFechar,
}: ModaisPerfilProps) {
  const [modal, setModal] = useState<"editar" | "senha">("editar");

  const [nome, setNome] = useState(usuario.nome);
  const [username, setUsername] = useState(usuario.username);
  const [email, setEmail] = useState(usuario.email ?? "");

  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputImagem = useRef<HTMLInputElement>(null);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!preview) return;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function selecionarImagem(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Escolha uma imagem JPEG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    setErro("");
    setImagem(arquivo);
    setPreview(URL.createObjectURL(arquivo));
  }

  async function salvarPerfil(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!nome.trim() || !username.trim() || !email.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`/api/user/${usuario.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          username: username.trim(),
          email: email.trim(),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.message || "Não foi possível atualizar o perfil.");
      }

      let usuarioAtualizado = {
        ...usuario,
        nome: dados.nome,
        username: dados.username,
        email: dados.email,
      };

      if (imagem) {
        const formulario = new FormData();
        formulario.append("imagem", imagem);

        const respostaImagem = await fetch("/api/user/me/profile-image", {
          method: "PATCH",
          body: formulario,
        });

        const dadosImagem = await respostaImagem.json();

        if (!respostaImagem.ok) {
          onUsuarioAtualizado(usuarioAtualizado);
          throw new Error(
            dadosImagem.message || "Os dados foram salvos, mas a foto não foi atualizada.",
          );
        }

        usuarioAtualizado = {
          ...usuarioAtualizado,
          profile_picture_url: dadosImagem.profile_picture_url,
        };
      }

      onUsuarioAtualizado(usuarioAtualizado);
      setMensagem("Perfil atualizado com sucesso!");

      setTimeout(onFechar, 900);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao atualizar perfil.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function salvarSenha(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("A confirmação não corresponde à nova senha.");
      return;
    }

    if (novaSenha === senhaAtual) {
      setErro("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/user/me/senha", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.message || "Não foi possível alterar a senha.");
      }

      setMensagem("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        setModal("editar");
        setMensagem("");
      }, 1000);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao alterar senha.",
      );
    } finally {
      setCarregando(false);
    }
  }

  const campo =
    "w-full rounded-2xl border border-transparent bg-white px-3 py-3 text-sm text-[#252525] outline-none placeholder:text-gray-400 focus:border-[#6A38F3]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
    >
      <section className="relative max-h-[95vh] w-full max-w-[523px] overflow-y-auto bg-[#EEEEEE] px-8 py-8 sm:px-14">
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar modal"
          className="absolute right-6 top-5 text-4xl leading-none text-black hover:opacity-60"
        >
          ×
        </button>

        {modal === "editar" ? (
          <>
            <h2 className="sr-only">Editar perfil</h2>

            <div className="mb-7 flex flex-col items-center pt-2">
              <div className="relative">
                <img
                  src={preview || urlFoto(usuario.profile_picture_url)}
                  alt="Foto de perfil"
                  className="h-28 w-28 rounded-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => inputImagem.current?.click()}
                  aria-label="Alterar foto"
                  className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-white text-2xl shadow"
                >
                  📷
                </button>

                <input
                  ref={inputImagem}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={selecionarImagem}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Clique na câmera para alterar a foto
              </p>
            </div>

            <form onSubmit={salvarPerfil} className="space-y-4">
              <input
                className={campo}
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={100}
              />

              <input
                className={campo}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={50}
              />

              <input
                className={campo}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="pt-8">
                <button
                  type="button"
                  disabled
                  title="Funcionalidade ainda não implementada"
                  className="w-full rounded-full border border-red-500 py-2 text-red-600 opacity-60"
                >
                  Deletar conta
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModal("senha");
                    setErro("");
                    setMensagem("");
                  }}
                  className="mt-2 w-full rounded-full border border-[#6A38F3] py-2 text-[#6A38F3] transition hover:bg-purple-50"
                >
                  Alterar senha
                </button>

                <button
                  type="submit"
                  disabled={carregando}
                  className="mt-2 w-full rounded-full bg-[#6A38F3] py-2 text-white shadow-md transition hover:bg-[#5229D4] disabled:opacity-60"
                >
                  {carregando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setModal("editar");
                setErro("");
                setMensagem("");
              }}
              aria-label="Voltar para edição do perfil"
              className="absolute left-7 top-7 text-3xl text-black"
            >
              ‹
            </button>

            <div className="mb-9 flex justify-center pt-8">
              <svg
                viewBox="0 0 120 120"
                className="h-32 w-32"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="83" cy="27" r="22" fill="#A88AEF" />
                <circle cx="91" cy="20" r="6" fill="#EEEEEE" />
                <path
                  d="M67 43L25 85M17 77L33 93M31 63L47 79"
                  stroke="#6A38F3"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <form onSubmit={salvarSenha} className="space-y-4">
              <input
                className={campo}
                type="password"
                placeholder="Senha Antiga"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                autoComplete="current-password"
              />

              <input
                className={campo}
                type="password"
                placeholder="Nova Senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoComplete="new-password"
              />

              <input
                className={campo}
                type="password"
                placeholder="Confirmar Senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                autoComplete="new-password"
              />

              <div className="pt-16">
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full rounded-full bg-[#6A38F3] py-2 text-white shadow-md transition hover:bg-[#5229D4] disabled:opacity-60"
                >
                  {carregando ? "Salvando..." : "Salvar Senha"}
                </button>
              </div>
            </form>
          </>
        )}

        {erro && (
          <p role="alert" className="mt-4 text-center text-sm text-red-600">
            {erro}
          </p>
        )}

        {mensagem && (
          <p role="status" className="mt-4 text-center text-sm text-green-700">
            {mensagem}
          </p>
        )}
      </section>
    </div>
  );
}

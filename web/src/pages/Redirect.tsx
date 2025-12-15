import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export function Redirect() {
  const { code } = useParams();
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (code && !hasRedirected.current) {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3333";
      const url = `${backendUrl}/${code}`;
      setRedirectUrl(url);

      // Marcar como redirecionado antes de executar
      hasRedirected.current = true;

      // Redireciona imediatamente - a página aparece durante o tempo natural de carregamento
      window.location.href = url;
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl p-12 max-w-lg w-full flex flex-col items-center text-center shadow-sm">
        {/* Logo */}
        <img src="/Logo.svg" alt="Brev.ly" className="w-12 h-12 mb-6" />

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-600 mb-4">
          Redirecionando...
        </h1>

        {/* Descrição */}
        <p className="text-gray-500 mb-1">
          O link será aberto automaticamente em alguns instantes.
        </p>
        <p className="text-gray-500">
          Não foi redirecionado?{" "}
          <a
            href={redirectUrl}
            className="text-blue-base font-medium hover:underline"
          >
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  );
}

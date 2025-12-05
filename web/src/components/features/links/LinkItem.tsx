import { useState } from "react";
import { Copy, Trash } from "phosphor-react";
import { Link } from "../../../types/link";
import { Button } from "../../ui/Button";

interface LinkItemProps {
  link: Link;
  onDelete: (id: string) => void;
}

export function LinkItem({ link, onDelete }: LinkItemProps) {
  const [copying, setCopying] = useState(false);

  // Link encurtado aponta para o frontend, que redireciona para o backend
  const frontendUrl =
    import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const shortUrl = `${frontendUrl}/${link.shortUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleLinkClick = () => {
    // React Query vai fazer refetch automaticamente quando voltar pra aba
    // graças ao refetchOnWindowFocus: true e refetchInterval
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
      <div className="flex-1 min-w-0 space-y-1 pr-8">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="text-md font-semibold text-blue-base hover:underline truncate block"
          onClick={handleLinkClick}
        >
          brev.ly/{link.shortUrl}
        </a>
        <p className="text-sm text-gray-500 truncate" title={link.url}>
          {link.url}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {link.accessCount} acessos
        </span>

        <div className="flex gap-1 items-center">
          <Button variant="secondary" size="icon" onClick={handleCopy}>
            {copying ? (
              <span className="text-xs font-bold text-green-600">✓</span>
            ) : (
              <Copy size={16} />
            )}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => onDelete(link.id)}
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

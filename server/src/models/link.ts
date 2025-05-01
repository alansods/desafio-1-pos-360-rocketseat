export interface Link {
    id: string;
    url: string;
    shortUrl: string;
    createdAt: Date;
    accessCount: number;
  }

  export interface CreateLinkDTO {
    url: string;
    shortUrl?: string; // Opcional, pode ser gerado automaticamente
  }
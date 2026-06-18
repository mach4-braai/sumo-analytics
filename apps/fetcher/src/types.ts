export interface ApiRikishi {
  id: number;
  shikonaEn: string | null;
  birthDate: string;
  shusshin: string;
}

export interface ApiTorikumi {
  id: string;
  bashoId: string;
  division: string;
  day: number;
  matchNo: number;
  eastId: number;
  westId: number;
  eastShikona: string;
  westShikona: string;
  kimarite: string;
  winnerId: number;
}

export interface ApiBashoMeta {
  date: string;
  startDate: string;
  endDate: string;
}

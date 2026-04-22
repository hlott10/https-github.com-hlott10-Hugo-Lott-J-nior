export const SPECIALTIES = [
  "Odontologia",
  "Psicologia",
  "Cardiologia",
  "Dermatologia",
  "Pediatria",
  "Oftalmologia",
  "Fisioterapia",
  "Clínica Geral",
  "Laboratório",
  "Estética",
  "Ginecologia",
  "Ortopedia",
  "Psiquiatria",
  "Nutrição"
];

export const CITIES = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Salvador",
  "Curitiba",
  "Fortaleza",
  "Manaus",
  "Recife",
  "Porto Alegre",
  "Brasília"
];

export interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string;
  specialty: string;
  google_rating: number;
  review_count: number;
  response_rate: number;
  growth_rate: number;
  recent_reviews_score: number; // 0-1
  address: string;
  slug: string;
}

export interface SEOPage {
  id: string;
  city?: string;
  specialty?: string;
  slug: string;
  title: string;
  description: string;
}

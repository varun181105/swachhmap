export type WasteReport = {
  id: string;
  photo_url: string;
  lat: number;
  lng: number;
  description: string | null;
  severity: string;
  status: string;
  created_at: string;
};

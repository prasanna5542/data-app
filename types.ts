export interface SheetRow {
  id: string;
  slno: string;
  slate: string;
  cameraName: string;
  cameraModel: string;
  clipNo: string;
  lens: string;
  height: string;
  focus: string;
  fps: string;
  shutter: string;
  notes: string;
}

export interface ShootLog {
  id: string;
  name: string;
  date: string;
  location: string;
  data: SheetRow[];
}

export interface Project {
  id: string;
  name: string;
  shootLogs: ShootLog[];
  lensPresets?: string[];
  cameraNamePresets?: string[];
  cameraModelPresets?: string[];
}
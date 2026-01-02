
export interface Entry {
  id: string;
  amount: number; // positive for given, negative for taken
  category: string;
  timestamp: number;
}

export interface PersonRecord {
  id: string;
  name: string;
  entries: Entry[];
}

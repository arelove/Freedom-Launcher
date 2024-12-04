import { openDB, DBSchema } from 'idb';

interface MyDB extends DBSchema {
  analysisData: {
    key: string;
    value: any;
  };
}

const dbPromise = openDB<MyDB>('disk-analysis-db', 1, {
  upgrade(db) {
    db.createObjectStore('analysisData');
  },
});

export async function saveData(key: string, data: any) {
  const db = await dbPromise;
  await db.put('analysisData', data, key);
}

export async function getData(key: string) {
  const db = await dbPromise;
  return await db.get('analysisData', key);
}

export async function deleteData(key: string) {
  const db = await dbPromise;
  await db.delete('analysisData', key);
}

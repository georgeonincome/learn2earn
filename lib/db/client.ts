// Mock DB client for previewing - avoids SIGBUS from native .node binaries in WSL
// This is a temporary mock for development/preview only
// Get production DB config from: memories/GEORGE_FULL_PROFILE.md

const mockDb = new Proxy({} as any, {
  get(target, prop) {
    // Return mock query functions
    if (typeof prop === 'string') {
      return () => ({ data: [], length: 0 });
    }
    return undefined;
  }
});

let _db: any = mockDb;

export const db = _db;
export type DbClient = typeof db;

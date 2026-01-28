// can be replaced with redis laterwards timebased cache


class CacheService {
    private cache: Map<string, any> = new Map();

    public get(key: string): any {
        if (!this.cache.has(key)) {
            return null;
        }
        const item = this.cache.get(key);
        if (item.expiresAt && item.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }

    public set(key: string, value: any, expiresIn: number): void {
        // remove the expired items
        this.removeExpiredItems();
        this.cache.set(key, { data: value, expiresAt: Date.now() + expiresIn });
    }

    public removeExpiredItems(): void {
        this.cache.forEach((item, key) => {
            if (item.expiresAt && item.expiresAt < Date.now()) {
                this.cache.delete(key);
            }
        });
    }

    public remove(key: string): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
    }
}
// using singleton
export const cacheService = new CacheService();
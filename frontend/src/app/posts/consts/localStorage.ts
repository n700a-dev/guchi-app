// 一度でもグチを投稿したことがあるかを判定するためのキー
// 履歴を削除するとsessionStorageとIndexedDBの両方が削除される
// 一方でIndexedDBのデータのみ残っている場合は、dexie側のエラーと判定できる。
export const LS_IS_POSTED = 'isPosted' as const;

// trueならば、グチを新規作成後、自動燃焼する
export const LS_IS_AUTO_FIRING = 'local-storage-is-auto-firing' as const;

export const SS_CHALLENGE_TOKEN = 'session-storage-challenge-token' as const;
export const LS_ACCESS_TOKEN = 'local-storage-access-token' as const;

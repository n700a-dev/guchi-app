
## マイグレーション管理
- https://zenn.dev/shimakaze_soft/articles/4c0784d9a87751#%E7%8F%BE%E5%9C%A8%E3%81%AE%E7%8A%B6%E6%85%8B%E3%82%92%E8%AA%BF%E3%81%B9%E3%82%8B

## コマンド
- up
    - `alembic upgrade head`
- down
    - `alembic downgrade [base | version_hash]`
- status
    - `alembic current`

# DB周りの参考実装
- Github: https://github.com/takashi-yoneya/fastapi-template/blob/main/app/core/database.py

# DB周りのエラー

## transactionに失敗したとき、別のtransactionが実行できなくなる
- 課題
    - Rollback()するまで他のtransactionができない
        ```
        2024-03-21 02:38:12,883 - strawberry.execution - ERROR - Can't reconnect until invalid transaction is rolled back.  Please rollback() fully before proceeding (Background on this error at: https://sqlalche.me/e/20/8s2b)
        ```
- 一次対応
    - finally句を追加し、`session.close()`する
    - https://docs.sqlalchemy.org/en/20/orm/session_transaction.html
    - > The Session itself features a Session.close() method. If the Session is begun within a transaction that has not yet been committed or rolled back, this method will cancel (i.e. rollback) that transaction, and also expunge all objects contained within the Session object’s state. If the Session is being used in such a way that a call to Session.commit() or Session.rollback() is not guaranteed (e.g. not within a context manager or similar), the close method may be used to ensure all resources are released: 

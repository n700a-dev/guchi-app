from setting import session
import sys


# https://stackoverflow.com/questions/2546207/does-sqlalchemy-have-an-equivalent-of-djangos-get-or-create
def get_or_create(session, model, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        return instance


sys.path.append("../")  # app ディレクトリを起点にする
from domain.entity.user import UserModel

for nickname in ["テストユーザー1", "テストユーザー2", "テストユーザー3"]:
    user_nickname = get_or_create(session, UserModel, nickname=nickname)
    print(user_nickname)

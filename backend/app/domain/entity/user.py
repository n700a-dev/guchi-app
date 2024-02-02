import sqlalchemy as sa
from sqlalchemy import Column, Integer, String
import datetime as dt
from infrastructure.db.setting import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String)
    email = Column(String)
    password = Column(String)
    created_at = Column(sa.DateTime, default=dt.datetime.now(), nullable=False)
    updated_at = Column(sa.DateTime, default=dt.datetime.now(), onupdate=dt.datetime.now(), nullable=False)
    expired_at = Column(sa.DateTime, default=None, nullable=True)
    provider = Column(sa.VARCHAR, nullable=True)
    identifier = Column(sa.VARCHAR, nullable=True)
    is_admin = Column(sa.BOOLEAN, default=False)

    def __repr__(self):
        return "<User('id={}, nickname={})>".format(self.id, self.nickname)

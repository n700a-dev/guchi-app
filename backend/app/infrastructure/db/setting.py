from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.ext.declarative import declarative_base

import os

url = os.environ["POSTGRESS_LOGIN_URL"]
ENGINE = create_engine(url, isolation_level="READ COMMITTED", echo=True)

session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=ENGINE))

Base = declarative_base()

# キャッシュさせない方法
# https://copyprogramming.com/howto/how-to-avoid-caching-in-sqlalchemy

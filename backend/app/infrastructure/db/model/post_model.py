
from sqlalchemy import Column, Integer, String, ForeignKey, Text, BigInteger

from infrastructure.db.setting import Base

class PostModel(Base):
    __tablename__ = "posts"
    author_id = Column(  # PK
        "author_id", Integer, ForeignKey("users.id", onupdate="CASCADE", ondelete="CASCADE"), primary_key=True
    )
    uploaded_at_ms = Column(BigInteger, unique=True, autoincrement=True)
    created_at_ms = Column(BigInteger, primary_key=True)  # PK
    updated_at_ms = Column(BigInteger)
    posted_date = Column(String)
    diff_hour = Column(Integer)
    text = Column(Text)
    emotion = Column(String)
    image_url = Column(String)

    def __repr__(self):
        return f"<Post('author_id={self.author_id}, uploaded_at_ms={self.uploaded_at_ms}), created_at_ms={self.created_at_ms}>"
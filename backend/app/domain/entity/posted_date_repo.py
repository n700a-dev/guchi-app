from sqlalchemy import Column, Integer, String, ForeignKey, Text, BigInteger

from infrastructure.db.setting import Base


class PostedDateRepository(Base):
    __tablename__ = "posted_dates"
    author_id = Column(  # PK
        "author_id", Integer, ForeignKey("users.id", onupdate="CASCADE", ondelete="CASCADE"), primary_key=True
    )
    posted_date = Column(String)  # PK
    start_of_day_ms = Column(BigInteger, unique=True, autoincrement=True)  # Unique
    end_of_day_ms = Column(BigInteger, unique=True, autoincrement=True)
    updated_at_ms = Column(BigInteger, primary_key=True)
    diff_hour = Column(Integer)
    post_count = Column(Integer)

    def __repr__(self):
        return f"<Post('author_id={self.author_id},  posted_date={self.posted_date}, post_count={self.post_count}, updated_at_ms={self.updated_at_ms})>"

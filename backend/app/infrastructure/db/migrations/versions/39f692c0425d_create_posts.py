"""create posts

Revision ID: 39f692c0425d
Revises: 8ac2707cbb1b
Create Date: 2023-12-11 00:41:25.253994

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "39f692c0425d"
down_revision: Union[str, None] = "8ac2707cbb1b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "posts",
        sa.Column("author_id", sa.INTEGER, sa.ForeignKey("users.id"), nullable=False),  # PK1
        sa.Column("created_at_ms", sa.BigInteger(), nullable=False),  # PK2
        sa.Column("updated_at_ms", sa.BigInteger(), nullable=False),
        sa.Column("uploaded_at_ms", sa.BigInteger(), nullable=False),
        sa.Column("posted_date", sa.String(), nullable=False),  # FK
        sa.Column("diff_hour", sa.INTEGER(), autoincrement=False, nullable=True),
        sa.Column("text", sa.TEXT(), nullable=True),
        sa.Column("emotion", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        # Constraints
        sa.PrimaryKeyConstraint("author_id", "created_at_ms", name="posts_pk"),
        sa.UniqueConstraint("author_id", "uploaded_at_ms", name="posts_uq_author_id_uploaded_at_ms"),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], name="posts_author_id_fkey"),
    )


def downgrade() -> None:
    op.drop_table("posts")

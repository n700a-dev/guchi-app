"""create posted dates

Revision ID: 025112121440
Revises: 39f692c0425d
Create Date: 2023-12-11 21:47:19.009319

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "025112121440"
down_revision: Union[str, None] = "39f692c0425d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "posted_dates",
        sa.Column("author_id", sa.INTEGER(), autoincrement=False, nullable=False),  # PK1
        sa.Column("posted_date", sa.String(), nullable=False),  # PK2
        sa.Column("start_of_day_ms", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column("end_of_day_ms", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column("updated_at_ms", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column("post_count", sa.INTEGER(), autoincrement=False, nullable=True),
        sa.Column("diff_hour", sa.INTEGER(), autoincrement=False, nullable=True),
        # Constraints
        sa.PrimaryKeyConstraint("author_id", "posted_date", name="posted_dates_pk"),
        sa.UniqueConstraint(
            "author_id", "posted_date", "diff_hour", name="posted_dates_uq_author_id_posted_date_diff_hour"
        ),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], name="posts_author_id_fkey"),
    )


def downgrade() -> None:
    op.drop_table("posts")

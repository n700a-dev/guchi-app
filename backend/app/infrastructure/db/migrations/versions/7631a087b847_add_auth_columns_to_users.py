"""add_auth_columns_to_users

Revision ID: 7631a087b847
Revises: 025112121440
Create Date: 2023-12-31 18:33:59.133739

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '7631a087b847'
down_revision: Union[str, None] = '025112121440'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('users', recreate='auto') as batch_op:
        batch_op.add_column(sa.Column("provider", sa.VARCHAR, nullable=True))
        batch_op.add_column(sa.Column("identifier", sa.VARCHAR, nullable=True))
        batch_op.add_column(sa.Column("is_admin", sa.BOOLEAN, nullable=False, server_default=sa.schema.DefaultClause("0")))
        batch_op.create_unique_constraint("users_uq_provider_identifier_expired_at", ["identifier", "provider", "expired_at"])

def downgrade() -> None:
    with op.batch_alter_table('users', recreate='auto') as batch_op:
        batch_op.drop_constraint("users_uq_provider_identifier_expired_at")
        batch_op.drop_column("provider")
        batch_op.drop_column("identifier")
        batch_op.drop_column("is_admin")

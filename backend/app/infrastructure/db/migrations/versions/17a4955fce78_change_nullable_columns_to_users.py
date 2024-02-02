"""change_nullable_columns_to_users

Revision ID: 17a4955fce78
Revises: 7631a087b847
Create Date: 2023-12-31 19:01:54.528953

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '17a4955fce78'
down_revision: Union[str, None] = '7631a087b847'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('users', recreate='auto') as batch_op:
        batch_op.alter_column("nickname", nullable=True)
        batch_op.alter_column("password", nullable=True)
        batch_op.alter_column("email", nullable=True)

def downgrade() -> None:
    with op.batch_alter_table('users', recreate='auto') as batch_op:
        batch_op.alter_column("nickname", nullable=False)
        batch_op.alter_column("password", nullable=False)
        batch_op.alter_column("email", nullable=False)
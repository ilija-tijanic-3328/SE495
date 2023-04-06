"""Initial migration

Revision ID: 50bd965cd4a9
Revises: 
Create Date: 2023-03-24 01:10:12.571164

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '50bd965cd4a9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_account',
    sa.Column('id', sa.Integer(), sa.Identity(always=False), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('phone_number', sa.String(length=15), nullable=True),
    sa.Column('status', sa.String(length=15), nullable=False),
    sa.Column('role', sa.String(length=10), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('user_app_config',
    sa.Column('id', sa.Integer(), sa.Identity(always=False), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('config', sa.String(length=20), nullable=False),
    sa.Column('value', sa.String(length=150), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user_account.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_app_config')
    op.drop_table('user_account')
    # ### end Alembic commands ###
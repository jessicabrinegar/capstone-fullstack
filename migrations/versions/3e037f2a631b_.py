"""empty message

Revision ID: 3e037f2a631b
Revises: 174bfcd4b981
Create Date: 2023-03-07 18:38:23.040871

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3e037f2a631b'
down_revision = '174bfcd4b981'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('email_verification',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('can_connect_smtp', sa.Boolean(), nullable=True),
    sa.Column('is_deliverable', sa.Boolean(), nullable=True),
    sa.Column('is_disabled', sa.Boolean(), nullable=True),
    sa.Column('is_disposable', sa.Boolean(), nullable=True),
    sa.Column('is_inbox_full', sa.Boolean(), nullable=True),
    sa.Column('accepts_mail', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('email_verification')
    # ### end Alembic commands ###

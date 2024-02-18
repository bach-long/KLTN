from sqlalchemy import Boolean, Column, ForeignKey, TIMESTAMP, String, BigInteger, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, false

from .config import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    documents = relationship("Document", back_populates="user")

class Document(Base):
    __tablename__ = "documents"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255))
    type = Column(Enum("folder", "file", name="document_type_enum"))
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete='CASCADE', onupdate='CASCADE'))
    parent_id = Column(BigInteger, ForeignKey("documents.id", ondelete='CASCADE', onupdate='CASCADE'))
    url = Column(String(255))
    marked = Column(Boolean, default=False)
    opened_at = Column(TIMESTAMP)
    deleted_at = Column(TIMESTAMP)


    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="documents")
    children = relationship("Document", back_populates="parent", lazy="dynamic")
    parent = relationship("Document", back_populates="children", remote_side=[id])

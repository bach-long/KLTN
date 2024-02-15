from sqlalchemy import Boolean, Column, ForeignKey, DateTime, String, BigInteger, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .config import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(16))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    documents = relationship("Document", back_populates="user")

class Document(Base):
    __tablename__ = "documents"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255))
    type = Column(String(10))
    user_id = Column(BigInteger, ForeignKey("users.id"))
    parent_id = Column(BigInteger, ForeignKey("documents.id"))
    url = Column(String(255))
    opened_at = Column(DateTime)
    deleted_at = Column(DateTime)


    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="documents")
    children = relationship("Document", back_populates="parent")
    parent = relationship("Document", back_populates="children")

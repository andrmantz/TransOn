import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__="users"
    id = Column(Integer(), primary_key=True)
    username = Column(String(22), unique=True, nullable=False)
    email = Column(String(250), unique=True, nullable=False)
    password = Column(String(65), nullable=False)
    
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return f"<User {self.id}: Username {self.username}, Email {self.email}, Password {self.password}"

class File(Base):
    __tablename__="files"
    url = Column(String(41), primary_key=True)
    file = Column(String(500), nullable=False)
    date_created = Column(DateTime(), default=datetime.datetime.utcnow)
    

    def __init__(self, url, file):
        self.url = url
        self.file = file

    def __repr__(self):
        return f"<File with url {self.url}: Filaname {self.file}, Date Created {self.date_created}"

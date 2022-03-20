import datetime
from models import User, File
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

def startSession():
    user = os.getenv("PGUSER")
    passw = os.getenv("PGPASSWORD")
    url = f'postgresql://{user}:{passw}@postgres-cluster-ip-service.default.svc.cluster.local/shares'
    Engine = create_engine(url)
    Session = sessionmaker(bind = Engine)
    return Session()

class DBClient:

    def __init__(self):

        self.session = startSession()

    def __del__(self):
        self.session.close()
    
    #------------ User Management -------------------------------------
    
    def getUserById(self, uid):
        user = self.session.query(User).filter(User.id==uid).first()
        return user
    
    def validateUser(self, name, password):
        user = self.session.query(User).filter(User.username==name, User.password==password).first()
        return user
    

    '''
    Returns 0 if everything fine
            1 if username already exists
            2 if email exists
            3 for internal error
    '''
    
    def insertUser(self, username, email, password):
        status = 0
        user = User(username=username, email=email, password=password)
        self.session.add(user)
        try:
            self.session.commit()
        except Exception as error:
            self.session.flush()
            self.session.rollback()
            err = str(error.orig)
            if "username" in err:
                status = 1
            elif "email" in err:
                status = 2
            else:
                status = 3
        return status
    
    def deleteUser(self, id):
        user = self.getUserById(id)
        if not user:
            return -1
        self.session.delete(user)
        try:
            self.session.commit()
        except Exception:
            self.session.flush()
            self.session.rollback()
            return 1
        return 0
    
    
    #------------ File Management -------------------------------------
    
    def addFile(self,url, file):
        status = 0

        new = File(url, file)
        self.session.add(new)
        
        try:
            self.session.commit()
        except Exception:
            self.session.flush()
            self.session.rollback()
            status = 1
        return status

    def getFileByUrl(self, url):
        f = self.session.query(File).filter(File.url == url).first()
        return f

    def deleteFile(self, url):
        f = self.getFileByUrl(url)
        if not f:
            return -1
        self.session.delete(f)
        try:
            self.session.commit()
        except Exception:
            self.session.flush()
            self.session.rollback()
            return 1
        return 0

    def updateDate(self, url):
        f = self.getFileByUrl(url)
        if not f:
            return -1
        f.date_created = datetime.datetime.utcnow()
        try:
            self.session.commit()
        except Exception:
            self.session.flush()
            self.session.rollback()
            return 1
        return 0

    def getOldFiles(self):
        t = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        f = self.session.query(File).filter(File.date_created <= t).all()
        return f

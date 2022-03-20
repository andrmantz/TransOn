import jwt
from Crypto.Hash import SHA256
import os, math

def generateToken(userid, username):
    secret = os.getenv("JWTPASSWORD")
    return jwt.encode(
        {"userId": f"{userid}", "userName": f"{username}"},
        secret,
        algorithm="HS256",
    )


# User with id 0 is not really a valid user, so here we use it as error code
def verify(auth):
    secret = os.getenv("JWTPASSWORD")
    try:
        token = jwt.decode(auth, secret, algorithms=["HS256"])
        return int(token["userId"]), token["userName"]
    except (jwt.exceptions.InvalidSignatureError, jwt.exceptions.DecodeError):
        return 0, ""


def getToken(auth):
    try:
        return auth.split()[1]
    except (IndexError, AttributeError):
        return ""


def getUrl(file_data, filename):
    w = file_data + filename.encode()
    h = SHA256.new(w)
    return h.hexdigest()[:30]

def hashPassword(passw):
    h = SHA256.new(passw.encode())
    return h.hexdigest()

# https://stackoverflow.com/questions/5194057/better-way-to-convert-file-sizes-in-python
def convert_size(filesize):
    size_bytes = float(filesize)
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_name[i]}"

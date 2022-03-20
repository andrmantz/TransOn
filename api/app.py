from database import DBClient
import json
from storage import MinioClient
from flask import request, Response, make_response
from utils import verify, generateToken, getToken, getUrl, convert_size, hashPassword
from io import BytesIO

def login():
    req = request.get_json()
    try:

        db = DBClient()
        user = db.validateUser(req["username"], hashPassword(req["password"]))

        if not user:
            error_resp = {"error": "Invalid Credentials"}
            return Response(
                json.dumps(error_resp), status=401, mimetype="application/json"
            )

        token = generateToken(f"{user.id}", user.username)
        resp = {"token": f"{token}"}
        return Response(json.dumps(resp), status=200, mimetype="application/json")
    except (KeyError, TypeError):
        return Response(status=400, mimetype="application/json")

def register():
    req = request.get_json()

    email, username, password = "", "", ""
    try:
        email = req["email"]
        username = req["username"]
        password = req["password"]
    except (KeyError, TypeError):
        return Response(status=400, mimetype="application/json")

    password = hashPassword(password)
    db = DBClient()
    ret = db.insertUser(username, email,password)


    if ret:
        error_resp = dict()
        if ret == 1:
            error_resp = {"error": "Username already in use."}
        elif ret == 2:
            error_resp = {"error": "Email already in use."}
        else:
            return Response(status=500)
        return Response(json.dumps(error_resp), status=409, mimetype="application/json")

    user = db.validateUser(username, password)
    if not user:
        return Response(status=401)
    token = generateToken(f"{user.id}", user.username)
    resp = {"token": f"{token}"}
    return Response(json.dumps(resp), status=200, mimetype="application/json")


def getfile(bucket, name):
    c = MinioClient()

    file, headers = c.getObject(f"{bucket}", f"{name}")

    filename = c.getOriginalName(bucket, name)

    resp = make_response(file, 200)
    resp.headers.set("Content-Type", f"{headers['Content-Type']}")
    resp.headers.set("Content-Disposition", f"attachment; filename={filename}")
    resp.mimetype = f"{headers['Content-Type']}"
    return resp


def upd():
    auth = getToken(request.headers.get("Authorization"))
    file = request.files["data"].read()
    data = BytesIO(file)
    name = request.form.get("filename")
    ext = request.form.get("extension")

    if auth and not verify(auth)[0]:
        return Response(status=403)

    db = DBClient()

    c = MinioClient()
    url = getUrl(file, name)

    bucket = db.getUserById(0).username

    # The same file already exists in our database.
    # We just set it's timestamp to today.
    if db.getFileByUrl(url):
        db.updateDate(url)
        resp = {"url": f"{url}"}
        return Response(json.dumps(resp), status=200, mimetype="application/json")

    new_name = c.addobject(f"{bucket}", f"{name}", data, ext)

    db.addFile(url, new_name)

    resp = {"url": f"{url}"}
    return Response(json.dumps(resp), status=200, mimetype="application/json")


def deleteAccount():
    db = DBClient()

    auth = getToken(request.headers.get("Authorization"))
    uid, _ = verify(auth)

    if not auth:
        return Response(status=400)

    if uid:

        db.deleteUser(uid)
        return Response(status=200)

    return Response(status=400)


def openLink():
    c = MinioClient()
    db = DBClient()

    url = request.args.get("u")
    temp = db.getFileByUrl(url)
    bucket = db.getUserById(0).username

    if not temp:
        return Response(status=400)

    name = temp.file

    _, headers = c.getObject(f"{bucket}", f"{name}")
    orig_name = c.getOriginalName(bucket, name)
    d = {"file": f"{orig_name}", "size": f"{convert_size(headers['Content-Length'])}"}
    return Response(json.dumps(d), status=200, mimetype="application/json")


def download():
    db = DBClient()
    url = request.args.get("u")
    temp = db.getFileByUrl(url)
    bucket = db.getUserById(0).username

    if not temp:
        return Response(status=400)

    name = temp.file
    return getfile(bucket, name)

def deleteOldFiles():
    db = DBClient()
    c = MinioClient()
    old = db.getOldFiles()
    
    if len(old) == 0:
        return Response(status=200)
    
    bucket = db.getUserById(0).username
    
    for file in old:
        db.deleteFile(file.url)
        c.removeObject(bucket, file.file)
    
    return Response(status=200)


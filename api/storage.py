from minio import Minio
from minio.commonconfig import Tags
import os

class MinioClient:
    def __init__(self):
        user = os.getenv("MNUSER")
        passw = os.getenv("MNPASSWORD")
        self.client = Minio(f"minio-cluster-ip-service.default.svc.cluster.local:9000", f"{user}", f"{passw}", secure=False)

    def addobject(self, bucket, name, data, ext):
        # get only names of files in bucket
        objs = self.getObjects(bucket, True)
        new_name = name
        i = 0
        # make sure we dont overwrite any files with same name
        if "." in name:
            # append _1 before last dot
            idx = name.rfind(".")
            while new_name in objs:
                new_name = name
                i += 1
                new_name = new_name[:idx] + "_" + str(i) + new_name[idx:]
        else:
            # append _i in the end
            while new_name in objs:
                new_name = name
                i += 1
                new_name += "_" + str(i)
        
        
        tags = Tags.new_object_tags()
        tags["original_name"] = name
        
        self.client.put_object(
            f"{bucket}",
            f"{new_name}",
            data,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=ext,
            tags = tags
        )
        return new_name

    def getObjects(self, bucket, names_only=False):
        objs = self.client.list_objects(f"{bucket}")
        if names_only:
            return [obj._object_name for obj in objs]
        res = [[obj._object_name, obj._size] for obj in objs]
        return res

    def removeObject(self, bucket, name):
        self.client.remove_object(f"{bucket}", f"{name}")

    def removeBucket(self, bucket):
        # The bucket has to be empty, so we remove all objects first.

        objs = self.getObjects(bucket, True)
        for obj in objs:
            self.removeObject(bucket, f"{obj}")
        self.client.remove_bucket(f"{bucket}")

    def createBucket(self, bucket_name):
        self.client.make_bucket(f"{bucket_name}")

    def getObject(self, bucket, name):
        data = ""
        headers = ""
        try:
            response = self.client.get_object(f"{bucket}", f"{name}")
            data = response.data
            headers = response.headers
        # Read data from response.
        finally:
            response.close()
            response.release_conn()
            return data, headers


    def getOriginalName(self, bucket, name):
        tags = self.client.get_object_tags(f"{bucket}", f"{name}")
        return tags["original_name"]

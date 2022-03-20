import subprocess



def clean():
    l = ["route", "fn", "pkg", "environment"]



    for t in l:
        p = subprocess.run(["fission", f"{t}", "list"], stdout = subprocess.PIPE)
        l1 = p.stdout.decode().strip().split("\n")[1:]
        for i in l1:
            to_del = i.split(" ")[0]
            subprocess.run(["fission", f"{t}", "delete", "--name", f"{to_del}"], stdout = subprocess.DEVNULL)


clean()

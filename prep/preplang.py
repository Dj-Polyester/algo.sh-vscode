import requests
from bs4 import BeautifulSoup

with open("prep.html", "r") as html:
    with open("out.html", "a") as out:
        soup = BeautifulSoup(html.read(), "html.parser")

        alist = soup.find_all("td")
        blist = list(filter(lambda a: a.code != None, alist))
        clist = [f'<option value="{b.code.text[:-1]}">{b.code.text[:-1]}</option>' for b in blist]
        for tmp in clist:
            print(tmp, file=out)

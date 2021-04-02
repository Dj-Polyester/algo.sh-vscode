from pathlib import Path
import os

path = os.path.abspath(Path("media", "styles"))
files = os.listdir(path)
refined = [x[:-4] for x in files]
del files
print(refined)
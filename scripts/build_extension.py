"""Build or verify the distributable extension archives using the current source."""

import argparse
import json
from pathlib import Path
import shutil
import zipfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check without writing archives")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    source = root / "chrome-extension"
    version = json.loads((source / "manifest.json").read_text())["version"]
    files = [source / name for name in ("manifest.json", "content.js", "content.css", "README.md")]
    for directory in ("assets", "icons"):
        files.extend(sorted((source / directory).glob("*.png")))
    expected = {path.relative_to(source).as_posix(): path.read_bytes() for path in files}
    dist = root / "dist"
    archives = [dist / f"sona-emotion-sprites-{version}.zip", dist / "sona-emotion-sprites-latest.zip"]

    if not args.check:
        dist.mkdir(exist_ok=True)
        print(f"Building Sona Emotion Sprites {version} ({len(files)} files)", flush=True)
        with zipfile.ZipFile(archives[0], "w", zipfile.ZIP_DEFLATED) as archive:
            for name, data in expected.items():
                archive.writestr(name, data)
        shutil.copyfile(archives[0], archives[1])

    for path in archives:
        if not path.is_file():
            raise SystemExit(f"Missing archive: {path.name}; run this script without --check")
        with zipfile.ZipFile(path) as archive:
            names = [entry.filename for entry in archive.infolist() if not entry.is_dir()]
            if sorted(names) != sorted(expected):
                raise SystemExit(f"File list differs from source: {path.name}")
            for name, data in expected.items():
                if archive.read(name) != data:
                    raise SystemExit(f"Stale file in {path.name}: {name}")
        print(f"Verified {path.name}: every packaged file matches source", flush=True)


if __name__ == "__main__":
    main()

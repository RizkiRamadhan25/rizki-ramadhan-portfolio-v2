"""Generate the portfolio's Open Graph cover with Pillow."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "images" / "og-cover.png"
WIDTH, HEIGHT = 1200, 630


def font(filename, size):
    candidates = [
        Path("C:/Windows/Fonts") / filename,
        Path("/usr/share/fonts/truetype/dejavu") / filename,
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


image = Image.new("RGB", (WIDTH, HEIGHT))
pixels = image.load()
for y in range(HEIGHT):
    for x in range(WIDTH):
        red_glow = max(0, 1 - (((x - 850) / 750) ** 2 + ((y - 80) / 590) ** 2)) ** 2
        blue_glow = max(0, 1 - (((x - 140) / 800) ** 2 + ((y - 600) / 670) ** 2)) ** 2
        pixels[x, y] = (
            int(8 + 108 * red_glow + 10 * blue_glow),
            int(9 + 20 * red_glow + 16 * blue_glow),
            int(15 + 25 * red_glow + 39 * blue_glow),
        )

draw = ImageDraw.Draw(image)
for x in range(72, WIDTH, 88):
    draw.line((x, 0, x, HEIGHT), fill=(31, 27, 38), width=1)
for y in range(72, HEIGHT, 88):
    draw.line((0, y, WIDTH, y), fill=(31, 27, 38), width=1)

cream = (247, 245, 238)
muted = (187, 190, 202)
draw.text((76, 60), "PORTFOLIO / 2026", font=font("arialbd.ttf", 22), fill=cream)
draw.text((982, 60), "JAKARTA / ID", font=font("arial.ttf", 20), fill=cream)
draw.text((68, 152), "RIZKI", font=font("ariblk.ttf", 174), fill=cream)
draw.text((76, 338), "Ramadhan.", font=font("georgiai.ttf", 120), fill=cream)
draw.line((78, 530, 1122, 530), fill=(149, 139, 146), width=2)
draw.text((78, 554), "INFORMATICS ENGINEERING  /  CREATIVE DEVELOPMENT", font=font("arial.ttf", 20), fill=muted)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, optimize=True)
print(OUTPUT)

#!/usr/bin/env python3
"""Redimensiona e exporta WebP + JPEG/PNG otimizados para o portfolio."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "img"


def save_webp(im: Image.Image, dest: Path, quality: int = 82) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB") if im.mode in ("RGBA", "P") else im
    rgb.save(dest, "WEBP", quality=quality, method=6)


def save_jpg(im: Image.Image, dest: Path, quality: int = 72) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    rgb.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)


def resize_fit(im: Image.Image, max_w: int, max_h: int | None = None) -> Image.Image:
    w, h = im.size
    if max_h is None:
        if w <= max_w:
            return im
        ratio = max_w / w
        return im.resize((max_w, int(h * ratio)), Image.Resampling.LANCZOS)
    if w <= max_w and h <= max_h:
        return im
    ratio = min(max_w / w, max_h / h)
    return im.resize((int(w * ratio), int(h * ratio)), Image.Resampling.LANCZOS)


def process_png_pair(src_rel: str, max_w: int, max_h: int | None, webp_q: int = 82) -> tuple[int, int]:
    """Retorna (largura, altura) finais após resize."""
    src = ROOT / src_rel
    if not src.exists():
        raise FileNotFoundError(src)
    im = Image.open(src)
    out = resize_fit(im, max_w, max_h)
    base = src.with_suffix("")
    webp_path = Path(str(base) + ".webp")
    save_webp(out, webp_path, quality=webp_q)
    # PNG otimizado menor que original (paleta ou RGB)
    png_path = Path(str(base) + "-opt.png")
    if out.mode == "RGBA":
        out.save(png_path, "PNG", optimize=True)
    else:
        out.convert("RGB").save(png_path, "PNG", optimize=True)
    return out.size


def hero_background_jpg() -> None:
    """Gera um fundo escuro leve (substitui asset ausente)."""
    w, h = 1920, 1080
    base = Image.new("RGB", (w, h), (15, 30, 28))
    noise = Image.effect_noise((w // 4, h // 4), 40).convert("RGB")
    noise = noise.resize((w, h), Image.Resampling.BILINEAR)
    blended = Image.blend(base, noise, 0.12)
    # vinheta escura
    draw = ImageDraw.Draw(blended)
    for i in range(0, w, 80):
        draw.line([(i, 0), (i + h, h)], fill=(20, 45, 40), width=2)
    blended = blended.filter(ImageFilter.GaussianBlur(radius=1.2))
    save_jpg(blended, IMG / "code-background.jpg", quality=68)


def main() -> None:
    os.chdir(ROOT)
    # Remover duplicados * copy.png
    for p in (IMG / "systagio").glob("* copy.png"):
        p.unlink()
        print("removed", p)

    hero_background_jpg()
    print("wrote", IMG / "code-background.jpg")

    # Avatar hero: exibido ~288px -> 576 retina
    process_png_pair("img/eu2.png", 576, 576, webp_q=80)

    # Cards projetos: largura máxima ~400px col -> 800 retina, altura crop h-48 ~192px
    for sub in ["espacocarioca", "guto", "digipro", "centroempresarial"]:
        process_png_pair(f"img/{sub}/capa.png", 800, 400, webp_q=82)

    # File storage: ícone na UI pequeno
    process_png_pair("img/filestorage/icon.png", 512, 512, webp_q=85)

    # Systagio carrossel: largura ~448–600px -> 1200 largura máx para retina
    systagio = IMG / "systagio"
    for name in [
        "Dashboard.png",
        "7-alunos.png",
        "8-empresas.png",
        "9-estagios.png",
        "10-horarios.png",
        "11-termoContrato.png",
        "gerenciar-relatorio.png",
        "relatorio-1.png",
    ]:
        p = systagio / name
        if p.exists():
            process_png_pair(f"img/systagio/{name}", 1200, 800, webp_q=82)
            print("ok", name)

    print("done.")


if __name__ == "__main__":
    main()

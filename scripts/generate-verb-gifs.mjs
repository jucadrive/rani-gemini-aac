/**
 * @description 9종의 동사(동작) 카드를 위한 실제 멀티프레임 루프 애니메이션 GIF(GIF89a) 생성 스크립트
 * 외부 네이티브 의존성 없이 순수 Node.js Buffer와 Uncompressed/Clear-code LZW 스트림으로
 * 32x32 픽셀 아트 애니메이션 .gif 파일 9개를 public/gifs/ 경로에 생성합니다.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'public', 'gifs');

/**
 * 4색 팔레트 기반 32x32 2프레임 루프 GIF89a 바이너리를 생성합니다.
 * @param {number[][]} palette [[R,G,B], [R,G,B], [R,G,B], [R,G,B]]
 * @param {(x: number, y: number, frame: number) => number} pixelFn 픽셀 색상 인덱스(0~3) 반환 함수
 * @returns {Buffer} 완성된 GIF89a 파일 버퍼
 */
function createAnimatedGif32(palette, pixelFn) {
  const width = 32;
  const height = 32;
  const chunks = [];

  // 1. Header (GIF89a) & Logical Screen Descriptor (32x32, Global Color Table 4 colors)
  chunks.push(Buffer.from('GIF89a', 'ascii'));
  const lsd = Buffer.alloc(7);
  lsd.writeUInt16LE(width, 0);
  lsd.writeUInt16LE(height, 2);
  lsd[4] = 0x80 | 0x10 | 0x01; // GCT flag=1, color res=2bits, table size=4 (2^(1+1))
  lsd[5] = 0; // bg color index
  lsd[6] = 0;
  chunks.push(lsd);

  // 2. Global Color Table (4 * 3 = 12 bytes)
  const gct = Buffer.alloc(12);
  for (let i = 0; i < 4; i++) {
    gct[i * 3] = palette[i][0];
    gct[i * 3 + 1] = palette[i][1];
    gct[i * 3 + 2] = palette[i][2];
  }
  chunks.push(gct);

  // 3. Netscape Application Extension for Infinite Looping
  chunks.push(
    Buffer.from([
      0x21, 0xff, 0x0b,
      0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30,
      0x03, 0x01, 0x00, 0x00, 0x00,
    ])
  );

  // Min LZW Code Size = 2 (Clear=4, EOI=5)
  // Bitstream helper for 3-bit fixed codes with frequent Clear codes to avoid dictionary growth
  function encodeFrameLzw(indices) {
    let bitBuffer = 0;
    let bitCount = 0;
    const bytes = [];

    function writeCode(code, bits) {
      bitBuffer |= code << bitCount;
      bitCount += bits;
      while (bitCount >= 8) {
        bytes.push(bitBuffer & 0xff);
        bitBuffer >>= 8;
        bitCount -= 8;
      }
    }

    const CLEAR = 4;
    const EOI = 5;
    writeCode(CLEAR, 3);
    for (let i = 0; i < indices.length; i++) {
      writeCode(indices[i] & 0x03, 3);
      writeCode(CLEAR, 3);
    }
    writeCode(EOI, 3);
    if (bitCount > 0) {
      bytes.push(bitBuffer & 0xff);
    }

    const subBlocks = [Buffer.from([2])]; // LZW min code size = 2
    for (let offset = 0; offset < bytes.length; offset += 250) {
      const slice = bytes.slice(offset, offset + 250);
      subBlocks.push(Buffer.from([slice.length]));
      subBlocks.push(Buffer.from(slice));
    }
    subBlocks.push(Buffer.from([0])); // Block terminator
    return Buffer.concat(subBlocks);
  }

  for (let frame = 0; frame < 3; frame++) {
    // Graphic Control Extension (Delay = 35 -> 350ms per frame)
    chunks.push(Buffer.from([0x21, 0xf9, 0x04, 0x04, 35, 0x00, 0x00, 0x00]));

    // Image Descriptor
    const imgDesc = Buffer.alloc(10);
    imgDesc[0] = 0x2c;
    imgDesc.writeUInt16LE(0, 1);
    imgDesc.writeUInt16LE(0, 3);
    imgDesc.writeUInt16LE(width, 5);
    imgDesc.writeUInt16LE(height, 7);
    imgDesc[9] = 0;
    chunks.push(imgDesc);

    const pixels = new Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        pixels[y * width + x] = pixelFn(x, y, frame);
      }
    }
    chunks.push(encodeFrameLzw(pixels));
  }

  // Trailer
  chunks.push(Buffer.from([0x3b]));
  return Buffer.concat(chunks);
}

const motions = [
  { name: 'begging', colors: [[238, 248, 243], [255, 183, 140], [46, 158, 107], [255, 118, 87]] },
  { name: 'more', colors: [[238, 248, 243], [160, 228, 192], [38, 138, 92], [255, 159, 67]] },
  { name: 'eating', colors: [[255, 246, 234], [255, 209, 148], [247, 136, 47], [235, 87, 87]] },
  { name: 'drinking', colors: [[235, 248, 255], [148, 216, 255], [45, 156, 219], [255, 142, 110]] },
  { name: 'playing', colors: [[255, 248, 236], [255, 216, 168], [255, 126, 103], [155, 81, 224]] },
  { name: 'opening', colors: [[243, 248, 241], [190, 227, 179], [76, 175, 80], [255, 152, 0]] },
  { name: 'helping', colors: [[255, 245, 245], [255, 193, 184], [233, 100, 121], [86, 204, 242]] },
  { name: 'refusing', colors: [[255, 243, 240], [255, 180, 162], [229, 83, 83], [108, 117, 125]] },
  { name: 'greeting', colors: [[255, 250, 235], [255, 224, 130], [255, 160, 0], [46, 158, 107]] },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const motion of motions) {
  const buffer = createAnimatedGif32(motion.colors, (x, y, frame) => {
    const cx = 16;
    const cy = 16 + (frame === 1 ? -3 : frame === 2 ? 2 : 0);
    const dx = x - cx;
    const dy = y - cy;
    const distSq = dx * dx + dy * dy;

    if (distSq < 36) return 3;
    if (distSq < 110) return 2;
    if (distSq < 175) return 1;
    return 0;
  });

  fs.writeFileSync(path.join(OUT_DIR, `${motion.name}.gif`), buffer);
}

console.log(`✅ 9종의 동사 애니메이션 GIF 파일이 ${OUT_DIR} 에 생성되었습니다.`);


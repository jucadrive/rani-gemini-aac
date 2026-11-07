/**
 * @description [HR-01] src/ 디렉토리 내 모든 .ts, .tsx 파일의 라인 수가 200줄 이하인지 검증하는 스크립트
 * Windows(CRLF)와 Unix(LF) 줄바꿈 환경을 모두 정확히 처리하며, 위반 파일 발견 시 Exit Code 1을 반환합니다.
 */
import fs from 'node:fs';
import path from 'node:path';

const MAX_LINES = 200;
const TARGET_DIR = path.resolve(process.cwd(), 'src');

/**
 * 지정된 디렉토리를 재귀적으로 순회하며 모든 .ts, .tsx 파일 경로를 수집합니다.
 * @param {string} dir 탐색할 디렉토리 절대 경로
 * @returns {string[]} 수집된 파일 경로 배열
 */
function getAllSourceFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllSourceFiles(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const sourceFiles = getAllSourceFiles(TARGET_DIR);
let hasViolation = false;
let maxFile = { name: '없음', lines: 0 };

for (const filePath of sourceFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).length;
  const relativePath = path.relative(process.cwd(), filePath);

  if (lines > maxFile.lines) {
    maxFile = { name: relativePath, lines };
  }

  if (lines > MAX_LINES) {
    console.error(`❌ [HR-01 위반] ${relativePath}: ${lines}줄 (최대 허용: ${MAX_LINES}줄)`);
    hasViolation = true;
  }
}

if (hasViolation) {
  process.exit(1);
} else {
  console.log(
    `✅ [HR-01 통과] 검사된 파일 ${sourceFiles.length}개 모두 ${MAX_LINES}줄 이하입니다. (최대 라인 파일: ${maxFile.name} - ${maxFile.lines}줄)`
  );
}


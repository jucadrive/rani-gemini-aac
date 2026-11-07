# Harness.md — 자율 검증 파이프라인 및 품질 게이트 명세서

본 문서는 `GEMINI.md` 헌법의 **3단계(하네스 자동 검증) ~ 6단계(재검증 및 컨텍스트 정리)**를 기계적으로 집행하기 위한 구체적인 검증 규칙, 스크립트 명세, 에러 복구 프로토콜을 정의한다.

## 1. 하네스 품질 게이트 (Quality Gates)
에이전트는 코드 변경 후 다음 5가지 게이트를 **순서대로(Fail-Fast)** 통과해야만 파트너에게 작업 완료를 보고할 수 있다.

| 게이트 순서 | 명령어 | 검증 도구 | 통과 기준 (Pass Criteria) |
| :--- | :--- | :--- | :--- |
| **Gate 1** | `npm run typecheck` | TypeScript (`tsc --noEmit`) | 컴파일 에러 0건 (`strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`) |
| **Gate 2** | `npm run lint` | ESLint + Prettier | 에러 0건, 경고(Warning) 0건 (`--max-warnings 0`) |
| **Gate 3** | `npm run check:lines` | Node.js 라인 체커 스크립트 | `src/` 하위의 모든 `.ts`, `.tsx` 파일이 각 **200줄 이하** |
| **Gate 4** | `npm run test:run` | Vitest + Testing Library | 모든 테스트 스위트 통과 (신규 유틸/스토어/핵심 컴포넌트 테스트 포함) |
| **Gate 5** | `npm run build` | Vite Production Build | 번들링 에러 0건 및 정적 에셋 생성 성공 |

## 2. 아키텍처 제약 조건의 자동화 방법 (Enforcing Hard Rules)
하드 룰이 단순 선언에 그치지 않도록 ESLint와 검증 스크립트로 강제한다.

1. **단일 파일 200줄 제한 (`[HR-01]`)**:
   - ESLint `max-lines: ["error", { "max": 200, "skipBlankLines": false, "skipComments": false }]` 규칙 적용.
   - 보조 스크립트(`scripts/check-lines.mjs`)를 통해 200줄 초과 파일 발견 시 파일명과 현재 라인 수를 출력하고 Exit Code `1` 반환.
2. **레이어 간 직접 참조 금지 (`[HR-03]`)**:
   - ESLint `no-restricted-imports` 규칙을 통해 `src/components/**` 내부에서 `**/store/**` 및 `**/services/**` 경로 참조 시 즉시 Lint Error 발생.
3. **`any` 금지 및 명시적 반환 타입 (`[HR-02]`)**:
   - `@typescript-eslint/no-explicit-any: "error"`
   - `@typescript-eslint/explicit-function-return-type: ["error", { "allowExpressions": true }]`

## 3. 자가 수정 루프 (Self-Correction Protocol)
- **Attempt 1 ~ 3**: Gate 1~5 중 실패한 단계의 터미널 표준 에러(stderr)를 읽고 원인을 특정하여 해당 파일만 국소 수정 후 `npm run verify` 재실행.
- **200줄 초과 에러 발생 시**: 로직을 축약해 가독성을 해치는(주석 삭제 등) 편법을 절대 쓰지 않고, 하위 UI 컴포넌트 또는 `src/hooks/`, `src/utils/`로 모듈을 분할한다. (주석 삭제를 통한 라인 수 맞추기 엄격 금지)
- **3회 실패 시 (Circuit Breaker 발동)**:
  1. 시도했던 3번의 접근 방식과 각각의 에러 로그 핵심 요약.
  2. 아키텍처적 충돌 지점 분석.
  3. 파트너가 선택할 수 있는 2가지 이상의 해결 대안 제시 후 대기.

## 4. 체크포인트 및 보고 템플릿 (Checkpoint Template)
검증 통과 후 파트너에게 보고할 때는 반드시 아래 포맷을 사용한다.

```text
### ✅ [Phase N 완료 보고]
1. **구현 요약**: (생성/수정된 파일 및 설계 이유 요약)
2. **하네스 검증 결과 (`npm run verify`)**:
   - TypeCheck: PASS
   - Lint (0 warnings): PASS
   - Line Check (<= 200 lines): PASS (최대 라인 파일: OOO.tsx - N줄)
   - Unit Test: PASS (N passed)
   - Build: PASS
3. **Git 체크포인트 제안**:
   - 변경 파일 (`git status`): ...
   - 추천 커밋 메시지: `feat(범위): 한글 요약 설명`
4. **다음 단계 안내**: Phase N+1 진행 승인 요청
```


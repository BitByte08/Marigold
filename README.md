# Marigold
- 데스크톱 환경을 구현한 프론트엔드 프로젝트입니다.
## 기본 구조
bootLoder
- kernel
  - windowManager
    - processManager
    - importManager
    - applications render field

applications
- dataStructureManager

기본적으로 windowManager가 discover(바탕화면 관리 컴포넌트)를 호출합니다.

## API
- 이 프로젝트의 API는 모두 MariAPIManager에 구현되어 있습니다.
---
### MGSetHTML(tag, atbt, start_ctnt, ctnt)
- API 사용시 HTML구문으로 만들어줍니다.
  - 메게변수 타입
    - tag : string
    - atbt : string
    - start_ctnt : number
    - ctnt : string[] | string
- 유의사항
  - attribute가 많을 시 각 attribute를 *띄우지 않고* 쉼표로 구분합니다.
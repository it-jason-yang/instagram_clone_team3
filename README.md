# instagram_clone_team3

항해99 5주차 클론 프로젝트

##### 회원가입 기능

- 회원가입 시 사용자이메일, 전화번호 번호 회원가입 or 사용자이름아이디로 가입 하게 바꿔야됨.
- 현재 and로 가입됨.

-- 메시지 else if(userId == user.userId)조건으로 전화번호 또는 이메일이 중복됨 출력 하려 했으나,
user.userId 찾을수 없음... findOne으로 해봐야될듯

# 3조_backend

https://추후 링크 

https://추후 영상링크

## 프로젝트 소개

### 클로닝 대상 서비스
- Instagram
- link : https://www.instagram.com/

### 구현 기능
- 로그인 (JWT 토큰) 구현
- 게시글 CRUD 구현
- 게시글 좋아요 기능 구현
- 댓글 기능 구현

## 프로젝트 기간
  2021/10/18 ~ 2021/10/22

## 1. Developers

### Backend (Node.js)
  - 양주혁
  - 장재원
  - 홍성현

### Frontend (React)
  - 이아영
  - 조민갑
  - 최진식

## 2. 노션 설계 페이지
https://www.notion.so/yzkim9501/UFO-3-b9bf655f15444276bdc50eda67336904

## 3. 기술스택

|     종류      |  이름   |
| :-----------: | :-----: |
|   개발 언어   | Node.js |
| 데이터베이스  | Mysql |
| 웹 프레임워크 | Express |


## 4. 적용 라이브러리
|     종류      |  설명   |
| :-----------: | :-----: |
|   cors   | 교차 리소스 공유 |
| dotenv  | 환경변수 설정 |
| jsonwebtoken | 회원 계정 JWT 적용 |
|   multer   | 이미지 저장 |
| mysql  | Mysql |
| randomstring | 이미지명 지정 |
|   sequelize   | MySQL ORM |
| winston  | logging |
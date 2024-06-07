# OWS

## 🏋️‍♀️ OWS project

- [배포 웹사이트 링크](http://stephenoeul.shop:3000/api/feeds)
- [API 명세서 링크](https://www.notion.so/teamsparta/17115dc94d6e4b5186b7a17f8f85fb39?v=70bd88b8f3094b91a9634e81c39cc813)
- [ERD 링크](https://drawsql.app/teams/ows-2/diagrams/newsfeed)

### 🏋️‍♂️ 프로젝트 소개

- 운동인을 위한 게시물 작성/관리 사이트 제작
  - 운동 계획, 용품, 일상 등 혼자 하는 것보다 공유하고 싶은 다양한 운동 관련 글을 게시하고 관리할 수 있는 사이트

### 📌 주요 기능

<details>
  <summary>1. 인증</summary>
  <div markdown="1">
    <ul>
      <li>회원가입 : 사용자는 인바디 정보 + 사용자 정보를 입력하여 회원가입 할 수 있습니다.</li>
      <li> 로그인 : 회원가입에 성공한 사용자는 이메일과 패스워드를 통하여 로그인 할 수 있습니다.</li>
      <li>로그아웃 : 로그인한 사용자의 리프레쉬 토큰이 삭제됩니다.</li>
      <li>토큰 재발급 : 만료된 액세스 토큰을 리프레쉬 토큰을 사용하여 재발급합니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>2. 프로필 관리</summary>
  <div markdown="2">
    <ul>
      <li>프로필 조회 : 모든 사용자는 다른 사용자의 프로필을 조회할 수 있습니다.</li>
      <li>프로필 가리기 : 사용자는 언제든 자신의 프로필 정보를 비공개 설정할 수 있습니다.</li>
      <li>프로필 수정 : 로그인한 사용자는 자신의 프로필을 수정할 수 있습니다.</li>
      <li>프로필 로그 생성 : 수정 시 사용자의 수정 로그 기록이 저장됩니다.</li>
      <li>프로필 로그 조회 : 저장된 로그 기록을 활용하여 사용자에게 날짜별 인바디 정보를 제공합니다.</li>
      <li>패스워드 수정 : 사용자는 자신의 패스워드를 수정할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>3. 게시글 CRUD</summary>
  <div markdown="3">
    <ul>
      <li>게시글 생성 : 로그인한 사용자는 게시글을 작성할 수 있습니다.</li>
      <li>게시글 목록 조회 : 모든 사용자는 웹사이트의 모든 글을 조회할 수 있습니다.</li>
      <li>게시글 수정 : 로그인한 사용자는 게시글을 수정할 수 있습니다.</li>
      <li>게시글 삭제 : 로그인한 사용자는 게시글을 삭제할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>4. 댓글 CRUD</summary>
  <div markdown="4">
    <ul>
      <li>댓글 생성 : 로그인한 사용자는 댓글을 작성할 수 있습니다.</li>
      <li>댓글 목록 조회 : 모든 사용자는 웹사이트의 모든 댓글을 조회할 수 있습니다.</li>
      <li>댓글 수정 :로그인한 사용자는 댓글을 수정할 수 있습니다.</li>
      <li>댓글 삭제 : 로그인한 사용자는 댓글을 삭제할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>5. 팔로우 기능</summary>
  <div markdown="5">
    <ul>
      <li>팔로우 : 로그인한 사용자는 다른 사용자를 팔로우할 수 있습니다.</li>
      <li>언팔로우 : 로그인한 사용자는 다른 사용자를 언팔로우할 수 있습니다..</li>
      <li>팔로잉, 팔로워 확인 :로그인한 사용자는 본인의 팔로잉, 팔로워를 확인할 수 있습니다.</li>
      <li>팔로잉하는 유저들의 글 보기 : 로그인한 사용자는 팔로잉하는 유저들의 글을 우선적으로 확인할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>6. 좋아요 기능</summary>
  <div markdown="6">
    <ul>
      <li>게시물 좋아요 : 로그인한 사용자는 게시물에 '좋아요'를 표시할 수 있습니다.</li>
      <li>게시물 좋아요 해제 : 로그인한 사용자는 게시물에 '좋아요'를 해제할 수 있습니다.</li>
      <li>댓글 좋아요 : 로그인한 사용자는 댓글에 '좋아요'를 표시할 수 있습니다.</li>
      <li>댓글 좋아요 해제 : 로그인한 사용자는 댓글에 '좋아요'를 해제할 수 있습니다.</li>
    </ul>
  </div>
</details>

## 📜 프로젝트 기획 및 설계

### Minutes of meeting

- [팀 프로젝트 S.A.](https://teamsparta.notion.site/OWS-eb3f0d04b66d41cda9bab74c22c23410)
- [팀 프로젝트 회의록](https://teamsparta.notion.site/1945327151094e7391b931d911c8615a?v=fc0347d07df74071941e0c16943cfbf8)

### [Code Convention](https://teamsparta.notion.site/Code-Convention-5a60e68b0c3149c89c870984bfd44a1f)

### Github Rules

| 작업 타입   | 작업 내용                                |
| ----------- | ---------------------------------------- |
| ✨ Update   | 해당 파일에 새로운 기능이 생김           |
| 🎉 Feat     | 없던 파일을 생성함, 초기 세팅, 기능 구현 |
| ♻️ Refactor | 코드 리팩토링                            |
| 🩹 Fix      | 코드 수정                                |

## 📂 프로젝트 구성

### 폴더 구조

```markdown
📦node_modules
📦prisma
┣ schema.prisma
📦src
┣ 📂constants
┃ ┣ 📜auth.constant.js
┃ ┣ 📜comment.constant.js
┃ ┣ 📜env.constant.js
┃ ┣ 📜http-status.constant.js
┃ ┗ 📜message.constant.js
┣ 📂middlewares
┃ ┣ 📂validators
┃ ┃ ┣ 📜create-comment-validator.middleware.js
┃ ┃ ┣ 📜feed-create-validator.middleware.js
┃ ┃ ┣ 📜feed-update-validator.middleware.js
┃ ┃ ┣ 📜sign-in-validator.middleware.js
┃ ┃ ┣ 📜sign-up-validator.middleware.js
┃ ┃ ┣ 📜update-comment-validator.middleware.js
┃ ┃ ┗ 📜user-profile-validator.middleware.js
┃ ┣ 📜error-handler.middleware.js
┃ ┣ 📜require-access-token.middleware.js
┃ ┗ 📜require-refresh-token.middleware.js
┣ 📂routers
┃ ┣ 📜auth.router.js
┃ ┣ 📜comments.router.js
┃ ┣ 📜feeds.router.js
┃ ┣ 📜follow.router.js
┃ ┣ 📜index.js
┃ ┣ 📜like.router.js
┃ ┗ 📜user.router.js
┣ 📂utils
┃ ┃ ┗ 📜prisma.util.js
┗ 📜app.js
.env
.gitignore
.prettierrc
eslint.config.js
package.json
README.md
yarn.lock
```

## ✨ 사용 기술

![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-2D3748?style=for-the-badge&logo=AWS&logoColor=black)
![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)

## 👨‍👨‍👦‍👦 프로젝트 제작 인원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/kne6379"><img src="https://avatars.githubusercontent.com/u/128128422?v=4" width="100px;" alt="김노을"/><br /><sub><b> 팀장 : 김노을 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/blueclorox/"><img src="https://avatars.githubusercontent.com/u/165770132?v=4" width="100px;" alt="김호연"/><br /><sub><b> 팀원 : 김호연 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/hwangmindo"><img src="https://avatars.githubusercontent.com/u/167045161?v=4" width="100px;" alt="황민도"/><br /><sub><b> 팀원 : 황민도 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/xszvvfm"><img src="https://avatars.githubusercontent.com/u/161733851?v=4" width="100px;" alt="방채은"/><br /><sub><b> 팀원 : 방채은 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

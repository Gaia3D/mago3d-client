# Frontend

* Monorepo 구조를 기반으로 구성
* Docker와 Nginx 웹 서버를 사용하여 서비스
* PNPM을 사용하여 프로젝트 관리
* 빌드의 구성을 단순하게 하기 위해 root 디렉토리에 [Dockerfile](Dockerfile) 파일과 [docker-compose.yml](docker-compose.yml) 파일을 추가

## 프로젝트 구조

* admin: 관리자 페이지
* user: 사용자 페이지
* portal: 포털 페이지
* shared: 공유 라이브러리

```text
front/
├── packages/
│   ├── admin/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── ...
│   ├── user/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── ...
│   ├── portal/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── ...
│   ├── shared/
│   │   ├── src/
│   │   └── ...
├── docker-compose.yml
├── pnpm-lock.yaml
└── README.md
```

## 도커 이미지 생성
[docker-compose.yml](docker-compose.yml) 파일을 사용하여 이미지 생성

 ```shell
  $ docker compose build
 ```

## 도커 이미지 배포
[docker-compose.yml](docker-compose.yml) 파일을 사용하여 이미지 배포

 ```shell
  $ docker compose push
 ```

## 프로젝트 실행 및 접근

[docker-compose.yml](docker-compose.yml) 파일을 사용하여 실행

 ```shell
  $ docker compose up -d
 ```

* 어드민 프로젝트: http://localhost:3000
* 포털 프로젝트: http://localhost:3001
* 사용자 프로젝트: http://localhost:3002

### require nodejs, pnpm

npm install -g pnpm@latest

### 전체 디펜던시 설치

pnpm install

### 전체 실행

pnpm dev


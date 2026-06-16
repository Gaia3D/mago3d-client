# frontend 배포 가이드

* 작업 디렉토리 이동
```shell
  cd front
```
* 이미지 빌드
```shell
  docker compose build
```

* 이미지 푸시
```shell
  docker compose push
```

* 서버 접속
```shell
  ssh {사용자계정}@{접속아이피} -p {접속포트}
```

## 기존 컨테이너 및 이미지 제거
```shell
  docker stop mago3d-frontend-1
  docker rm mago3d-frontend-1
  docker rmi gaia3d/mago3d-frontend-forest:latest
```

## 배포 스크립트 실행
```shell
  cd deploy
```

```shell
  ./compose.sh up -d
```

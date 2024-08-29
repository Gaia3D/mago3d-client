##BUILD##
# 빌더 단계에서는 공식 Node LTS 이미지를 베이스 이미지로 사용합니다.
# 이는 장기적인 지원을 받을 수 있는 버전으로서 프로덕션 환경에서 사용하기에 적합합니다.
# 이 단계는 애플리케이션을 빌드하고 준비하는 역할을 합니다.
FROM node:lts as builder

# Corepack와 PNPM 설치
# Corepack을 활성화하여 종속성 관리를 제공하며, PNPM 패키지 매니저를 준비합니다.
RUN corepack enable \
    && corepack prepare pnpm@latest --activate

# 작업 디렉터리를 컨테이너 내부의 /app으로 설정합니다.
WORKDIR /app

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./

RUN pnpm fetch

ADD . ./
RUN pnpm install

# Build the app
RUN pnpm --prefix packages/admin run codegen
RUN pnpm --prefix packages/admin run build
RUN pnpm --prefix packages/user run build

# docker build 명령어로 이미지를 생성하려면 다음 명령어를 실행합니다.
# docker build --target [stage] -t [image name] .
# stage: admin, portal, user
# 예시: docker build --target admin -t mdtp/fe-admin .

# 최종 단계: 모든 애플리케이션 빌드 결과물을 Nginx 이미지에 복사합니다.
# 또한 nginx configuration 파일을 복사하여 Nginx 설정을 적용합니다.
FROM nginx as front
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
# COPY --from=builder /app/packages/portal/dist /usr/share/nginx/html/portal
COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html/geomatic-admin
COPY --from=builder /app/packages/user/dist /usr/share/nginx/html/geomatic-user

# 최종 단계: admin 애플리케이션 빌드 결과물을 Nginx 이미지에 복사합니다.
# FROM nginx as admin
# COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html

# 최종 단계: portal 애플리케이션 빌드 결과물을 Nginx 이미지에 복사합니다.
# FROM nginx as portal
# COPY --from=builder /app/packages/portal/dist /usr/share/nginx/html

# 최종 단계: user 애플리케이션 빌드 결과물을 Nginx 이미지에 복사합니다.
# FROM nginx as user
# COPY --from=builder /app/packages/user/dist /usr/share/nginx/html
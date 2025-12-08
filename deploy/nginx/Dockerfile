# 파일 다운로드용 보안 웹 서버
# 기반 이미지: nginx alpine (경량 + 보안 패치 빠름)
FROM nginx:1.27-alpine

# 보안: 불필요한 패키지 제거 및 업데이트
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache tini && \
    rm -rf /var/cache/apk/*

# 보안: non-root 사용자 생성
RUN addgroup -g 1001 -S fileserver && \
    adduser -u 1001 -S fileserver -G fileserver

# 기본 nginx 설정 제거
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# 커스텀 nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# 다운로드 디렉토리 생성 및 권한 설정
RUN mkdir -p /data/files && \
    chown -R fileserver:fileserver /data/files && \
    chmod 755 /data/files

# nginx 캐시/로그 디렉토리 권한 설정 (non-root 실행용)
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R fileserver:fileserver /var/cache/nginx /var/log/nginx /var/run && \
    chmod -R 755 /var/cache/nginx /var/log/nginx

# 보안: 불필요한 파일 권한 제한
RUN chmod 644 /etc/nginx/nginx.conf && \
    chmod 644 /etc/nginx/conf.d/default.conf

# 보안: non-root 사용자로 실행
USER fileserver

# 볼륨 마운트 포인트
VOLUME ["/data/files"]

# 포트 노출 (1024 이상 - non-root 가능)
EXPOSE 8080

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# tini를 init으로 사용 (좀비 프로세스 방지)
ENTRYPOINT ["/sbin/tini", "--"]

# nginx 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]
# Terrain 변환

Terrain 변환은 3D 환경에서 지형 데이터를 생성하고 조작하는 데 사용되는 기술입니다. 이 문서에서는 Terrain 변환 과정을 설명합니다.

## 1. 원본 데이터 처리
원본 데이터(*.img) 파일을 변환이 가능한 포멧(*.tif)으로 변환합니다. 이를 위해 GDAL 라이브러리를 사용할 수 있습니다.
아래는 gdal 도커 이미지를 사용하여 변환하는 스크립트입니다.

### `img_to_tif.sh` 내용:
```bash
#!/usr/bin/env bash
# 목적:
#  /SRC_ROOT/**/*.img  (EPSG:5186)  →  /DST_ROOT/tif/같은 구조/*.tif (EPSG:4326)
#  Docker 이미지: ghcr.io/osgeo/gdal:alpine-small-latest

set -euo pipefail

# 설정
SRC_ROOT="/{SRC_ROOT}"
DST_ROOT="/{DST_ROOT}"
IMAGE="ghcr.io/osgeo/gdal:alpine-small-latest"
LOG_DIR="$HOME/logs"
LOG_FILE="$LOG_DIR/gdal_conversion_$(date +%Y%m%d_%H%M%S).log"
PID_FILE="$LOG_DIR/gdal_conversion.pid"
PROGRESS_FILE="$LOG_DIR/gdal_progress.txt"

# 로그 디렉토리 생성
mkdir -p "$LOG_DIR"

# 로깅 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log_progress() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE" > "$PROGRESS_FILE"
}

# 시그널 핸들러 (Ctrl+C 등으로 중단 시)
cleanup() {
    log "🛑 스크립트가 중단되었습니다."
    rm -f "$PID_FILE"
    exit 1
}
trap cleanup INT TERM

# PID 파일 생성
echo $$ > "$PID_FILE"

log "🚀 변환 작업 시작"
log "📁 소스: $SRC_ROOT"
log "📁 대상: $DST_ROOT"
log "📋 로그: $LOG_FILE"

# (1) 결과 루트 폴더 준비
mkdir -p "$DST_ROOT"
log "✅ 대상 디렉토리 생성 완료"

# (2) 이미지 미리 받아두기
log "🐳 Docker 이미지 다운로드 중..."
if docker pull "$IMAGE" >> "$LOG_FILE" 2>&1; then
    log "✅ Docker 이미지 다운로드 완료"
else
    log "❌ Docker 이미지 다운로드 실패"
    exit 1
fi

# (3) 전체 파일 수 계산
log "📊 변환할 파일 수 계산 중..."
TOTAL_FILES=$(find "$SRC_ROOT" -type f -iname '*.img' | wc -l)
log "📊 총 ${TOTAL_FILES}개 파일 발견"

if [ "$TOTAL_FILES" -eq 0 ]; then
    log "⚠️  변환할 .img 파일이 없습니다."
    rm -f "$PID_FILE"
    exit 0
fi

# (4) 소스 트리 전체 순회: *.img → 같은 상대경로에 .tif
CURRENT=0
SKIPPED=0
CONVERTED=0
FAILED=0

find "$SRC_ROOT" -type f -iname '*.img' -print0 | while IFS= read -r -d '' SRC_PATH; do
    CURRENT=$((CURRENT + 1))
    
    # SRC_ROOT 기준 상대경로 계산
    REL_PATH="${SRC_PATH#"$SRC_ROOT"/}"
    REL_DIR="$(dirname "$REL_PATH")"
    BASENAME="$(basename "$SRC_PATH")"
    STEM="${BASENAME%.*}"
    OUT_DIR="$DST_ROOT/$REL_DIR"
    OUT_PATH="$OUT_DIR/$STEM.tif"
    
    log_progress "[$CURRENT/$TOTAL_FILES] 처리 중: $REL_PATH"
    
    # 이미 존재하는지 확인
    if [ -f "$OUT_PATH" ]; then
        log "↩️  이미 존재하여 스킵 [$CURRENT/$TOTAL_FILES]: $OUT_PATH"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    # 출력 폴더 생성
    mkdir -p "$OUT_DIR"
    log "▶ 변환 시작 [$CURRENT/$TOTAL_FILES]: $SRC_PATH → $OUT_PATH"
    
    # (5) Docker로 gdalwarp 실행: 5186 → 4326
    if docker run --rm \
        -u "$(id -u)":"$(id -g)" \
        -v "$SRC_ROOT":/src:ro \
        -v "$DST_ROOT":/dst \
        "$IMAGE" \
        gdalwarp -s_srs EPSG:5186 -t_srs EPSG:4326 \
        "/src/$REL_PATH" "/dst/$REL_DIR/$STEM.tif" \
        >> "$LOG_FILE" 2>&1; then
        
        log "✅ 변환 완료 [$CURRENT/$TOTAL_FILES]: $STEM.tif"
        CONVERTED=$((CONVERTED + 1))
    else
        log "❌ 변환 실패 [$CURRENT/$TOTAL_FILES]: $SRC_PATH"
        FAILED=$((FAILED + 1))
    fi
    
    # 진행률 표시 (10% 단위로)
    PROGRESS=$((CURRENT * 100 / TOTAL_FILES))
    if [ $((CURRENT % (TOTAL_FILES / 10 + 1))) -eq 0 ]; then
        log "📈 진행률: ${PROGRESS}% ($CURRENT/$TOTAL_FILES)"
    fi
done

# 최종 결과
log "🎉 작업 완료!"
log "📊 전체: $TOTAL_FILES, 변환: $CONVERTED, 스킵: $SKIPPED, 실패: $FAILED"
log "📁 결과 위치: $DST_ROOT"

# PID 파일 제거
rm -f "$PID_FILE"

log "✅ 모든 작업이 완료되었습니다."
```

### 스크립트 실행하기
```shell
./imgtotif.sh
```
위 스크립트는 지정된 소스 디렉토리에서 모든 `.img` 파일을 찾아 동일한 상대 경로에 `.tif` 파일로 변환합니다.

## 2. Terrain 변환
원본 데이터(*.tif) 파일을 Cesium의 QuantizedMesh로 변환합니다.    
이를 위해 적절한 도구를 사용하여 변환할 수 있습니다.    
mago3DTerrainer를 이용하여 변환하는 스크립트 입니다.

### `run_terrainer.sh` 내용:
```shell
#!/usr/bin/env bash
set -euo pipefail  # 오류 즉시 중단, 미정의 변수 금지, 파이프라인 오류 전파

# === 설정 ===
HOST_ROOT="/{HOST_ROOT}"                 # 호스트 루트
IMAGE="gaia3d/mago-3d-terrainer"       # 도커 이미지
NAME="mago-terrainer"                  # 컨테이너 이름(중복 방지)
LOCK="/tmp/${NAME}.lock"               # 락 파일

INPUT_DIR="$HOST_ROOT/tif"
OUTPUT_DIR="$HOST_ROOT/terrain"
LOG_DIR="$OUTPUT_DIR"
TS="$(date +%Y%m%d_%H%M%S)"
RUN_LOG="$LOG_DIR/run_${TS}.log"       # 호스트 표준로그
APP_LOG="/workspace/terrain/log.txt"   # 컨테이너 내부 앱로그(마운트 통해 호스트에서도 확인 가능)

mkdir -p "$OUTPUT_DIR"

# === 동시 실행/중복 컨테이너 방지 ===
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "이미 다른 실행 인스턴스가 동작 중입니다. (lock: $LOCK)"
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  # 남아있는 컨테이너가 있으면 제거(혹은 종료)
  docker rm -f "$NAME" >/dev/null 2>&1 || true
fi

# === (선택) 최신 이미지 풀 ===
# docker pull "$IMAGE" || true

# === 실행 ===
echo "로그: $RUN_LOG"
nohup docker run --rm \
  --name "$NAME" \
  -v "$HOST_ROOT:/workspace" \
  "$IMAGE" \
  --input /workspace/tif \
  --output /workspace/terrain \
  --log "$APP_LOG" \
  -cn --minDepth 0 --maxDepth 17 \
  > "$RUN_LOG" 2>&1 &

PID=$!
echo "시작됨. PID: $PID"
echo "tail -f \"$RUN_LOG\"  로 표준로그 모니터링"
echo "tail -f \"$OUTPUT_DIR/log.txt\"  로 앱로그(GDAL) 모니터링"
```
위 스크립트는 백그라운드에서 도커 컨테이너를 실행하며, 변환 로그는 지정된 로그 파일에 기록됩니다.


### 스크립트 실행하기
```shell
./run_terrainer.sh
```
이 스크립트를 실행하면 지정된 입력 디렉토리의 모든 `.tif` 파일이 Cesium의 QuantizedMesh 형식으로 변환되어 출력 디렉토리에 저장됩니다.


## 3. 모니터링
변환 작업이 진행되는 동안 로그 파일을 모니터링하여 진행 상황을 확인할 수 있습니다.

```shell
tail -f /dev/DATA2/terrain/log.txt      # 앱(타일링/표준화) 진행 로그
tail -f /dev/DATA2/terrain/run_*.log    # 컨테이너 표준 출력/에러 통합 로그
docker ps | grep mago-terrainer         # 실행 여부
```
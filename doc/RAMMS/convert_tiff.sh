#!/bin/bash

# 입력 폴더와 출력 폴더 설정
INPUT_DIR="/input"
OUTPUT_DIR="/output"

# 입력 폴더 내 모든 .tif 파일 변환
for file in "$INPUT_DIR"/*.tif; do
    filename=$(basename "$file" .tif)  # 확장자 제거한 파일명

    echo "Converting: $file -> $OUTPUT_DIR/${filename}.tif"

    # 좌표계 지정 (EPSG:5179) 및 메타데이터 제거
    gdal_translate -of GTiff -a_srs EPSG:5179 "$file" "$OUTPUT_DIR/${filename}.tif";
    gdal_edit.py -unsetmd "$OUTPUT_DIR/${filename}.tif"
done
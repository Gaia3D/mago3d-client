## RAMMS 데이터 처리
### RAMMS 데이터 전처리

1-1. `convert_tiff.sh` 스크립트 작성   

```shell 
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
```

1-2. 도커를 이용하여 변환 스크립트 실행   
```
   docker run --rm ^
   -v "{input}":/input ^
   -v "{output}":/output ^
   -v "C:/workspace/convert_tiff.sh":/script/convert_tiff.sh ^
   ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 bash /script/convert_tiff.sh
```
   * {input} : 변환할 tif 파일이 있는 폴더
   * {output} : 변환된 tif 파일을 저장할 폴더

1-3. 출력 폴더에 설정 파일 추가
indexer.properties
```
# Time attribute in the dataset, using the ingestion column
TimeAttribute=ingestion

# Elevation attribute in the dataset
ElevationAttribute=elevation

# Schema definition, with the time field ingestion as a Date
Schema=*the_geom:Polygon,location:String,ingestion:String,elevation:Integer

# Property collectors to extract the time using timeregex
PropertyCollectors=TimestampFileNameExtractorSPI[timeregex](ingestion)
```
timeregex.properties
```
regex=[0-9]
```

### RAMMS 데이터 지오서버 작업
1. 서버에 변환한 파일 업로드
2. 폴더를 geoserver 도커에 복사
    ```shell
    docker cp /{output} mago3d-geoserver-1:/opt/geoserver/data_dir/data
    ```
3. 지오서버 이미지 모자이크 저장소 생성
4. 저장소 이름, 연결 파라미터 입력 후 저장 및 적용
5. 에러 발생 시 대처
   * 도커 컨테이너 접속
   ```shell
   docker exec -it mago3d-geoserver-1 bash
   ```
   * 저장소 위치로 이동
   ```shell
   cd /opt/geoserver/data_dir/data/{output}
   ```
   * 권한 확인
    ```shell
   ls -al
    ```
   * 권한 변경
   ```shell
   chown -R geoserveruser:geoserverusers .
   ```
   * 모드 변경
   ```shell
   chmod -R 775 .
   ```

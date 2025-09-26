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
       docker cp /{output} mago3d-geoserver-1:/opt/geoserver/data_dir/data/{output}
   ```
   * 권한 변경
   ```shell
       docker exec container_name chown -R geoserveruser:geoserverusers /opt/geoserver/data_dir/data/{output}
   ```
   * 모드 변경
   ```shell
       docker exec container_name chmod -R 775 /opt/geoserver/data_dir/data/{output}
   ```
3. 지오서버 이미지 모자이크 저장소 생성
4. 저장소 이름, 연결 파라미터 입력 후 저장 및 적용
5. 레이어 발행 시 스타일은 debris를 사용
6. 테스트는 레이어 미리보기에서 CQL_FILTER에 다음을 입력 location='0.tif'

### RAMMS 소스 적용
AsideSimulation.tsx 파일에 layers를 새로 추가해야 함.   
```
interface LayersData {
   area: string;
   caseName: string;
   bbox: number[];
   layerName: string;
   interval: number;
   min: number;
   max: number;
}
```
area는 시뮬레이션 대상지역과 맵핑되는 값임.
```
<label>대상지역</label>
<select style={{width: "240px"}} className="custom-select" id="simulationAreaSelectBox"
                onChange={selectArea}>
    <option value="" hidden>대상지역 선택</option>
    <option value="mungyeong1">1 경상북도 문경시 동로면 수평리 산68임 일대</option>
    <option value="mungyeong2">2 경상북도 문경시 동로면 수평리 산68임 일대</option>
    <option value="yeongju1">1 경상북도 영주시 풍기읍 삼가리 산22-1임 일대</option>
    <option value="yecheon1">1 경상북도 예천군 용문면 사부리 산100임 일대</option>
    <option value="yecheon2">2 경상북도 예천군 용문면 사부리 산100임 일대</option>
    <option value="seocheon_yuli">1 서천군 비인면 율리 산101-1 일대</option>
</select>
```
caseName은 대상지역을 선택하면 나오는 하위 항목임
bbox는 지오서버 rest api로 확인이 가능
```
https://{도메인}/geoserver/rest/workspaces/mago3d/coveragestores/{저장소명}/coverages/{레이어명}.json
```
응답결과에 "latLonBoundingBox" 값을 참고
interval은 실제 RAMMS 데이터 결과가 몇 초 간격인지 설정
min, max는 RAMMS 데이터 결과의 최소, 최대 값을 설정
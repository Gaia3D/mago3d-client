export type AnalysisFeature = {
    name: string;
    filter?: string;
}
export type AnalysisFeatureLayer = Record<string , AnalysisFeature | string>;
export type AnalysisFeatureLayerInfo = Record<string, AnalysisFeatureLayer>;
export const DefaultAnalysisLayer:AnalysisFeatureLayerInfo = {
	"statistics:FieldManeuver": {

		// 야지기동 분석	
		slopeFeatures: {
			name: "경사도", filter: "gsc IN (1,  2)"
		},

		vegetationFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('210', '220', '240', '410', '420') OR l3_code IN ('252', '622', '623')"
		},

		soilFeatures: {
			name: "토질도", filter: "tpgrp_tpcd IN ('01', '02', '03', '04', '05')"
		},

		townFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('110', '120', '130', '160')"
		},

		drainageFeatures: {
			name: "토지피복도_세분류", filter: "l2_code = '710'"
		},
	},


	"statistics:Penetration": {

		// 공중침투 분석	
		slopeFeatures: {
			name: "경사도", filter: "gsc = 1"
		},

		vegetationFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('210', '220', '240', '410', '420') OR l3_code IN ('252', '622', '623')"
		},

		forestFeatures: {
			name: "식생도_산림", filter: "dmcls_cd = '0'"
		},

		townFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('110', '120', '130', '160')"
		},

		drainageFeatures: {
			name: "토지피복도_세분류", filter: "l2_code = '710'"
		},

		transFeatures: {
			name: "송전탑", filter: ""
		},
	},

	"statistics:OptimalStation": {

		// 주둔 최적지 분석	
		slopeFeatures: {
			name: "경사도", filter: "gsc = 1"
		},

		vegetationFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('210', '220', '240', '410', '420') OR l3_code IN ('252', '622', '623')"
		},

		soilFeatures: {
			name: "토질도", filter: "tpgrp_tpcd IN ('01', '02', '03', '04', '05') OR slant_typ_cd IN ('1', '2', '3')"
		},

		roadFeatures: {
			name: "수송도도로링크", filter: ""
		},

		drainageFeatures: {
			name: "토지피복도_세분류", filter: "l2_code = '710'"
		},

		drainageExFeatures: {
			name: "토지피복도_세분류", filter: "l2_code = '710'"
		},
	},

	"statistics:EnemyObservation": {

		// 적종팀 은거 및 관측 분석	
		slopeFeatures: {
			name: "경사도", filter: "gsc IN (1,  2)"
		},

		forestFeatures: {
			name: "식생도_산림", filter: "dnst_cd = 'C' AND dmcls_cd = '2'"
		},

		soilFeatures: {
			name: "토질도", filter: "tpgrp_tpcd IN ('01', '02', '03', '04', '05') OR slant_typ_cd IN ('1', '2', '3')"
		},

		townFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('110', '120', '130', '160')"
		},

		drainageFeatures: {
			name: "토지피복도_세분류", filter: "l2_code = '710'"
		},

		dmzFeatures: {
			name: "비무장지대", filter: ""
		},
	},

	'statistics:FrozenArea': {

		// 상습 결빙지역 분석	
		roadFeatures: {
			name: "수송도도로링크", filter: ""
		},

		slopeFeatures: {
			name: "경사도", filter: "gsc IN (1, 2)"
		},

		aspectFeatures: {
			name: "향", filter: "gsc = 1"
		},

		hillshadeFeatures: {
			name: "음영", filter: "gsc = 1"
		},

	},

	"statistics:Cover": {

		// 엄폐 분석	
		slopeFeatures: {
			name: "경사도", filter: "gsc IN (0, 1, 2)"
		}, // 양호 : "gsc = 2", 보통 : "gsc = 1", 불량 : "gsc = 0" 조건식 구분

		forestFeatures: {
			name: "식생도_산림", filter: "dmcls_cd IN ('1', '2', '3') OR dnst_cd IN ('A', 'B', 'C') OR storunst_cd = '0'"
		}, // 양호 : dmcls_cd IN ('2', '3') AND dnst_cd IN ('B', 'C'), 보통 : dmcls_cd = '1' AND dnst_cd = 'A', 불량 : storunst_cd = '0'

		soilFeatures: {
			name: "토질도", filter: "prrck_mddl_cd IN ('11', '21', '22', '23', '24', '25', '26', '27')"
		},

		townFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('110', '120', '130', '160')"
		},

		drainageFeatures: {
			name: "토지피복도_세분류", filter: "l2_code = '710'"
		},
	},

	"statistics:Concealment": {

		// 은폐 분석	
		forestFeatures: {
			name: "식생도_산림", filter: ""
		}, // 양호 : koftr_group_cd IN ('11', '14', '60', '66') AND dnst_cd = 'C', 보통 : koftr_group_cd IN ('11', '14', '60', '66') AND dnst_cd = 'B', 불량 : storunst_cd ='0' AND dnst_cd = 'A'
		goodFilter: "(koftr_group_cd IN ('11', '14', '60', '66') AND dnst_cd = 'C')",
		normalFilter: "(dnst_cd IN ('A', 'B', 'C') AND dnst_cd = 'B')",
		// poorFilter: "(storunst_cd ='0' AND dnst_cd = 'A')"
		poorFilter: "(storunst_cd ='0' AND dnst_cd = 'A')"
	},

	"statistics:AvenueOfApproach": {

		// 피아접근로 분석	
		slopeFeatures: {
			name: "경사도", filter: "gsc IN (1,  2)"
		},

		forestFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('210', '220', '240', '410', '420') OR l3_code IN ('252', '622', '623')"
		},

		soilFeatures: {
			name: "토질도", filter: "tpgrp_tpcd IN ('01', '02', '03', '04', '05')"
		},

		townFeatures: {
			name: "토지피복도_세분류", filter: "l2_code IN ('110', '120', '130', '160')"
		},

		drainageFeatures: {
			name: "토지피복도_세분류", filter: "l2_code = '710'"
		},

		roadFeatures: {
			name: "수송도도로링크", filter: ""
		},
	},
	"statistics:EscapeRange": {
		// 피아접근로 분석	
		speedRaster: {
			name: "속도래스터"
		}
	},
}

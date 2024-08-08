import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
		i18n.changeLanguage(e.target.value)
			.then(r => console.log(r));
	};

	return (
		<>
			<div style={{display:"flex", justifyContent:"flex-start", padding:"10px 20px"}}>
				<select onChange={changeLanguage} defaultValue={i18n.language}>
					<option value="en">English</option>
					<option value="ko">한국어</option>
				</select>
			</div>
		</>
	);
};

export default LanguageSelector;
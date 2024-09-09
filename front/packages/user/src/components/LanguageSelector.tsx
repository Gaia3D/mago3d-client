import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
	const { i18n } = useTranslation();
	const popLayer = useRef<HTMLDivElement | null>(null);
	const [nowLang, setNowLang] = useState('');

	const togglePopLayer = useCallback(() => {
		if (popLayer.current) {
			popLayer.current.classList.toggle('on');
		}
	}, []);

	const changeLanguage = useCallback((lang: string) => {
		i18n.changeLanguage(lang).then(() => console.log(`Language changed to ${lang}`));
		setNowLang(lang);
		togglePopLayer();
	}, [i18n]);

	const languageItems = [
		{ lang: "en", text: "English" },
		{ lang: "ko", text: "한국어" },
	];

	useEffect(() => {
		setNowLang(i18n.language);
	}, [i18n.language]);

	return (
		<>
			<button onClick={togglePopLayer} type="button" className={`lang-icon ${nowLang}`}></button>
			<div ref={popLayer} className={"pop-layer lang"}>
				<ul>
					{languageItems.map((item) => (
						<li
							key={item.lang}
							onClick={() => changeLanguage(item.lang)}
							className={nowLang === item.lang ? "selected" : ""}
						>
							<span className={"text"}>{item.text}</span>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default LanguageSelector;
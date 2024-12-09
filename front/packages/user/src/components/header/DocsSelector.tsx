import React, {useState} from 'react';
import {useTranslation} from "react-i18next";

const DocsSelector = () => {
    const {t} = useTranslation();
    const [pop, setPop] = useState(false);

    const DOC_LINKS = [
        {
            title: t("document.title.introduction"),
            url: t("document.url.introduction")
        },{
            title: t("document.title.installation"),
            url: t("document.url.installation")
        },{
            title: t("document.title.user"),
            url: t("document.url.user")
        },{
            title: t("document.title.api"),
            url: t("document.url.api")
        },{
            title: t("document.title.training"),
            url: t("document.url.training")
        },
    ]

    return (
        <div className="docs-selector-container">
            <button onClick={() => setPop(!pop)}/>
            <div className={`pop-layer ${pop ? "on" : "off"}`}>
                <div className="flex-column">
                {
                    DOC_LINKS.map((link, index) => (
                        <a href={link.url} target="_blank" className="link-row" key={index}>
                            {link.title}
                        </a>
                    ))
                }
                </div>
            </div>
        </div>
    );
};

export default DocsSelector;
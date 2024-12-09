import React, {useState} from 'react';

const DOC_LINKS = [
    {
        title: "English docs",
        url: "https://github.com/Gaia3D/mago3d-doc/tree/main/lang/en"
    },{
        title: "हिंदी दस्तावेज़",
        url: "https://github.com/Gaia3D/mago3d-doc/tree/main/lang/hi"
    },{
        title: "한국어 문서",
        url: "https://github.com/Gaia3D/mago3d-doc/tree/main/lang/ko"
    },{
        title: "เอกสารภาษาไทย",
        url: "https://github.com/Gaia3D/mago3d-doc/tree/main/lang/th"
    },
]
const DocsSelector = () => {
    const [pop, setPop] = useState(false);
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
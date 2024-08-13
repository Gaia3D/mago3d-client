import React, {useState} from 'react';

const assetsData: Asset[]  = [
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "3D",  name: "3DS-ICQF-QEYS-DKZA-JKT",  upload: "2022-07-15 18:16:46",  status: "fail"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "Wea.",  name: "QEYS-DKZA-JKT",  upload: "2023-07-15 18:16:46",  status: "running"},
    { type: "Wea.",  name: "QEYS-DKZA-JKT",  upload: "2023-07-15 18:16:46",  status: "running"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "3D",  name: "3DS-ICQF-QEYS-DKZA-JKT",  upload: "2022-07-15 18:16:46",  status: "fail"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "Wea.",  name: "QEYS-DKZA-JKT",  upload: "2023-07-15 18:16:46",  status: "running"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "3D",  name: "3DS-ICQF-QEYS-DKZA-JKT",  upload: "2022-07-15 18:16:46",  status: "fail"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "Wea.",  name: "QEYS-DKZA-JKT",  upload: "2023-07-15 18:16:46",  status: "running"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "2D",  name: "Seoul",  upload: "2024-07-15 18:16:46",  status: "success"},
    { type: "3D",  name: "3DS-ICQF-QEYS-DKZA-JKT",  upload: "2022-07-15 18:16:46",  status: "fail"},
    { type: "Wea.",  name: "QEYS-DKZA-JKT",  upload: "2023-07-15 18:16:46",  status: "running"},
    { type: "Wea.",  name: "QEYS-DKZA-JKT",  upload: "2023-07-15 18:16:46",  status: "running"},
]

type Asset = {
    type: string;
    name: string;
    upload: string;
    status: string;
};

type AssetRowProps = {
    item: Asset;
};

const AssetRow: React.FC<AssetRowProps> = ({ item }) => (
    <tr>
        <td>{item.type}</td>
        <td>
            <div className="name">{item.name}</div>
            <div className="date clear">{item.upload}</div>
        </td>
        <td>
            <button type="button" className={`status-button ${item.status}`}>{item.status}</button>
        </td>
        <td>
            <button type="button" className="function-button log"></button>
            <button type="button" className="function-button down"></button>
            <button type="button" className="function-button delete"></button>
        </td>
    </tr>
);

const AsideAssets = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredAssets = assetsData.filter(asset =>
        (filterStatus === 'all' || asset.status === filterStatus) &&
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="side-bar-wrapper">
            <input type="checkbox" id="toggleButton" />
            <div className="side-bar">
                <div className="side-bar-header">
                    <label htmlFor="toggleButton">
                        <div className="button side">
                            <div className="description--content">
                                <div className="title">Close sidebar</div>
                            </div>
                        </div>
                    </label>
                    <div className="search-container">
                        <button type="button" className="button search"></button>
                        <input
                            id="searchInput"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="content--wrapper">
                    <button type="button" className="table-button float-right">
                        <span className="new-item"></span>
                        New Assets
                    </button>
                    <table className="assets-list">
                        <caption>assets 목록</caption>
                        <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name/Upload Data</th>
                            <th>Status <button type="button" className="status-view"></button></th>
                            <th>Function</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="pop-layer status">
                        <ul>
                            {['all', 'success', 'running', 'fail'].map(status => (
                                <li key={status} className={filterStatus === status ? 'selected' : ''}>
                                    <a href="#" onClick={() => setFilterStatus(status)}>{status}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="y-scroll">
                        <table className="assets-list">
                            <tbody>
                            {filteredAssets.map((item, index) => (
                                <AssetRow key={index} item={item} />
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsideAssets;
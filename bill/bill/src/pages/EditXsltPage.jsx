import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import DownloadButton from "./dowloadbutton.jsx";
import "../assets/style/edit.css"
function EditXsltPage() {
    const [cssSelector,setCssSelector] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [positionMap, setpositionMap] = useState({});
    const [resizingMap, setresizingMap] = useState({});
    const  [cssupdate, setcssupdate] = useState({});
    const [selectedColor,setselectedColor] = useState("#000000");
    const [isDragging, setIsDragging] = useState(false);
    const [ lastTableId, setlastTableId] = useState(null);
    const [colors,setcolors] = useState([]);
    const [count, setCount] = useState(11);
    const [selectedFontFamily, setSelectedFontFamily]= useState('Arial');
    const [fontWeight,setfontWeight]= useState("normal");
    const [fontStyle,setfontStyle] = useState("normal");
    let  previousTable = null ;
    let resizing = false;
    const [tableSelectedColor,settableSelectedColor] = useState("#000000");
    const getShowHtml = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/filecontroller/showXsltDowloadPage");
            console.log("xslt has arrived");
            setHtmlContent(response.data); // HTML içeriğini state'e koy
        } catch (error) {
            console.error("Error fetching html:", error);
            setHtmlContent('Error loading content');
        }
    };

    useEffect(() =>{
        getShowHtml();
    },[]);

    useEffect(() => {

        if (htmlContent) {
            const contentElement = document.getElementById("htmlContent");
            const draggableElements = contentElement.querySelectorAll("[id]");
            const tableElements = contentElement.querySelectorAll("table");

            let lastTextBackground = null;
            tableElements.forEach(table => {
                table.addEventListener("dblclick", event => {
                    const clickedElement = event.target;
                    if (!isDragging) {
                        if (clickedElement.tagName === "TD" || clickedElement.tagName === "TH" || clickedElement.tagName === "TABLE") {
                            const tableElement = clickedElement.closest("table");
                            if (lastTextBackground) {
                                lastTextBackground.style.background = "white";

                            }
                            tableElement.style.background = "blue";
                            setlastTableId(tableElement)
                            lastTextBackground = tableElement;
                            tableElement.style.cursor = "text";
                        }
                    }
                });
            });
            const handleClickEmpty= (event) =>{
                if(!event.target.closest("table") && lastTableId && !event.target.closest("div")){
                    lastTableId.style.background = "white";
                    lastTableId.style.cursor = "default";
                }
                if (!event.target.closest("table")&& previousTable && !event.target.closest("div")){
                    borderDiv.style.display = "none";
                }
            }
            document.body.addEventListener('click', handleClickEmpty);
            tableElements.forEach(table => {
                const borderDiv = contentElement.querySelector("#borderDiv");
                const resizeHandle = contentElement.querySelector("#resize-handle");
                table.addEventListener('mouseenter', () => {

                    if (!table.classList.contains("border")) {
                        table.classList.add("border");
                    }
                });


                table.addEventListener('mouseleave', () => {

                    if (!table.classList.contains("clicked")) {
                        table.classList.remove("border");
                    }
                });
                table.addEventListener("click", () => {
                    if (previousTable && previousTable !== table) {
                        previousTable.classList.remove("borderDiv");
                    }
                    previousTable = table;
                    let initialX, initialY, initialWidth, initialHeight;

                    if (table) {
                        table.classList.add("borderDiv");
                        const tableWidth = table.offsetWidth;
                        const tableHeight = table.offsetHeight;

                        const tableRect = table.getBoundingClientRect();
                        const tableTop = tableRect.top + window.scrollY;
                        const tableLeft = tableRect.left + window.scrollX;
                        borderDiv.style.width = `${tableWidth}px`;
                        borderDiv.style.height = `${tableHeight}px`;
                        borderDiv.style.top = `${tableTop}px`;
                        borderDiv.style.left = `${tableLeft}px`;
                        borderDiv.style.display = "block";
                        resizeHandle.addEventListener("mousedown", (e) => {
                            e.preventDefault();
                            resizing = true;
                            initialX = e.clientX;
                            initialY = e.clientY;
                            initialWidth = table.offsetWidth;
                            initialHeight = table.offsetHeight;
                            window.addEventListener("mousemove", onMouseMove);
                            window.addEventListener("mouseup", onMouseUp);
                        });
                    }

                    function onMouseMove(e) {
                        if (!resizing) return;

                        const dx = e.clientX - initialX;
                        const dy = e.clientY - initialY;

                        previousTable.style.width = `${initialWidth + dx}px`;
                        previousTable.style.height = `${initialHeight + dy}px`;
                        borderDiv.style.width = `${previousTable.offsetWidth}px`;
                        borderDiv.style.height = `${previousTable.offsetHeight}px`;
                        const tableRect = previousTable.getBoundingClientRect();
                        borderDiv.style.top = `${tableRect.top + window.scrollY}px`;
                        borderDiv.style.left = `${tableRect.left + window.scrollX}px`;

                    }

                    function onMouseUp() {
                        let newWidth = previousTable.style.width;
                        let newHeight = previousTable.style.height;
                        const numericWidth = parseInt(newWidth, 10);
                        const numericHeight = parseInt(newHeight, 10);
                        updateResizingMap(previousTable.id, numericWidth, numericHeight);
                        resizing = false;
                        window.removeEventListener("mousemove", onMouseMove);
                        window.removeEventListener("mouseup", onMouseUp);
                    }
                });

            });



            draggableElements.forEach( e =>{
                        e.addEventListener('dragstart',event =>{
                            setCssSelector(event.target.id);
                            document.body.style.cursor="default";
                        })
                    }
                )
                const el = document.getElementById(cssSelector);
                if (el) {
                    el.style.position = "absolute";
                    let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;

                    const handleMouseDown = (e) => {
                        e.preventDefault();
                        startPosX = e.clientX;
                        startPosY = e.clientY;
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                    };

                    const handleMouseMove = (e) => {
                        newPosX = startPosX - e.clientX;
                        newPosY = startPosY - e.clientY;
                        startPosX = e.clientX;
                        startPosY = e.clientY;

                        el.style.top = (el.offsetTop - newPosY) + "px";
                        el.style.left = (el.offsetLeft - newPosX) + "px";
                    };

                    const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                          updatePositionMap();
                    };

                    el.addEventListener('mousedown', handleMouseDown);
                    return () => {
                        el.removeEventListener('mousedown', handleMouseDown);
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);

                    };

                }

        }
    }, [htmlContent, cssSelector]);

    useEffect(() => {
        const tableFont = () => {
            let boldFound = false;
            let italicFound = false;
            let updatefont = 11;
            const boldDiv = document.querySelector(".bold");
            const italicDiv = document.querySelector(".italic");
            if (Object.keys(cssupdate).length > 0) {
                console.log("GÜNCEL CSS İÇERİĞİ",cssupdate);
                const keys = Object.keys(cssupdate);
                for (let i = 0; i < keys.length; i++) {
                    if ( keys[i] === lastTableId.id && cssupdate[keys[i]].fontSize) {
                        let lastFontSize = cssupdate[keys[i]].fontSize;
                         updatefont =  parseInt(lastFontSize.replace('px', '').trim(), 10);
                    }
                    if (keys[i] === lastTableId.id && cssupdate[keys[i]].fontWeight === "bold") {
                        boldFound = true;
                    }
                    if (keys[i] === lastTableId.id && cssupdate[keys[i]].fontStyle === "italic") {
                        italicFound = true;
                    }
                }
            }
            setCount(updatefont);
            if (boldFound) {
                setfontWeight("bold");
                if(!boldDiv.classList.contains("clickbg")){
                    boldDiv.classList.add("clickbg");
                }

            } else {
                setfontWeight("normal");
                if(boldDiv.classList.contains("clickbg")){
                    boldDiv.classList.remove("clickbg");
                }
            }
            if (italicFound) {
                setfontStyle("italic");
                if(!italicDiv.classList.contains("clickbg")){
                    italicDiv.classList.add("clickbg");
                }

            } else {
                setfontStyle("normal");
                if(italicDiv.classList.contains("clickbg")){
                    italicDiv.classList.remove("clickbg");
                }
            }
        };

        tableFont();

    }, [cssupdate,lastTableId]);
    const handleMinusClick = () => {
        setCount(prevCount => {
            if (prevCount > 3) {
                const newCount = prevCount - 1;
                saveCss(lastTableId, 'fontSize', `${newCount}px`);
                return newCount;
            }
            return prevCount;
        });
    };

    const handlePlusClick = () => {
        setCount(prevCount => {
            if (prevCount < 25) {
                const newCount = prevCount + 1;
                saveCss(lastTableId, 'fontSize', `${newCount}px`);
                return newCount;
            }
            return prevCount;
        });
    };
    const save = async () => {
        try {
            const merge =  mergePositionMaps(cssupdate,positionMap);
            const  twoMerge = mergePositionMaps(merge,resizingMap);
            const result = await postUpdateXsltCss(twoMerge);
        }catch (error){
            console.error("Kaydetme hatası",error);
        }

    };

    const mergePositionMaps = (map1, map2) => {
        const mergedMap = { ...map1 };

        for (const key in map2) {
            if (key in mergedMap) {
                if (mergedMap[key]) {
                    mergedMap[key] = {
                        ...mergedMap[key],
                        ...map2[key]
                    };
                }
            }else {
                mergedMap[key] = map2[key];
            }
        }

        return mergedMap;
    };
    const postUpdateXsltCss = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/api/filecontroller/updateXsltCss', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Yanıt:', response.data);
        } catch (error) {
            console.error('Hata:', error.response.data);
        }
    };

    useEffect(() => {
        const getcolor = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/colorcontroller/getallColors");
                const colorCodes = response.data.map(color => color.colorCode);
                setcolors(colorCodes);
            } catch (error) {
                console.log("Error loading colors: ", error);
            }
        };

        getcolor();
    }, []);
    const updatePositionMap = () => {
        const el = document.getElementById(cssSelector);
        if (el) {
            console.log(cssSelector);
            const logoPositionX = el.style.left;
            const logoPositionY = el.style.top;
            setpositionMap(prevMap => {
                const currentPosition = prevMap[cssSelector] || {};
                const newPosition = {
                    top: logoPositionY,
                    left: logoPositionX
                };


                if (currentPosition.top !== undefined && currentPosition.left !== undefined) {
                    return {
                        ...prevMap,
                        [cssSelector]: newPosition
                    };
                } else {
                    return {
                        ...prevMap,
                        [cssSelector]: newPosition
                    };
                }
            });
        }
    };

    const updateResizingMap=(tableID,width,height)=>{
        setresizingMap(prevsizing =>{
            const currentSizing = prevsizing[tableID] || {};
            const newSizing  = {
                width : width + "px",
                height : height + "px"
            };
            if(currentSizing.width !== undefined && currentSizing.height !== undefined){
                return {
                    ...prevsizing,
                    [tableID] : newSizing
                };
            }else{
                return {
                    ...prevsizing,
                    [tableID] : newSizing
                };
            }

        });

    }

    const handleColorSelect = (color) => {
        setselectedColor(color);
    };
    const handleTableColorSelect = (color) => {
        settableSelectedColor(color);
    };

    const openPalette = (e) => {
        const palet = document.querySelector(".colorPalet")

       if(palet.style.display=="block"){
           palet.style.display = "none";
       }else{
           palet.style.display = "block";
       }

    };
    const tableOpenPalet = (e)=>{
        const tablePalet = document.querySelector(".tablePalet");
        if(tablePalet.style.display=="block"){
            tablePalet.style.display = "none";
        }else {
            tablePalet.style.display = "block";
        }
    }

    const saveCss = (tableElement, styleName, styleValue) => {
        if ( tableElement.id) {
            if(styleName ==="borderColor"){
                const tdTh = tableElement.querySelectorAll("td , th ");
                tdTh.forEach(element => {
                    element.style[styleName] = styleValue;
                });
                setcssupdate(prevState => {
                    const currentStyles = prevState[tableElement.id + " td"] || {};
                    const newStyles = {
                        ...currentStyles,
                        [styleName]: styleValue
                    };
                    return {
                        ...prevState,
                        [tableElement.id + " td"]: newStyles
                    };
                });
                setcssupdate(prevState => {
                    const currentStyles = prevState[tableElement.id  + " th"] || {};
                    const newStyles = {
                        ...currentStyles,
                        [styleName]: styleValue
                    };
                    return {
                        ...prevState,
                        [tableElement.id + " th"]: newStyles
                    };
                });
            }
                 setcssupdate(prevState => {
                    const currentStyles = prevState[tableElement.id ] || {};
                    const newStyles = {
                        ...currentStyles,
                        [styleName]: styleValue
                    };
                    return {
                        ...prevState,
                        [tableElement.id ]: newStyles
                    };
                });
                tableElement.style[styleName] = styleValue;


        }
    };









    const handleFontChange = (event) =>{
        const selectedFont = event.target.value;
        saveCss(lastTableId, 'fontFamily', selectedFont);

    }

    const handleBoldClick =() =>{
        const  bold = document.querySelector(".bold");
        if(fontWeight === "normal"){
            setfontWeight("bold");
            saveCss(lastTableId,"fontWeight","bold");
            if(!bold.classList.contains("clickbg")){
                bold.classList.add("clickbg");
            }
        }else{
            setfontWeight("normal");
            saveCss(lastTableId,"fontWeight","normal");
            if(bold.classList.contains("clickbg")){
                bold.classList.remove("clickbg");
            }
        }
    }
    const handleItalicClick =() =>{
        const  italic = document.querySelector(".italic");
        if(fontStyle === "normal"){
            setfontStyle("italic");
            saveCss(lastTableId,"fontStyle","italic");
            if(!italic.classList.contains("clickbg")){
                italic.classList.add("clickbg");
            }
        }else {
            setfontStyle("normal");
            saveCss(lastTableId,"fontStyle","normal");
            if(italic.classList.contains("clickbg")){
                italic.classList.remove("clickbg");
            }

        }

    }


    return (
        <div className="content">
            <div className="editbox">
                <div className="butons">
                    <button onClick={save}>Save</button>
                    <DownloadButton></DownloadButton>
                </div>
                <div className="editcontainer">
                    <div onClick={openPalette} className="color">
                        <span className="bgText">A</span> <br/>
                        <div style={{background: selectedColor}} className="bgColor"></div>
                    </div>
                    <div className="colorPalet">
                        <div className="color-grid">
                            {Array.from({length: 50}).map((_, index) => (
                                <div key={index}
                                     className="color-box"
                                     style={{background: colors.length > 0 ? colors[index % colors.length] : 'transparent'}}
                                     onClick={() => handleColorSelect(colors.length > 0 ? colors[index % colors.length] : 'transparent')}
                                ></div>
                            ))}
                        </div>
                        <div className="selectColor">
                            <span>{selectedColor}</span>
                            <span className="choose" onClick={() => {
                                handleColorSelect(selectedColor);
                                openPalette();
                                saveCss(lastTableId, "color", selectedColor)
                            }}>Seç</span>
                        </div>
                    </div>

                    <div className="font__size">
                        <div onClick={handleMinusClick} className="minus">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 11V13H19V11H5Z"></path>
                            </svg>
                        </div>
                        <div>{count}</div>
                        <div onClick={handlePlusClick} className="plus">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                            </svg>
                        </div>
                    </div>
                    <div onClick={handleBoldClick} className="bold">
                        <span>B</span>
                    </div>
                    <div onClick={handleItalicClick} className="italic">
                        <span>I</span>
                    </div>
                    <div className="fontfamily__choose">
                        <select className="form-select" aria-label="Font Family Selection" onChange={handleFontChange}>
                            <option value="Arial" selected>Arial</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                    </div>
                    <div onClick={tableOpenPalet} className="tableicon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-table" viewBox="0 0 16 16">
                            <path
                                d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                        </svg>
                        <div style={{background: tableSelectedColor}} className="bgColoricon"></div>

                    </div>
                    <div className="tablePalet">
                        <div className="color-grid">
                            {Array.from({length: 50}).map((_, index) => (
                                <div key={index}
                                     className="color-box"
                                     style={{background: colors.length > 0 ? colors[index % colors.length] : 'transparent'}}
                                     onClick={() => handleTableColorSelect(colors.length > 0 ? colors[index % colors.length] : 'transparent')}
                                ></div>
                            ))}
                        </div>
                        <div className="selectColor">
                            <span>{tableSelectedColor}</span>
                            <span className="choose" onClick={() => {
                                handleTableColorSelect(tableSelectedColor);
                                tableOpenPalet();
                                saveCss(lastTableId, "borderColor", tableSelectedColor)
                            }}>Seç</span>
                        </div>
                    </div>
                </div>

            </div>

            <div
                className="invoice"
                id="htmlContent"
                dangerouslySetInnerHTML={{__html: htmlContent}}
            />
        </div>
    );
}

export default EditXsltPage;

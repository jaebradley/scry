import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {useCallback, useState} from "react";

const Carousel = (props: { urls: string[] }) => {
    const [activeUrlIndex, setActiveUrlIndex] = useState<number>(0);
    const handleLeftClick = useCallback(() => {
        setActiveUrlIndex((currentIndex) => {
            if (0 === currentIndex) {
                return props.urls.length - 1;
            }
            return currentIndex - 1;
        });
    }, [setActiveUrlIndex, props.urls]);
    const handleRightClick = useCallback(() => {
        setActiveUrlIndex((currentIndex) => {
            if ((props.urls.length - 1) === currentIndex) {
                return 0;
            }
            return currentIndex + 1;
        });
    }, [setActiveUrlIndex, props.urls]);
    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <div>
                <FontAwesomeIcon icon={faChevronLeft} onClick={handleLeftClick}/>
            </div>
            <div>
                <img src={props.urls[activeUrlIndex]}/>
            </div>
            <div>
                <FontAwesomeIcon icon={faChevronRight} onClick={handleRightClick}/>
            </div>
        </div>
    )
}

export default Carousel;
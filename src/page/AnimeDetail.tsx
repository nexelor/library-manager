import { useParams } from "react-router-dom";
import ReturnButton from "../components/ReturnButton";

export default function AnimeDetail() {
    const { id } = useParams<{ id: string }>();

    return (<div className="anime-detail">
        <div className="return-button"><ReturnButton /></div>
        
        { id }
        <div className="anime-info-plus">
            <img />
        </div>

        <div className="anime-info-minus">

        </div>
    </div>)
}
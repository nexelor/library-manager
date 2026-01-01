import { Outlet, Route, Routes } from "react-router-dom";
import App from "../App";
import AnimeDetail from "../page/AnimeDetail";
import AnimeList from "../page/AnimeList";

export default function AppRouter() {
    return (<Routes>
        <Route path="/" element={ <App /> } />

        <Route path="/anime" element={ <Outlet /> } >
            <Route index element={ <AnimeList /> } />
            <Route path=":id" element={ <AnimeDetail /> } />
        </Route>
    </Routes>)
}
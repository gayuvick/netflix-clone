"use client";

import CircleLoader from "../../components/circle-loader";
import ManageAccounts from "../../components/manage-accounts";
import UnauthPage from "../../components/unauth-page";
import { GlobalContext } from "../../context";
import {  getTVorMovieSearchResults } from "../../utils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar";
import MediaItem from "../../components/media-item";

export default function Search() {
    const {
        loggedInAccount,
        searchResults,
        pageLoader,
        setPageLoader,
        setSearchResults,
    } = useContext(GlobalContext);

    const { data: session } = useSession();
    const params = useParams();

    useEffect(() => {
        async function getSearchResults() {
            const tvShows = await getTVorMovieSearchResults("tv", params.query[0]);
            const movies = await getTVorMovieSearchResults("movie", params.query[0]);

            setSearchResults([
                ...tvShows
                    .filter(
                        (item:any) => item.backdrop_path !== null && item.poster_path !== null
                    )
                    .map((tvShowItem:any) => ({
                        ...tvShowItem,
                        type: "tv",

                    })),
                ...movies
                    .filter(
                        (item:any) => item.backdrop_path !== null && item.poster_path !== null
                    )
                    .map((movieItem:any) => ({
                        ...movieItem,
                        type: "movie",

                    })),
            ]);
            setPageLoader(false);

        }

        getSearchResults();
    }, [loggedInAccount]);

    if (session === null) return <UnauthPage />;
    if (loggedInAccount === null) return <ManageAccounts />;
    if (pageLoader) return <CircleLoader />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <Navbar />
            <div className="mt-[100px] space-y-0.5 md:space-y-2 px-4">
                <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
                    Showing Results for {decodeURI(params.query[0])}
                </h2>
                <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
                    {searchResults && searchResults.length
                        ? searchResults.map((searchItem:any) => (
                            <MediaItem
                                key={searchItem.id}
                                media={searchItem}
                                searchView={true}
                            />
                        ))
                        : null}
                </div>
            </div>
        </motion.div>
    );
}
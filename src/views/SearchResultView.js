import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import lunr from 'lunr';

import MainBar from '../components/shared/MainBar';
import Footer from '../components/shared/Footer';

import { getAllBlogs } from '../helpers/blogLambda';

function SearchResultView({ user, signOut }) {
    let [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState([]);
    const [results, setResults] = useState([]);

    const title = searchParams.get('title');

    useEffect(() => {
        async function init() {
            const res = await getAllBlogs();
            if (res.success === true) {
                setBlogs(res.data);
            }
            return;
        }
        init();
    }, []);

    useEffect(() => {
        // console.log(blogs);
        if (blogs.length > 0) {
            // Create search index
            const idx = lunr(function () {
                this.field('title');
                this.field('body')

                blogs.map((blog) => {
                    this.add({
                        "title": blog.title,
                        "id": blog.blogId
                    })
                });
            });

            // Search index against query string param
            setResults(idx.search(title));
        }
    }, [blogs, title]);

    function List() {
        if (results.length > 0) {
            return results.map((el, index) => {
                const _el = blogs.find((item) => {
                    return item.blogId === el.ref;
                });
                return <div key={index}>{_el.title} <Link to={`/b/${_el.blogId}`}>Go</Link> </div>
            });
        } else {
            return <div>No Results</div>
        }
    }

    try {
        return (
            <div className="search-result-view view" data-testid="searchResultView">
                <MainBar user={user} signOut={signOut} />
                <section className="main-section section">
                    <div className="search-results content">
                        <h1 className="headline">Results for: {title}</h1>
                    </div>
                </section>
                <section className="main-section section">
                    <ul className="search-results content">
                        <List />
                    </ul>
                </section>
                <Footer />
            </div>
        );
    } catch (error) {
        return null;
    }
}

export default SearchResultView;

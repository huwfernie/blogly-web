import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import lunr from 'lunr';

import MainBar from '../components/shared/MainBar';
import Footer from '../components/shared/Footer';

import { getAllBlogs } from '../helpers/blogLambda';

import '../styles/SearchResultView.scss';

function SearchResultView({ user, signOut }) {
    let [searchParams] = useSearchParams();
    const [blogs, setBlogs] = useState([]);
    const [results, setResults] = useState([]);

    const title = searchParams.get('title');

    useEffect(() => {
        async function init() {
            const apiCall = await getAllBlogs();
            if (apiCall.success === true) {
                setBlogs(apiCall.response);
            }
            return;
        }
        init();
    }, []);

    useEffect(() => {
        if (blogs.length > 0 && title !== null) {
            // Create search index
            const idx = lunr(function () {
                this.field('title');
                this.field('body')

                blogs.forEach((blog) => {
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
                return <li key={index}>{_el.title} <Link to={`/b/${_el.blogId}`}>View</Link> </li>
            });
        } else {
            return <div>No Results</div>
        }
    }

    try {
        return (
            <div className="search-result-view view" data-testid="search-result-view">
                <MainBar user={user} signOut={signOut} />
                <section className="main-section section">
                    <div className="headline content">
                        <h1 className="headline">Results for: "{title}"</h1>
                    </div>
                    <ul className="results-list content">
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

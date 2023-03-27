import React, { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, FormControl, ListGroup, Button, Pagination } from 'react-bootstrap';

// FUNCTION 
/* 1. Creating a function component named PostList
    2. Initializing the state variables using "useState" hook
        2.1 'posts' and 'comments' store the data fetched from the API
        2.2 'searchTerm' is used to store the search input provided by the user
        2.3 'selectedPost' is used to store the selected post data
        2.4 'currentPage' is used to store the current page number in the pagination
        2.5  'postsPerPage' is used to store the number of posts to be displayed per page.
*/
function PostList() {
    const [posts, setPosts] = useState([]); // data from API - GET: https://jsonplaceholder.typicode.com/posts
    const [searchTerm, setSearchTerm] = useState(''); // input data
    const [selectedPost, setSelectedPost] = useState(null); // data from API about a specific post {id}
    const [comments, setComments] = useState([]); // data from API - GET https://jsonplaceholder.typicode.com/posts/{id}/comments
    const [currentPage, setCurrentPage] = useState(1); // current page number -> pagination
    const [postsPerPage] = useState(10); // amount of posts per page

    /*
    The useEffect hook is used to fetch the posts data from the API. The data is fetched from the 
    specified URL using the fetch() method. The response is converted to JSON using the json() method 
    and the data is stored in the 'posts' state variable using setPosts() method. 
    If any error occurs, it is logged to the console.
    */

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.log(error));
    }, []);

    /*
    The useEffect hook is used to fetch the comments data from the API when the 'selectedPost' state variable changes. 
    The data is fetched from the specified URL using the fetch() method. The response is converted to JSON using 
    the json() method and the data is stored in the 'comments' state variable using setComments() method. 
    If any error occurs, it is logged to the console.
    */

    useEffect(() => {
        if (selectedPost) {
            fetch(`https://jsonplaceholder.typicode.com/posts/${selectedPost.id}/comments`)
                .then(response => response.json())
                .then(data => setComments(data))
                .catch(error => console.log(error));
        }
    }, [selectedPost]);

    /*The 'filteredPosts' constant is created by filtering the 'posts' state variable based on the 'searchTerm' state variable.
    The filter method checks if the title of each post contains the search term (case insensitive) and returns the filtered array.
    */

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    /*
    This function updates the currentPage state variable based on the page number clicked by the user.
    */

    const paginate = pageNumber => setCurrentPage(pageNumber);

    /*
    This function sets the selectedPost state variable to the post clicked by the user.
    */

    const handleViewPost = post => {
        setSelectedPost(post);
    };

    /*
    This function resets the selectedPost and comments state variables to null and an empty array, respectively.
    */

    const handleClosePost = () => {
        setSelectedPost(null);
        setComments([]);
    };

    /*
    The return statement: This is what is rendered by the component. It includes conditional rendering to display either the 
    list of posts  or the details and comments of a single post based on the selectedPost state variable. The list of posts 
    is displayed in a ListGroup component with a search box above it, and the pagination component below it. The comments associated 
    with the selected post are displayed in a ListGroup component.
    */

    return (
        <Container className='mt-4'>
            <h1 className="text-center mb-4">Posts</h1>
            {selectedPost ? (
                <div>
                    <Button variant="primary" onClick={handleClosePost}>Close</Button>
                    <h2>{selectedPost.title}</h2>
                    <p>{selectedPost.body}</p>
                    <h3>Comments</h3>
                    <ListGroup>
                        {comments.map(comment => (
                            <ListGroup.Item key={comment.id}>
                                <h4>{comment.name}</h4>
                                <p>{comment.body}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            ) : (
                <div>
                    <InputGroup className="mb-3">
                        <FormControl
                            type="text"
                            placeholder="Search by title"
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                        />
                    </InputGroup>
                    <ListGroup>
                        {currentPosts.map(post => (
                            <ListGroup.Item key={post.id}>
                                <Row>
                                    <Col xs={10}>
                                        <a onClick={() => handleViewPost(post)}>
                                            <h2>{post.title}</h2>
                                        </a>

                                    </Col>
                                    <Col xs={2}>
                                        <Button variant="primary" onClick={() => handleViewPost(post)}>View</Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
                                <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default PostList;
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './Components/Header'
import PostFeed from './Components/PostFeed'
import PostDetail from './Components/PostDetail'
import CreatePost from './Components/CreatePost'
import Profile from './Components/Profile'

function App() {
 const username = 'Muzea001';

return (
  <Router>
    <Header username={username} />
    <Routes>
        <Route path="/" element={<PostFeed username={username} />} />
        <Route path="/post/:postId" element={<PostDetail username={username} />} />
        <Route path="/profile/:contactId" element={<Profile username={username} />} />
        <Route path="/create-post" element={<CreatePost username={username} />} />
      </Routes>
  </Router>
)
}

export default App

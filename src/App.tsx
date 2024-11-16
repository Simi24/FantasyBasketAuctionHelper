import './App.css'
import { useState } from 'react';
import Footer from './components/footer'
import Home from './components/home'
import Auction from './components/auction';

function App() {

  const [page, setPage] = useState<string>(() => {
    const savedPage = window.localStorage.getItem('page');
    return savedPage ? savedPage : 'home';
  });

  const handleNavigation = (page: string) => {
    console.log('Navigating to the next page with page:', page);
    window.localStorage.setItem('page', page);
    setPage(page);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        {/*<Header/>*/}
        {page === 'home' &&
        <Home handleNavigation={handleNavigation}/>}
        {page === 'auction' &&
        <Auction handleNavigation={handleNavigation}/>}
        <Footer/>
      </div>
    </>
  )
}

export default App

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function DefaultLayout() {
    return (
        <div className='max-w-[1080px] mx-auto min-h-screen flex flex-col'>
            <Header />
                <main className='flex-1 px-2 py-2'>
                    <Outlet />
                </main>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
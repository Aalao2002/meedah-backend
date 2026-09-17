import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';


function AdminLayout() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="overflow-y-auto min-h-0 flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
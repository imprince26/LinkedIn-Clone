import Navbar from "./Navbar";
const Layout = ({ children }) => {
	return (
		<div className='min-h-screen bg-neutral'>
			<Navbar />
			<main className='md:max-w-7xl w-[100vw] md:mx-auto md:px-4 md:py-6'>{children}</main>
		</div>
	);
};
export default Layout;
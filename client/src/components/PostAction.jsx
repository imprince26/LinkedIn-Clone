export default function PostAction({ icon, text, onClick }) {
	return (
		<button className='flex items-center' onClick={onClick}>
			<span className='mr-2 '>{icon}</span>
			<span className='hidden sm:inline text-gray-300 font-semibold'>{text}</span>
		</button>
	);
}
// SideBarMenu
const toggleIcon = document.querySelector('.toggle__icon');
const sideBar = document.querySelector('.side-bar');


toggleIcon.addEventListener('click', (event) => {
	event.stopPropagation();
	toggleIcon.classList.toggle('active');
	sideBar.classList.toggle('active');
});


// Close side-bar when click on another element
document.addEventListener('click', (event) => {
	const target = event.target;

	const itsMenu = target == sideBar || sideBar.contains(target);
	const itsBtnMenu = target == toggleIcon;
	const menuIsActive = sideBar.classList.contains('active');

	if (!itsMenu && !itsBtnMenu && menuIsActive) {
		toggleIcon.classList.toggle('active');
		sideBar.classList.toggle('active');
	}
});


